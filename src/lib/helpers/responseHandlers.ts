import { type Request, type Response } from "express"
import { ZodError } from "zod"

import { prisma } from "../configs/prisma"

function getErrorMessage(err: unknown) {
	let message: string = ""
	if (err instanceof ZodError) {
		message = err.issues[0].message
	} else if (err instanceof Error) {
		message = err.message
	} else if (typeof err === "string") {
		message = err
	} else if (err && typeof err === "object" && "message" in err) {
		message = String(err.message)
	}

	return message
}

const errorResponseCode = [
	400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414,
	415, 416, 417, 418, 421, 422, 423, 424, 425, 426, 428, 429, 431, 451, 500,
	501, 502, 503, 504, 505, 506, 507, 508, 510, 511,
] as const

const successResponseCode = [
	200, 201, 202, 203, 204, 205, 206, 207, 208, 226,
] as const

export function handleErrorResponse({
	res,
	error,
	status = 500,
	// req,
}: {
	res: Response
	req: Request
	error: unknown
	status?: (typeof errorResponseCode)[number]
}) {
	try {
		const message = getErrorMessage(error)
		console.log({ error: message })
		res.status(status).json({
			status: "error",
			message,
		})
		void prisma.errorLog.create({
			data: {
				error: message,
			},
		})
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error" })
	} finally {
		res.end()
	}
}

export function handleSuccessResponse({
	res,
	data,
	status = 200,
}: {
	res: Response
	data: unknown
	status?: (typeof successResponseCode)[number]
}) {
	try {
		res.status(status).json({
			status: "success",
			data,
		})
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error" })
	} finally {
		res.end()
	}
}
