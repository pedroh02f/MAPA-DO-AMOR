import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

function createDatabase() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL não está configurada para a integração Neon.')
  }

  const pool = new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 5_000,
  })

  return drizzle(pool, { schema })
}

let database: ReturnType<typeof createDatabase> | undefined

export function getDatabase() {
  if (!database) database = createDatabase()
  return database
}
