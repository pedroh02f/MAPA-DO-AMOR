import { and, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'
import { loveQuizSubmissions, type QuizAnswers } from '@/lib/db/schema'

export const runtime = 'nodejs'

const PRIVACY_NOTICE_VERSION = '2026-11-23'
const ANSWER_KEYS: (keyof QuizAnswers)[] = [
  'situacao_amorosa',
  'dificuldade_amorosa',
  'estilo_amoroso',
  'experiencia_amorosa',
  'desejo_amoroso',
  'objetivo_amoroso',
]
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const NO_STORE_HEADERS = { 'Cache-Control': 'no-store, max-age=0' }

function sameOrigin(request: Request) {
  const originHeader = request.headers.get('origin')
  const browserSameOrigin = request.headers.get('sec-fetch-site') === 'same-origin'
  if (!originHeader || originHeader === 'null') return browserSameOrigin

  try {
    const origin = new URL(originHeader)
    if (origin.origin !== originHeader || !['https:', 'http:'].includes(origin.protocol)) {
      return browserSameOrigin
    }

    const requestUrl = new URL(request.url)
    const forwardedProtocol = request.headers.get('x-forwarded-proto')?.split(',')[0].trim().toLowerCase()
    const protocol = forwardedProtocol === 'https' || forwardedProtocol === 'http'
      ? `${forwardedProtocol}:`
      : requestUrl.protocol
    const hostHeaders = [
      requestUrl.host,
      request.headers.get('host')?.split(',')[0].trim(),
      request.headers.get('x-forwarded-host')?.split(',')[0].trim(),
    ].filter((host): host is string => Boolean(host))
    const forwardedOrigins = hostHeaders.map((host) => `${protocol}//${host.toLowerCase()}`)
    const runtimeOrigins = [
      process.env.V0_RUNTIME_URL,
      process.env.V0_BUILD_URL,
      process.env.V0_DEV_APP_URL,
      process.env.V0_SANDBOX_URL,
      process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
      process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
    ].flatMap((value) => {
      if (!value) return []
      try {
        return [new URL(value.includes('://') ? value : `https://${value}`).origin]
      } catch {
        return []
      }
    })

    return (
      forwardedOrigins.includes(origin.origin) ||
      runtimeOrigins.includes(origin.origin) ||
      browserSameOrigin
    )
  } catch {
    return false
  }
}

function validBirthDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  const today = new Date()
  const todayString = `${today.getUTCFullYear()}-${String(today.getUTCMonth() + 1).padStart(2, '0')}-${String(today.getUTCDate()).padStart(2, '0')}`

  return (
    year >= 1900 &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day &&
    value <= todayString
  )
}

function validAnswers(value: unknown): value is QuizAnswers {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const answers = value as Record<string, unknown>
  if (Object.keys(answers).length !== ANSWER_KEYS.length) return false

  return ANSWER_KEYS.every((key) => ['A', 'B', 'C', 'D'].includes(String(answers[key])))
}

function errorResponse(error: string, status: number) {
  return NextResponse.json({ error }, { status, headers: NO_STORE_HEADERS })
}

async function readJson(request: Request) {
  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (contentLength > 10_000) return null

  const rawBody = await request.text()
  if (rawBody.length > 10_000) return null

  try {
    return JSON.parse(rawBody) as unknown
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return errorResponse('Origem da solicitação não permitida.', 403)
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return errorResponse('Formato de solicitação inválido.', 415)
  }

  const body = await readJson(request)
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return errorResponse('Não foi possível ler suas respostas.', 400)
  }

  const submission = body as Record<string, unknown>
  const firstName = typeof submission.firstName === 'string' ? submission.firstName.trim() : ''
  const validName = !firstName || /^[\p{L}\p{M} .'-]{1,60}$/u.test(firstName)

  if (!validName) return errorResponse('Confira o primeiro nome informado.', 400)
  if (!validBirthDate(submission.birthDate)) return errorResponse('Confira a data de nascimento informada.', 400)
  if (!validAnswers(submission.answers)) return errorResponse('Responda às seis perguntas antes de continuar.', 400)
  if (submission.consentAccepted !== true) return errorResponse('O consentimento é necessário para salvar suas respostas.', 400)
  if (typeof submission.requestKey !== 'string' || !UUID_PATTERN.test(submission.requestKey)) {
    return errorResponse('Não foi possível identificar este quiz. Atualize a página e tente novamente.', 400)
  }

  try {
    const database = getDatabase()
    const inserted = await database
      .insert(loveQuizSubmissions)
      .values({
        idempotencyKey: submission.requestKey,
        firstName: firstName || null,
        birthDate: submission.birthDate,
        answers: submission.answers,
        privacyConsentAt: new Date(),
        privacyNoticeVersion: PRIVACY_NOTICE_VERSION,
      })
      .onConflictDoNothing({ target: loveQuizSubmissions.idempotencyKey })
      .returning({ id: loveQuizSubmissions.id })

    const existing = inserted[0]
      ? inserted[0]
      : await database
          .select({ id: loveQuizSubmissions.id })
          .from(loveQuizSubmissions)
          .where(eq(loveQuizSubmissions.idempotencyKey, submission.requestKey))
          .limit(1)
          .then((rows) => rows[0])

    if (!existing) return errorResponse('Não foi possível salvar suas respostas. Tente novamente.', 503)

    return NextResponse.json({ quizId: existing.id }, {
      status: inserted[0] ? 201 : 200,
      headers: NO_STORE_HEADERS,
    })
  } catch {
    return errorResponse('Não foi possível salvar suas respostas agora. Tente novamente.', 503)
  }
}

export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return errorResponse('Origem da solicitação não permitida.', 403)
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return errorResponse('Formato de solicitação inválido.', 415)
  }

  const body = await readJson(request)
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return errorResponse('Não foi possível verificar o pedido de exclusão.', 400)
  }

  const { quizId, birthDate } = body as Record<string, unknown>
  if (typeof quizId !== 'string' || !UUID_PATTERN.test(quizId) || !validBirthDate(birthDate)) {
    return errorResponse('Confira o código do quiz e a data de nascimento.', 400)
  }

  try {
    const database = getDatabase()
    const deleted = await database
      .delete(loveQuizSubmissions)
      .where(and(
        eq(loveQuizSubmissions.id, quizId),
        eq(loveQuizSubmissions.birthDate, birthDate),
        eq(loveQuizSubmissions.paymentStatus, 'pending'),
        eq(loveQuizSubmissions.reportStatus, 'not_generated'),
      ))
      .returning({ id: loveQuizSubmissions.id })

    if (!deleted.length) return errorResponse('Não foi possível localizar um quiz pendente com esses dados para exclusão.', 404)

    return new NextResponse(null, { status: 204, headers: NO_STORE_HEADERS })
  } catch {
    return errorResponse('Não foi possível excluir seus dados agora. Tente novamente.', 503)
  }
}
