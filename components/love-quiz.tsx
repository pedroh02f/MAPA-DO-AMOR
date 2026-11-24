'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clipboard,
  Heart,
  LockKeyhole,
  Moon,
  Sparkles,
  Trash2,
} from 'lucide-react'

type AnswerChoice = 'A' | 'B' | 'C' | 'D'
type AnswerKey =
  | 'situacao_amorosa'
  | 'dificuldade_amorosa'
  | 'estilo_amoroso'
  | 'experiencia_amorosa'
  | 'desejo_amoroso'
  | 'objetivo_amoroso'
type QuizAnswers = Record<AnswerKey, AnswerChoice>
type DateParts = { day: string; month: string; year: string }
type Screen = 'welcome' | 'birth' | 'question' | 'analyzing' | 'error' | 'result'

const PRIVACY_NOTICE_VERSION = '2026-11-23'
// Produto digital único: todas as compradoras recebem o mesmo e-book pela Kiwify.
// Antes de publicar, confirme que o PDF está cadastrado e a entrega automática foi testada.
const KIWIFY_CHECKOUT_URL = 'https://pay.kiwify.com.br/xy7oOc7'
const ANSWER_CHOICES: AnswerChoice[] = ['A', 'B', 'C', 'D']

const ANALYSIS_STEPS = [
  'Analisando suas respostas...',
  'Explorando seu perfil amoroso...',
  'Preparando seu Mapa do Amor...',
]

const questions: {
  key: AnswerKey
  prompt: string
  options: { code: AnswerChoice; text: string }[]
}[] = [
  {
    key: 'situacao_amorosa',
    prompt: 'Como está seu coração neste momento?',
    options: [
      { code: 'A', text: 'Estou solteira e quero encontrar um amor verdadeiro.' },
      { code: 'B', text: 'Estou em um relacionamento, mas tenho dúvidas.' },
      { code: 'C', text: 'Passei por uma decepção e estou tentando recomeçar.' },
      { code: 'D', text: 'Estou bem comigo mesma, mas aberta ao amor.' },
    ],
  },
  {
    key: 'dificuldade_amorosa',
    prompt: 'O que mais machuca você nos relacionamentos?',
    options: [
      { code: 'A', text: 'Me entregar demais e receber pouco.' },
      { code: 'B', text: 'Ter dificuldade para confiar novamente.' },
      { code: 'C', text: 'Sentir que não sou valorizada.' },
      { code: 'D', text: 'Ter medo de ficar sozinha.' },
    ],
  },
  {
    key: 'estilo_amoroso',
    prompt: 'Quando você ama alguém, como costuma agir?',
    options: [
      { code: 'A', text: 'Demonstro carinho e faço de tudo pela pessoa.' },
      { code: 'B', text: 'Sou intensa e gosto de demonstrar meus sentimentos.' },
      { code: 'C', text: 'Tenho sentimentos profundos, mas demoro para me abrir.' },
      { code: 'D', text: 'Valorizo meu espaço e preciso de liberdade.' },
    ],
  },
  {
    key: 'experiencia_amorosa',
    prompt: 'Qual situação mais se parece com sua história amorosa?',
    options: [
      { code: 'A', text: 'Já insisti em alguém que não correspondia.' },
      { code: 'B', text: 'Já tive minha confiança quebrada.' },
      { code: 'C', text: 'Já deixei meus próprios desejos em segundo plano.' },
      { code: 'D', text: 'Ainda estou descobrindo o que realmente quero.' },
    ],
  },
  {
    key: 'desejo_amoroso',
    prompt: 'O que você mais deseja encontrar em um relacionamento?',
    options: [
      { code: 'A', text: 'Segurança, fidelidade e compromisso.' },
      { code: 'B', text: 'Paixão, romance e intensidade.' },
      { code: 'C', text: 'Companheirismo, carinho e respeito.' },
      { code: 'D', text: 'Liberdade, leveza e crescimento conjunto.' },
    ],
  },
  {
    key: 'objetivo_amoroso',
    prompt: 'O que você mais gostaria de transformar na sua vida amorosa?',
    options: [
      { code: 'A', text: 'Aprender a reconhecer quem realmente me valoriza.' },
      { code: 'B', text: 'Recuperar minha confiança e superar o passado.' },
      { code: 'C', text: 'Encontrar alguém emocionalmente compatível comigo.' },
      { code: 'D', text: 'Fortalecer meu amor-próprio e meus limites.' },
    ],
  },
]

const reflections: Record<AnswerKey, Record<AnswerChoice, string>> = {
  situacao_amorosa: {
    A: 'Sua resposta mostra abertura para novas conexões e vontade de encontrar um amor verdadeiro.',
    B: 'Você indica que está em um relacionamento e busca mais clareza sobre o que sente.',
    C: 'Você sinaliza que está atravessando um recomeço depois de uma decepção.',
    D: 'Sua resposta valoriza o bem-estar consigo mesma, mantendo abertura para o amor.',
  },
  dificuldade_amorosa: {
    A: 'A reciprocidade é um ponto de atenção para você: oferecer cuidado sem deixar suas próprias necessidades de lado.',
    B: 'A confiança aparece como um tema importante na sua jornada, respeitando seu tempo para reconstruí-la.',
    C: 'Sentir-se valorizada é uma necessidade que merece espaço nas suas relações.',
    D: 'Sua resposta aponta para o desejo de cultivar segurança emocional sem abrir mão da própria autonomia.',
  },
  estilo_amoroso: {
    A: 'Você demonstra afeto por meio do cuidado e da dedicação.',
    B: 'Você vive e comunica seus sentimentos com intensidade.',
    C: 'Seus sentimentos são profundos e você costuma precisar de tempo para se abrir.',
    D: 'Você valoriza sua autonomia e precisa de espaço dentro de um vínculo.',
  },
  experiencia_amorosa: {
    A: 'Você relata já ter insistido em alguém que não correspondia.',
    B: 'Você relata que já teve sua confiança quebrada.',
    C: 'Você relata ter colocado seus desejos em segundo plano.',
    D: 'Você ainda está descobrindo o que realmente deseja de uma relação.',
  },
  desejo_amoroso: {
    A: 'Você busca segurança, fidelidade e compromisso.',
    B: 'Você deseja paixão, romance e intensidade.',
    C: 'Companheirismo, carinho e respeito estão entre o que você procura.',
    D: 'Você valoriza a liberdade, a leveza e o crescimento conjunto.',
  },
  objetivo_amoroso: {
    A: 'Seu próximo passo pode ser reconhecer com mais clareza quem oferece valorização e reciprocidade.',
    B: 'Seu objetivo é recuperar a confiança e olhar para o passado com mais gentileza.',
    C: 'Você quer construir uma relação com mais compatibilidade emocional.',
    D: 'Você deseja fortalecer o amor-próprio e definir limites que façam sentido para você.',
  },
}

const zodiacSigns = [
  { name: 'Capricórnio', endMonth: 1, endDay: 19, startMonth: 12, startDay: 22, meaning: 'Na leitura simbólica, Capricórnio convida a refletir sobre compromisso, constância e construção de confiança ao longo do tempo.' },
  { name: 'Aquário', endMonth: 2, endDay: 18, startMonth: 1, startDay: 20, meaning: 'Na leitura simbólica, Aquário convida a refletir sobre autenticidade, amizade e espaço individual nas relações.' },
  { name: 'Peixes', endMonth: 3, endDay: 20, startMonth: 2, startDay: 19, meaning: 'Na leitura simbólica, Peixes convida a refletir sobre sensibilidade, imaginação e limites cuidadosos.' },
  { name: 'Áries', endMonth: 4, endDay: 19, startMonth: 3, startDay: 21, meaning: 'Na leitura simbólica, Áries convida a refletir sobre iniciativa, desejo e a coragem de expressar o que importa.' },
  { name: 'Touro', endMonth: 5, endDay: 20, startMonth: 4, startDay: 20, meaning: 'Na leitura simbólica, Touro convida a refletir sobre segurança, presença e os pequenos gestos de cuidado.' },
  { name: 'Gêmeos', endMonth: 6, endDay: 20, startMonth: 5, startDay: 21, meaning: 'Na leitura simbólica, Gêmeos convida a refletir sobre diálogo, curiosidade e troca de ideias.' },
  { name: 'Câncer', endMonth: 7, endDay: 22, startMonth: 6, startDay: 21, meaning: 'Na leitura simbólica, Câncer convida a refletir sobre acolhimento, intimidade e a importância de se sentir em casa.' },
  { name: 'Leão', endMonth: 8, endDay: 22, startMonth: 7, startDay: 23, meaning: 'Na leitura simbólica, Leão convida a refletir sobre generosidade, expressão e reconhecimento mútuo.' },
  { name: 'Virgem', endMonth: 9, endDay: 22, startMonth: 8, startDay: 23, meaning: 'Na leitura simbólica, Virgem convida a refletir sobre atenção, cuidado cotidiano e expectativas realistas.' },
  { name: 'Libra', endMonth: 10, endDay: 22, startMonth: 9, startDay: 23, meaning: 'Na leitura simbólica, Libra convida a refletir sobre parceria, equilíbrio e conversas honestas.' },
  { name: 'Escorpião', endMonth: 11, endDay: 21, startMonth: 10, startDay: 23, meaning: 'Na leitura simbólica, Escorpião convida a refletir sobre profundidade, confiança e vulnerabilidade no próprio ritmo.' },
  { name: 'Sagitário', endMonth: 12, endDay: 21, startMonth: 11, startDay: 22, meaning: 'Na leitura simbólica, Sagitário convida a refletir sobre franqueza, descoberta e liberdade compartilhada.' },
]

const lifePathMeanings: Record<number, string> = {
  1: 'A simbologia do número 1 pode servir como convite à iniciativa e à expressão das próprias escolhas.',
  2: 'A simbologia do número 2 pode servir como convite à escuta, à cooperação e ao equilíbrio entre dar e receber.',
  3: 'A simbologia do número 3 pode servir como convite à expressão autêntica e a conversas com leveza.',
  4: 'A simbologia do número 4 pode servir como convite à construção de vínculos com segurança e consistência.',
  5: 'A simbologia do número 5 pode servir como convite a acolher mudanças sem perder de vista seus limites.',
  6: 'A simbologia do número 6 pode servir como convite ao cuidado mútuo sem esquecer de cuidar de si.',
  7: 'A simbologia do número 7 pode servir como convite à introspecção e ao respeito pelo próprio tempo.',
  8: 'A simbologia do número 8 pode servir como convite à autonomia e a relações com trocas mais equilibradas.',
  9: 'A simbologia do número 9 pode servir como convite a encerrar ciclos com gentileza e abrir espaço para novas escolhas.',
}

function padDatePart(value: string) {
  return value.padStart(2, '0')
}

function createBirthDate(parts: DateParts) {
  const day = Number(parts.day)
  const month = Number(parts.month)
  const year = Number(parts.year)

  if (!parts.day || !parts.month || !parts.year || !Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) {
    return null
  }

  const date = new Date(Date.UTC(year, month - 1, day))
  const today = new Date()
  const dateString = `${year}-${padDatePart(String(month))}-${padDatePart(String(day))}`
  const todayString = `${today.getFullYear()}-${padDatePart(String(today.getMonth() + 1))}-${padDatePart(String(today.getDate()))}`

  if (
    year < 1900 ||
    year > today.getFullYear() ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day ||
    dateString > todayString
  ) {
    return null
  }

  return dateString
}

function getZodiac(birthDate: string) {
  const [, monthText, dayText] = birthDate.split('-')
  const month = Number(monthText)
  const day = Number(dayText)
  const current = month * 100 + day
  const sign = zodiacSigns.find((item) => {
    const startsAt = item.startMonth * 100 + item.startDay
    const endsAt = item.endMonth * 100 + item.endDay
    return startsAt > endsAt ? current >= startsAt || current <= endsAt : current >= startsAt && current <= endsAt
  })

  return sign ?? zodiacSigns[0]
}

function getLifePathNumber(birthDate: string) {
  const digits = birthDate.replaceAll('-', '')
  let total = digits.split('').reduce((sum, digit) => sum + Number(digit), 0)

  while (total > 9) {
    total = String(total).split('').reduce((sum, digit) => sum + Number(digit), 0)
  }

  return total
}

const summaryPhrases: Record<AnswerKey, Record<AnswerChoice, string>> = {
  situacao_amorosa: {
    A: 'está solteira e aberta a conhecer um amor verdadeiro',
    B: 'está em um relacionamento e busca clareza',
    C: 'está recomeçando após uma decepção',
    D: 'está bem consigo e aberta ao amor',
  },
  dificuldade_amorosa: {
    A: 'o equilíbrio entre o que oferece e o que recebe',
    B: 'confiar novamente',
    C: 'sentir-se valorizada',
    D: 'o medo de ficar sozinha',
  },
  estilo_amoroso: {
    A: 'demonstra afeto com carinho e dedicação',
    B: 'expressa os sentimentos com intensidade',
    C: 'ama com profundidade, no próprio tempo',
    D: 'valoriza o espaço pessoal e a liberdade',
  },
  experiencia_amorosa: {
    A: 'já insistiu em alguém que não correspondia',
    B: 'já teve a confiança quebrada',
    C: 'já colocou os próprios desejos em segundo plano',
    D: 'ainda está descobrindo o que realmente quer',
  },
  desejo_amoroso: {
    A: 'segurança, fidelidade e compromisso',
    B: 'paixão, romance e intensidade',
    C: 'companheirismo, carinho e respeito',
    D: 'liberdade, leveza e crescimento conjunto',
  },
  objetivo_amoroso: {
    A: 'aprender a reconhecer quem realmente a valoriza',
    B: 'recuperar a confiança e superar o passado',
    C: 'encontrar alguém emocionalmente compatível',
    D: 'fortalecer o amor-próprio e os limites',
  },
}

function formatDisplayName(value: string) {
  return value
    .trim()
    .toLocaleLowerCase('pt-BR')
    .replace(/(^|[\s'-])(\p{L})/gu, (_, separator: string, letter: string) => `${separator}${letter.toLocaleUpperCase('pt-BR')}`)
}

function getQuestionSummary(answers: QuizAnswers, firstName: string) {
  const namePrefix = firstName ? `${firstName}, ` : ''
  const subject = firstName ? 'você' : 'Você'

  return [
    `${namePrefix}${subject} ${summaryPhrases.situacao_amorosa[answers.situacao_amorosa]} e ${summaryPhrases.estilo_amoroso[answers.estilo_amoroso]}.`,
    `Uma dificuldade importante para você é ${summaryPhrases.dificuldade_amorosa[answers.dificuldade_amorosa]}; você também relata que ${summaryPhrases.experiencia_amorosa[answers.experiencia_amorosa]}.`,
    `Você busca ${summaryPhrases.desejo_amoroso[answers.desejo_amoroso]} e gostaria de ${summaryPhrases.objetivo_amoroso[answers.objetivo_amoroso]}.`,
  ].join(' ')
}

function Brand() {
  return (
    <div className="quiz-brand" aria-label="Mapa do Amor">
      <span className="quiz-brand-mark" aria-hidden="true"><Moon /><Sparkles /></span>
      <span>Mapa <em>do Amor</em></span>
    </div>
  )
}

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <>
      <header className="quiz-topbar">
        <Brand />
        <span className="quiz-topbar-note"><LockKeyhole aria-hidden="true" /> Uma jornada privada e no seu ritmo</span>
      </header>
      <section className="quiz-welcome" aria-labelledby="welcome-title">
        <div className="welcome-copy">
          <p className="quiz-eyebrow"><span /> UM CONVITE PARA OLHAR PARA DENTRO</p>
          <h1 id="welcome-title">Descubra os Segredos do <em>Seu Coração</em></h1>
          <p className="welcome-subtitle">
            Sua maneira de amar conta uma história única. Responda a este teste gratuito e descubra o que seu Mapa do Amor pode revelar sobre você.
          </p>
          <button className="quiz-primary-button welcome-button" onClick={onStart} type="button">
            QUERO DESCOBRIR MEU MAPA DO AMOR <ArrowRight aria-hidden="true" />
          </button>
          <p className="welcome-assurance"><Heart aria-hidden="true" /> Gratuito, sem compromisso e sem previsões sobre o futuro.</p>
        </div>
        <div className="welcome-art">
          <div className="welcome-art-halo" aria-hidden="true" />
          <div className="welcome-art-frame">
            <Image
              src="/mapa-do-amor-celestial.png"
              alt="Arte celestial com um astrolábio dourado, lua crescente e uma rosa sobre veludo vinho"
              fill
              priority
              sizes="(max-width: 760px) 88vw, 44vw"
            />
          </div>
          <span className="welcome-art-caption"><Sparkles aria-hidden="true" /> Um mapa para olhar para dentro</span>
        </div>
      </section>
      <div className="quiz-welcome-footer">
        <span>MAPA DO AMOR</span><i aria-hidden="true" /><span>UMA LEITURA SIMBÓLICA DE AUTOCONHECIMENTO</span>
      </div>
    </>
  )
}

function ProgressHeader({ step, onBack }: { step: number; onBack: () => void }) {
  const currentStep = step + 1
  const percent = (currentStep / 7) * 100

  return (
    <header className="quiz-progress-header">
      <div className="quiz-progress-topline">
        <button className="quiz-back-button" onClick={onBack} type="button" aria-label="Voltar">
          <ArrowLeft aria-hidden="true" /><span>Voltar</span>
        </button>
        <Brand />
        <span className="quiz-step-count">ETAPA {currentStep} DE 7</span>
      </div>
      <div
        className="quiz-progress-track"
        role="progressbar"
        aria-label={`Progresso do quiz: etapa ${currentStep} de 7`}
        aria-valuemin={0}
        aria-valuemax={7}
        aria-valuenow={currentStep}
      >
        <span style={{ width: `${percent}%` }} />
      </div>
    </header>
  )
}

function BirthDateScreen({
  firstName,
  dateParts,
  consent,
  formError,
  onNameChange,
  onDateChange,
  onConsentChange,
  onContinue,
}: {
  firstName: string
  dateParts: DateParts
  consent: boolean
  formError: string
  onNameChange: (value: string) => void
  onDateChange: (field: keyof DateParts, value: string) => void
  onConsentChange: (value: boolean) => void
  onContinue: () => void
}) {
  const currentYear = new Date().getFullYear()

  return (
    <section className="quiz-step-content" aria-labelledby="birth-title">
      <div className="quiz-question-intro">
        <p className="quiz-eyebrow quiz-eyebrow-dark"><span /> SUA HISTÓRIA COMEÇA AQUI</p>
        <h1 id="birth-title">Tudo começa no dia em que você nasceu...</h1>
        <p>Vamos iniciar com duas informações para personalizar sua prévia.</p>
      </div>
      <div className="quiz-form-card">
        <label className="quiz-field-label" htmlFor="first-name">
          Primeiro nome <span>opcional</span>
        </label>
        <input
          className="quiz-text-input"
          id="first-name"
          type="text"
          autoComplete="given-name"
          maxLength={60}
          placeholder="Como podemos chamar você?"
          value={firstName}
          onChange={(event) => onNameChange(event.target.value)}
        />
        <fieldset className="birth-date-fieldset">
          <legend className="quiz-field-label">Data de nascimento</legend>
          <div className="birth-date-fields">
            <label>
              <span>Dia</span>
              <input className="quiz-text-input" type="number" inputMode="numeric" autoComplete="bday-day" min={1} max={31} placeholder="DD" value={dateParts.day} onChange={(event) => onDateChange('day', event.target.value)} aria-label="Dia de nascimento" />
            </label>
            <label>
              <span>Mês</span>
              <input className="quiz-text-input" type="number" inputMode="numeric" autoComplete="bday-month" min={1} max={12} placeholder="MM" value={dateParts.month} onChange={(event) => onDateChange('month', event.target.value)} aria-label="Mês de nascimento" />
            </label>
            <label>
              <span>Ano</span>
              <input className="quiz-text-input" type="number" inputMode="numeric" autoComplete="bday-year" min={1900} max={currentYear} placeholder="AAAA" value={dateParts.year} onChange={(event) => onDateChange('year', event.target.value)} aria-label="Ano de nascimento" />
            </label>
          </div>
        </fieldset>
        <div className="quiz-privacy-box" id="quiz-privacy">
          <div className="privacy-heading"><LockKeyhole aria-hidden="true" /><span>Seus dados são tratados com cuidado</span></div>
          <p>Seu nome é opcional. A data e as respostas são enviadas ao servidor e armazenadas no Neon para registrar seu quiz e mostrar sua prévia. A compra é opcional e feita diretamente no site da Kiwify. As respostas do quiz não são enviadas à Kiwify.</p>
          <details className="privacy-more">
            <summary>Leia sobre seus dados e consentimento</summary>
            <p>O envio das respostas só ocorre depois do seu consentimento. Esta página não usa suas respostas para publicidade nem as envia à Kiwify. Você pode solicitar a exclusão do registro através do controle apresentado no resultado, enquanto ele estiver pendente. Antes da publicação comercial, informe na política de privacidade quem é o responsável pelo tratamento, o contato e o prazo de retenção. Aviso de privacidade: {PRIVACY_NOTICE_VERSION}.</p>
          </details>
          <label className="consent-label">
            <input type="checkbox" checked={consent} onChange={(event) => onConsentChange(event.target.checked)} />
            <span>Concordo com o uso da data e das respostas para processar o quiz e gerar minha prévia personalizada.</span>
          </label>
        </div>
        {formError && <p className="quiz-error-message" role="alert">{formError}</p>}
        <button className="quiz-primary-button quiz-continue-button" type="button" onClick={onContinue}>
          CONTINUAR <ArrowRight aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}

function QuestionScreen({
  question,
  selected,
  formError,
  onSelect,
  onContinue,
}: {
  question: (typeof questions)[number]
  selected?: AnswerChoice
  formError: string
  onSelect: (choice: AnswerChoice) => void
  onContinue: () => void
}) {
  return (
    <section className="quiz-step-content question-content" aria-labelledby="question-title">
      <div className="quiz-question-intro">
        <p className="quiz-eyebrow quiz-eyebrow-dark"><span /> UMA PERGUNTA DE CADA VEZ</p>
        <h1 id="question-title">{question.prompt}</h1>
        <p>Escolha a alternativa que mais combina com você neste momento.</p>
      </div>
      <fieldset className="answer-fieldset">
        <legend className="sr-only">{question.prompt}</legend>
        <div className="answer-options">
          {question.options.map((option) => (
            <label className="answer-choice" data-selected={selected === option.code} key={option.code}>
              <input
                type="radio"
                name={question.key}
                value={option.code}
                checked={selected === option.code}
                onChange={() => onSelect(option.code)}
              />
              <span className="answer-letter">{option.code}</span>
              <span className="answer-text">{option.text}</span>
              <span className="answer-check" aria-hidden="true"><Check /></span>
            </label>
          ))}
        </div>
      </fieldset>
      {formError && <p className="quiz-error-message" role="alert">{formError}</p>}
      <button className="quiz-primary-button quiz-continue-button" type="button" onClick={onContinue} disabled={!selected}>
        {question.key === 'objetivo_amoroso' ? 'VER MINHA PRÉVIA' : 'CONTINUAR'} <ArrowRight aria-hidden="true" />
      </button>
    </section>
  )
}

function AnalysisScreen({ currentStep }: { currentStep: number }) {
  return (
    <section className="analysis-screen" aria-live="polite" aria-busy="true">
      <div className="analysis-orbit" aria-hidden="true"><Moon /><span><Sparkles /></span></div>
      <p className="quiz-eyebrow"><span /> UM INSTANTE PARA VOCÊ</p>
      <h1>{ANALYSIS_STEPS[currentStep]}</h1>
      <p>Cruzando suas escolhas com as informações que você compartilhou.</p>
      <div className="analysis-dots" aria-hidden="true"><i /><i /><i /></div>
    </section>
  )
}

function QuizPurchaseButton({ compact = false }: { compact?: boolean }) {
  const label = compact ? 'QUERO MEU MAPA DO AMOR' : 'QUERO MEU MAPA DO AMOR'

  return (
    <a
      className={compact ? 'quiz-primary-button quiz-purchase-button quiz-purchase-compact' : 'quiz-primary-button quiz-purchase-button'}
      href={KIWIFY_CHECKOUT_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} — R$ 22,90, abrir checkout da Kiwify`}
    >
      <span className="quiz-purchase-label">{label}</span>
      {!compact && <span className="quiz-purchase-price">— R$ 22,90</span>}
      <ArrowRight aria-hidden="true" />
    </a>
  )
}

function QuizOffer() {
  const included = [
    'Guia dos 12 signos no amor',
    'Combinações e compatibilidade entre signos',
    'Numerologia das datas de nascimento',
    'Como reconhecer padrões afetivos',
    'Dicas de diálogo e reciprocidade no casal',
    'Plano prático de 30 dias',
  ]

  return (
    <section className="quiz-offer" aria-labelledby="full-map-title">
      <p className="quiz-eyebrow"><span /> O PRÓXIMO CAPÍTULO É SEU</p>
      <h2 id="full-map-title">Seu coração tem uma história. Conheça o guia completo do Mapa do Amor!</h2>
      <p className="quiz-offer-description">Um e-book completo para consultar conforme o seu signo, suas datas e sua situação amorosa. O mesmo guia é entregue a todas as compradoras pela Kiwify.</p>
      <div className="quiz-offer-card">
        <div className="quiz-offer-card-heading">
          <span>MAPA DO AMOR COMPLETO</span>
          <strong>R$ 22,90</strong>
          <span className="quiz-payment-note">PAGAMENTO ÚNICO</span>
        </div>
        <ul>{included.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul>
        <QuizPurchaseButton />
        <p className="quiz-payment-status">Pagamento e entrega do e-book digital pela Kiwify. O conteúdo pago é um guia único, não um relatório gerado com suas respostas.</p>
      </div>
      <p className="quiz-symbolic-disclaimer">Astrologia e numerologia são apresentadas como interpretações simbólicas de autoconhecimento, não como previsões cientificamente comprovadas.</p>
    </section>
  )
}

function MobilePurchaseBar() {
  const [contentBehindBar, setContentBehindBar] = useState(true)

  useEffect(() => {
    const updateBarVisibility = () => {
      const bar = document.querySelector<HTMLElement>('.mobile-purchase-bar')
      if (!bar) return

      const coveredContent = Array.from(document.querySelectorAll(
        '.result-hero h1, .result-symbol-card, .result-summary, .result-symbolic-note, .quiz-offer h2, .quiz-offer-description, .quiz-offer-card, .quiz-symbolic-disclaimer, .quiz-id-card, .result-details, .quiz-data-controls, .quiz-footer',
      )).some((element) => {
        const bounds = element.getBoundingClientRect()
        const barTop = window.innerHeight - bar.offsetHeight
        return bounds.top < window.innerHeight && bounds.bottom > barTop
      })

      setContentBehindBar(coveredContent)
    }

    updateBarVisibility()
    window.addEventListener('scroll', updateBarVisibility, { passive: true })
    window.addEventListener('resize', updateBarVisibility)
    return () => {
      window.removeEventListener('scroll', updateBarVisibility)
      window.removeEventListener('resize', updateBarVisibility)
    }
  }, [])

  return (
    <aside
      className={contentBehindBar ? 'mobile-purchase-bar mobile-purchase-bar-hidden' : 'mobile-purchase-bar'}
      aria-label="Oferta do Mapa do Amor"
      aria-hidden={contentBehindBar || undefined}
    >
      <div className="mobile-purchase-price">
        <strong>R$ 22,90</strong>
        <span>Pagamento único</span>
      </div>
      <QuizPurchaseButton compact />
    </aside>
  )
}

function ResultScreen({
  birthDate,
  firstName,
  answers,
  quizId,
  copied,
  deleted,
  deletePrompt,
  deleteError,
  onCopy,
  onAskDelete,
  onCancelDelete,
  onDelete,
}: {
  birthDate: string
  firstName: string
  answers: QuizAnswers
  quizId: string
  copied: boolean
  deleted: boolean
  deletePrompt: boolean
  deleteError: string
  onCopy: () => void
  onAskDelete: () => void
  onCancelDelete: () => void
  onDelete: () => void
}) {
  const zodiac = getZodiac(birthDate)
  const lifePath = getLifePathNumber(birthDate)

  return (
    <div className="quiz-result-content">
      <section className="result-hero" aria-labelledby="result-title">
        <p className="quiz-eyebrow"><span /> SUA PRÉVIA PERSONALIZADA</p>
        <h1 id="result-title">Seu Mapa do Amor começou a se revelar</h1>
        <div className="result-celestial-row">
          <article className="result-symbol-card">
            <span className="result-card-label">SIGNO SOLAR</span>
            <Moon aria-hidden="true" />
            <h2>{zodiac.name}</h2>
            <p>{zodiac.meaning}</p>
          </article>
          <article className="result-symbol-card">
            <span className="result-card-label">CAMINHO DE VIDA</span>
            <span className="life-path-number">{lifePath}</span>
            <h2>Número {lifePath}</h2>
            <p>{lifePathMeanings[lifePath]}</p>
          </article>
        </div>
        <p className="result-summary">{getQuestionSummary(answers, firstName)}</p>
        <p className="result-symbolic-note">Astrologia e numerologia aparecem aqui como linguagens simbólicas de reflexão — não como ciência, diagnóstico ou previsão.</p>
      </section>

      <QuizOffer />
      <MobilePurchaseBar />

      <section className="quiz-id-card" aria-label="Identificador do quiz">
        <div><span className="result-card-label">SEU IDENTIFICADOR</span><p>Guarde este código somente se precisar identificar seu registro do quiz. Ele não é necessário para comprar o e-book.</p><code>{quizId}</code></div>
        <button className="quiz-copy-button" type="button" onClick={onCopy}><Clipboard aria-hidden="true" />{copied ? 'Copiado' : 'Copiar código'}</button>
      </section>

      <details className="result-details">
        <summary>Ver a leitura detalhada das seis respostas</summary>
        <section className="result-reading" aria-labelledby="reading-title">
          <div className="result-reading-heading">
            <p className="quiz-eyebrow quiz-eyebrow-dark"><span /> UM RETRATO FEITO DAS SUAS ESCOLHAS</p>
            <h2 id="reading-title">Um olhar para a sua história</h2>
          </div>
          <div className="reading-list">
            <article><span>01</span><div><h3>O momento que você descreveu</h3><p>{reflections.situacao_amorosa[answers.situacao_amorosa]}</p></div></article>
            <article><span>02</span><div><h3>Um ponto que merece acolhimento</h3><p>{reflections.dificuldade_amorosa[answers.dificuldade_amorosa]}</p></div></article>
            <article><span>03</span><div><h3>Seu jeito de demonstrar amor</h3><p>{reflections.estilo_amoroso[answers.estilo_amoroso]}</p></div></article>
            <article><span>04</span><div><h3>Uma experiência que você compartilhou</h3><p>{reflections.experiencia_amorosa[answers.experiencia_amorosa]}</p></div></article>
            <article><span>05</span><div><h3>O que você deseja encontrar</h3><p>{reflections.desejo_amoroso[answers.desejo_amoroso]}</p></div></article>
            <article><span>06</span><div><h3>Um conselho para o próximo passo</h3><p>{reflections.objetivo_amoroso[answers.objetivo_amoroso]}</p></div></article>
          </div>
        </section>
      </details>

      <section className="quiz-data-controls" aria-label="Controle dos seus dados">
        {deleted ? (
          <p className="deleted-confirmation" role="status"><Check aria-hidden="true" /> Seus dados deste quiz foram excluídos.</p>
        ) : deletePrompt ? (
          <div className="delete-confirmation">
            <p>Deseja excluir permanentemente suas respostas e a data de nascimento deste quiz?</p>
            {deleteError && <p className="quiz-error-message" role="alert">{deleteError}</p>}
            <div><button className="delete-confirm-button" type="button" onClick={onDelete}>Sim, excluir meus dados</button><button className="delete-cancel-button" type="button" onClick={onCancelDelete}>Manter meus dados</button></div>
          </div>
        ) : (
          <button className="delete-request-button" type="button" onClick={onAskDelete}><Trash2 aria-hidden="true" /> Excluir os dados deste quiz</button>
        )}
      </section>
    </div>
  )
}

function wait(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds))
}

export default function LoveQuiz() {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [step, setStep] = useState(0)
  const [firstName, setFirstName] = useState('')
  const [dateParts, setDateParts] = useState<DateParts>({ day: '', month: '', year: '' })
  const [consent, setConsent] = useState(false)
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({})
  const [formError, setFormError] = useState('')
  const [analysisStep, setAnalysisStep] = useState(0)
  const [quizId, setQuizId] = useState('')
  const [copied, setCopied] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [deletePrompt, setDeletePrompt] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const requestKey = useRef<string | null>(null)

  const changeDate = (field: keyof DateParts, value: string) => {
    const maxLength = field === 'year' ? 4 : 2
    const numericValue = value.replace(/\D/g, '').slice(0, maxLength)
    setDateParts((current) => ({ ...current, [field]: numericValue }))
    setFormError('')
  }

  const continueFromBirth = () => {
    const birthDate = createBirthDate(dateParts)
    if (!birthDate) {
      setFormError('Confira o dia, o mês e o ano. A data precisa ser válida e não pode estar no futuro.')
      return
    }
    if (firstName.trim() && !/^[\p{L}\p{M} .'-]{1,60}$/u.test(firstName.trim())) {
      setFormError('Use apenas letras no primeiro nome ou deixe o campo em branco.')
      return
    }
    if (!consent) {
      setFormError('Para continuar, leia o aviso e confirme seu consentimento para o uso dos dados neste quiz.')
      return
    }

    setFormError('')
    setStep(1)
    setScreen('question')
  }

  const runAnalysis = async () => {
    const birthDate = createBirthDate(dateParts)
    const completeAnswers = questions.reduce((result, question) => {
      const answer = answers[question.key]
      if (answer) result[question.key] = answer
      return result
    }, {} as Partial<QuizAnswers>) as QuizAnswers

    if (!birthDate || !questions.every((question) => completeAnswers[question.key])) {
      setFormError('Revise a data e responda a todas as perguntas para ver sua prévia.')
      setScreen('question')
      setStep(questions.length)
      return
    }

    setFormError('')
    setAnalysisStep(0)
    setScreen('analyzing')

    try {
      for (let index = 0; index < ANALYSIS_STEPS.length; index += 1) {
        setAnalysisStep(index)
        await wait(650)
      }

      if (!requestKey.current) requestKey.current = window.crypto.randomUUID()

      const response = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestKey: requestKey.current,
          firstName: firstName.trim() || null,
          birthDate,
          answers: completeAnswers,
          consentAccepted: consent,
        }),
      })
      const payload = await response.json().catch(() => null)

      if (!response.ok || typeof payload?.quizId !== 'string') {
        throw new Error(payload?.error || 'Não foi possível salvar suas respostas agora. Tente novamente.')
      }

      setQuizId(payload.quizId)
      setScreen('result')
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Não foi possível salvar suas respostas agora. Tente novamente.')
      setScreen('error')
    }
  }

  const continueQuestion = () => {
    const question = questions[step - 1]
    if (!question || !answers[question.key]) {
      setFormError('Escolha uma alternativa para continuar.')
      return
    }

    setFormError('')
    if (step < questions.length) {
      setStep((current) => current + 1)
      return
    }

    void runAnalysis()
  }

  const goBack = () => {
    setFormError('')
    if (screen === 'birth') {
      setScreen('welcome')
      return
    }
    if (screen === 'question' && step === 1) {
      setStep(0)
      setScreen('birth')
      return
    }
    if (screen === 'question') setStep((current) => current - 1)
    if (screen === 'error') {
      requestKey.current = null
      setStep(questions.length)
      setScreen('question')
    }
  }

  const copyQuizId = async () => {
    try {
      await navigator.clipboard.writeText(quizId)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  const deleteQuiz = async () => {
    setDeleteError('')
    const birthDate = createBirthDate(dateParts)
    try {
      const response = await fetch('/api/quizzes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId, birthDate }),
      })
      if (!response.ok) throw new Error('Não foi possível excluir seus dados agora. Tente novamente.')
      setDeleted(true)
      setDeletePrompt(false)
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Não foi possível excluir seus dados agora. Tente novamente.')
    }
  }

  const activeQuestion = screen === 'question' ? questions[step - 1] : undefined
  const completeAnswers = questions.every((question) => answers[question.key]) ? answers as QuizAnswers : null
  const currentBirthDate = createBirthDate(dateParts) ?? ''

  return (
    <main className={screen === 'result' ? 'quiz-app quiz-app-result' : 'quiz-app'}>
      {screen === 'welcome' && <WelcomeScreen onStart={() => setScreen('birth')} />}

      {(screen === 'birth' || screen === 'question' || screen === 'error') && (
        <>
          <ProgressHeader step={screen === 'error' ? questions.length : step} onBack={goBack} />
          {screen === 'birth' && (
            <BirthDateScreen
              firstName={firstName}
              dateParts={dateParts}
              consent={consent}
              formError={formError}
              onNameChange={(value) => { setFirstName(value); setFormError('') }}
              onDateChange={changeDate}
              onConsentChange={(value) => { setConsent(value); setFormError('') }}
              onContinue={continueFromBirth}
            />
          )}
          {screen === 'question' && activeQuestion && (
            <QuestionScreen
              question={activeQuestion}
              selected={answers[activeQuestion.key]}
              formError={formError}
              onSelect={(choice) => {
                setAnswers((current) => ({ ...current, [activeQuestion.key]: choice }))
                setFormError('')
              }}
              onContinue={continueQuestion}
            />
          )}
          {screen === 'error' && (
            <section className="analysis-error" aria-labelledby="analysis-error-title">
              <span className="analysis-error-icon"><Heart aria-hidden="true" /></span>
              <p className="quiz-eyebrow quiz-eyebrow-dark"><span /> QUASE LÁ</p>
              <h1 id="analysis-error-title">{formError}</h1>
              <p>Suas respostas continuam nesta tela. Você pode tentar enviar novamente.</p>
              <button className="quiz-primary-button" type="button" onClick={() => void runAnalysis()}>TENTAR NOVAMENTE <ArrowRight aria-hidden="true" /></button>
              <button className="quiz-back-button error-back" type="button" onClick={goBack}><ArrowLeft aria-hidden="true" /> Voltar à última pergunta</button>
            </section>
          )}
        </>
      )}

      {screen === 'analyzing' && <AnalysisScreen currentStep={analysisStep} />}

      {screen === 'result' && completeAnswers && quizId && (
        <>
          <header className="quiz-result-topbar"><Brand /><a href="#result-title">Sua prévia <Sparkles aria-hidden="true" /></a></header>
          <ResultScreen
            birthDate={currentBirthDate}
            firstName={formatDisplayName(firstName)}
            answers={completeAnswers}
            quizId={quizId}
            copied={copied}
            deleted={deleted}
            deletePrompt={deletePrompt}
            deleteError={deleteError}
            onCopy={() => void copyQuizId()}
            onAskDelete={() => { setDeletePrompt(true); setDeleteError('') }}
            onCancelDelete={() => { setDeletePrompt(false); setDeleteError('') }}
            onDelete={() => void deleteQuiz()}
          />
        </>
      )}

      <footer className="quiz-footer">
        <span>Mapa do Amor · {PRIVACY_NOTICE_VERSION}</span>
        <span>Um exercício de autoconhecimento, sem previsões ou garantias.</span>
      </footer>
    </main>
  )
}
