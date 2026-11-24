import { date, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export type QuizAnswerChoice = 'A' | 'B' | 'C' | 'D'

export type QuizAnswers = {
  situacao_amorosa: QuizAnswerChoice
  dificuldade_amorosa: QuizAnswerChoice
  estilo_amoroso: QuizAnswerChoice
  experiencia_amorosa: QuizAnswerChoice
  desejo_amoroso: QuizAnswerChoice
  objetivo_amoroso: QuizAnswerChoice
}

export const loveQuizSubmissions = pgTable('love_quiz_submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  idempotencyKey: uuid('idempotency_key').notNull().unique(),
  firstName: text('first_name'),
  birthDate: date('birth_date', { mode: 'string' }).notNull(),
  answers: jsonb('answers').$type<QuizAnswers>().notNull(),
  privacyConsentAt: timestamp('privacy_consent_at', { withTimezone: true }).notNull(),
  privacyNoticeVersion: text('privacy_notice_version').notNull(),
  paymentStatus: text('payment_status').notNull().default('pending'),
  kiwifyOrderId: text('kiwify_order_id').unique(),
  paidAt: timestamp('paid_at', { withTimezone: true }),
  reportStatus: text('report_status').notNull().default('not_generated'),
  reportStorageKey: text('report_storage_key'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
