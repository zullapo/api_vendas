import AppError from '@shared/errors/AppError'
import { getCustomRepository } from 'typeorm'
import UserRepository from '../repositories/UserRepository'
import UserTokenRepository from '../repositories/UserTokenRepository'
import EtherealMail from '@config/mail/EtherealMail'
import path from 'path'

interface UserDTO {
	email: string
}

class ForgotPasswordService {
	async sendEmail(data: UserDTO): Promise<void> {
		const { email } = data
		const userRepository = getCustomRepository(UserRepository)
		const userTokenRepository = getCustomRepository(UserTokenRepository)

		const user = await userRepository.findByEmail(email)
		if (!user) {
			throw new AppError('User not found')
		}

		const { token } = await userTokenRepository.generate(user.id)

		const templateFile = path.resolve(__dirname, '..', 'views/forgotPassword.hbs')

		await EtherealMail.sendMail({
			to: {
				name: user.name,
				email: user.email
			},
			subject: '[API Vendas] - Reset password',
			templateData: {
				templateFile,
				variables: {
					name: user.name,
					link: `http://localhost:3000/password/reset?token=${token}`
				}
			}
		})
	}
}

export default ForgotPasswordService
