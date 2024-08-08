import { config } from "dotenv"
import z from "zod"

config()

const schema = z.object({
	NODE_ENV: z.enum(["development", "production"]),
	PORT: z.coerce.number(),
	COOKIE_SECRET: z.string(),
})

export const env = schema.parse(process.env)
