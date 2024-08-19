import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import cors, { type CorsOptions } from "cors"
import type { Application } from "express"
import helmet from "helmet"
import morgan from "morgan"

import apiRouter from "../../apis"
import { env } from "./env"

const whiteListedOrigins = ["http://localhost:3000"]

const corsOptions: CorsOptions = {
	origin: whiteListedOrigins,
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
	allowedHeaders: ["Content-Type", "Authorization", "Accept"],
	exposedHeaders: ["Content-Type", "Authorization", "Accept"],
	credentials: true,
}

export function expressConfig(app: Application) {
	process.on("unhandledRejection", err => {
		console.error(err)
		process.exit(1)
	})

	process.on("uncaughtException", err => {
		console.error(err)
		process.exit(1)
	})

	app.use(cors(corsOptions))
	app.use(helmet())
	app.use(bodyParser.json())
	app.use(bodyParser.urlencoded({ extended: true }))
	app.use(cookieParser(env.COOKIE_SECRET))

	if (env.NODE_ENV === "development") {
		app.use(morgan("dev"))
	}

	app.use("/api", apiRouter)

	app.use((_, res) => {
		const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>WOW Tea</title>
        </head>
        <body>
          <h1>Madrasa Payment</h1>
          <p> API is running on port ${env.PORT} successfully</p>
        </body>
      </html>
    `
		return res.send(html)
	})

	app.use((_, res) => {
		return res.status(404).send("Not Found")
	})
}
