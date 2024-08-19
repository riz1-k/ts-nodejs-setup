import { type Admin as User } from "@prisma/client"
import { type NextFunction, type Request, type Response } from "express"
import jwt from "jsonwebtoken"

import { handleErrorResponse } from "../helpers/responseHandlers"
import { env } from "./env"

export type Payload = Omit<User, "passwordHash">

export function generateToken(
	user: User,
	type: "access" | "refresh" = "access",
) {
	return jwt.sign(
		{
			...user,
			hash: undefined,
		},
		env.JWT_SECRET_KEY,
		{ expiresIn: type === "access" ? "2h" : "7d" },
	)
}

export function verifyAuth() {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			const token = req.headers.authorization?.split(" ")[1]
			if (!token) {
				return handleErrorResponse({
					res,
					req,
					error: "Access denied. No token provided.",
					status: 401,
				})
			}

			const decoded = jwt.verify(token, env.JWT_SECRET_KEY) as Payload
			req.user = decoded

			next()
		} catch (error) {
			if (error instanceof jwt.TokenExpiredError) {
				return handleErrorResponse({
					res,
					req,
					error: "Token expired",
					status: 403,
				})
			}
			return handleErrorResponse({
				res,
				req,
				error: "Invalid token",
				status: 401,
			})
		}
	}
}

export function decodeToken(token: string) {
	return jwt.verify(token, env.JWT_SECRET_KEY) as Payload
}
