import { type Payload } from "../lib/configs/jwt-auth"

declare global {
	namespace Express {
		interface Request {
			user: Payload
		}
	}
}
