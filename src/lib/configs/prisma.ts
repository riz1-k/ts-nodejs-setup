import { createClient } from "@libsql/client"
import { PrismaLibSQL } from "@prisma/adapter-libsql"
import { PrismaClient } from "@prisma/client"

import { env } from "./env"

const libsql = createClient({
	url: env.TURSO_DB_URL,
	authToken: env.TURSO_DB_TOKEN,
})

const adapter = new PrismaLibSQL(libsql)

export const prisma = new PrismaClient({
	adapter,
})
