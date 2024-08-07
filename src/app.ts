import express from "express"

import { env } from "./lib/configs/env"
import { expressConfig } from "./lib/configs/express.config"

const app = express()

async function main() {
	expressConfig(app)

	app.listen(env.PORT, () => {
		console.clear()
		console.log(`Server is running on port ${env.PORT}`)
	})
}

void main()
