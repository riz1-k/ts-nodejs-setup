import { config } from "dotenv"
import z from "zod"

config()

const schema = z.object({
	NODE_ENV: z.enum(["development", "production", "local"]),
	PORT: z.coerce.number(),
	COOKIE_SECRET: z.string(),
	TURSO_DB_URL: z.string(),
	TURSO_DB_TOKEN: z.string(),
	JWT_SECRET_KEY: z.string(),
})

export const env = schema.parse(process.env)
