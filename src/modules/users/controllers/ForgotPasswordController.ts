import { Request, Response } from 'express'
import ForgotPasswordService from '../services/ForgotPasswordService'

class ForgotPasswordController {
	async sendEmail(request: Request, response: Response): Promise<Response> {
		const { email } = request.body

		const forgotPasswordService = new ForgotPasswordService()

		await forgotPasswordService.sendEmail({ email })

		return response.status(204).jsonp()
	}
}

export default ForgotPasswordController
