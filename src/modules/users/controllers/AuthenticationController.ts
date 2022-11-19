import { Request, Response } from 'express'
import AuthenticationService from '../services/AuthenticationService'

class AuthenticationController {
	private service: AuthenticationService

	constructor() {
		this.service = new AuthenticationService()
		this.authenticate = this.authenticate.bind(this)
	}

	async authenticate(request: Request, response: Response): Promise<Response> {
		const { email, password } = request.body

		const login = { email, password }

		const authenticatedUser = await this.service.authenticate(login)

		return response.status(200).jsonp(authenticatedUser)
	}
}

export default AuthenticationController
