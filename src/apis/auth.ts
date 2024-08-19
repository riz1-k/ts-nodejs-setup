import bcrypt from "bcrypt"
import { Router } from "express"
import { z } from "zod"

import { COOKIE_OPTIONS } from "../lib/configs/cookie"
import { decodeToken, generateToken } from "../lib/configs/jwt-auth"
import { prisma } from "../lib/configs/prisma"
import {
	handleErrorResponse,
	handleSuccessResponse,
} from "../lib/helpers/responseHandlers"

export const authRouter = Router()

const registerSchema = z.object({
	firstName: z.string(),
	lastName: z.string(),
	password: z.string(),
})

authRouter.post("/register", async (req, res) => {
	try {
		const { firstName, lastName, password } = registerSchema.parse(req.body)
		const admin = await prisma.admin.findFirst({
			where: {
				firstName,
				lastName,
			},
		})
		if (admin) {
			return handleErrorResponse({
				res,
				req,
				error: "Admin with the same first name and last name already exists",
				status: 400,
			})
		}
		const hash = await bcrypt.hash(password, 10)
		const newAdmin = await prisma.admin.create({
			data: {
				firstName,
				lastName,
				hash,
			},
		})
		res.cookie("token", generateToken(newAdmin, "refresh"), COOKIE_OPTIONS)
		const accessToken = generateToken(newAdmin, "access")
		return handleSuccessResponse({
			res,
			data: {
				accessToken,
				refreshToken: accessToken,
			},
		})
	} catch (error) {
		return handleErrorResponse({
			res,
			req,
			error,
			status: 400,
		})
	}
})

const loginSchema = z.object({
	firstName: z.string(),
	lastName: z.string(),
	password: z.string(),
})

authRouter.post("/login", async (req, res) => {
	try {
		const { firstName, lastName, password } = loginSchema.parse(req.body)
		const admin = await prisma.admin.findFirst({
			where: {
				firstName,
				lastName,
			},
		})
		if (!admin) {
			return handleErrorResponse({
				res,
				req,
				error: "Invalid email or password",
				status: 400,
			})
		}
		const isPasswordCorrect = await bcrypt.compare(password, admin.hash)
		if (!isPasswordCorrect) {
			return handleErrorResponse({
				res,
				req,
				error: "Invalid email or password",
				status: 400,
			})
		}
		const accessToken = generateToken(admin, "access")
		res.cookie("token", accessToken, COOKIE_OPTIONS)
		return handleSuccessResponse({
			res,
			data: {
				accessToken,
			},
		})
	} catch (error) {
		return handleErrorResponse({
			res,
			req,
			error,
			status: 400,
		})
	}
})

authRouter.post("/refresh", async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken
		if (!refreshToken) {
			return handleErrorResponse({
				res,
				req,
				error: "Refresh token not found",
				status: 400,
			})
		}

		const decoded = decodeToken(refreshToken)

		const admin = await prisma.admin.findFirst({
			where: {
				id: decoded.id,
			},
		})

		if (!admin) {
			return handleErrorResponse({
				res,
				req,
				error: "Invalid refresh token",
				status: 400,
			})
		}

		const accessToken = generateToken(admin, "access")
		res.cookie("token", accessToken, COOKIE_OPTIONS)
		return handleSuccessResponse({
			res,
			data: {
				accessToken,
			},
		})
	} catch (error) {
		return handleErrorResponse({
			res,
			req,
			error,
			status: 400,
		})
	}
})

authRouter.post("/logout", async (req, res) => {
	try {
		res.clearCookie("token")
		return handleSuccessResponse({
			res,
			data: {},
		})
	} catch (error) {
		return handleErrorResponse({
			res,
			req,
			error,
			status: 400,
		})
	}
})
