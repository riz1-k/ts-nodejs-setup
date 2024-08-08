import { Router } from "express"

const apiRouter = Router()

apiRouter.get("/", (_, res) => {
	return res.send("Hello World")
})

export default apiRouter
