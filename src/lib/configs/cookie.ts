import { type CookieOptions } from "express"

export const COOKIE_OPTIONS: CookieOptions = {
	httpOnly: true,
	maxAge: 1000 * 60 * 60 * 24 * 7,
	sameSite: process.env.NODE_ENV === "local" ? "lax" : "none",
	secure: process.env.NODE_ENV !== "local",
}
