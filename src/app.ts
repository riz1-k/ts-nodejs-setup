import { expressConfig } from "./lib/configs/express.config"
import { env } from "./lib/configs/env"
import express from "express"

const app = express()

async function main() {
	expressConfig(app)

	app.listen(env.PORT, () => {
		console.clear()
		console.log(`Server is running on port ${env.PORT}`)
	})
}

main()
