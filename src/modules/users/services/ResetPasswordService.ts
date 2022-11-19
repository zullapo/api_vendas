import AppError from '@shared/errors/AppError'
import { hash } from 'bcryptjs'
import { addHours, isAfter } from 'date-fns'
import { getCustomRepository } from 'typeorm'
import UserRepository from '../repositories/UserRepository'
import UserTokenRepository from '../repositories/UserTokenRepository'

interface UserDTO {
	token: string
	password: string
}

class ResetPasswordService {
	async reset(data: UserDTO) {
		const { token, password } = data
		const userRepository = getCustomRepository(UserRepository)
		const userTokenRepository = getCustomRepository(UserTokenRepository)

		const userToken = await userTokenRepository.findByToken(token)
		if (!userToken) {
			throw new AppError('User token not found')
		}

		const user = await userRepository.findById(userToken.user_id)
		if (!user) {
			throw new AppError('User not found')
		}

		const tokenCreatedAt = userToken.created_at
		const compareDate = addHours(tokenCreatedAt, 2)

		if (isAfter(Date.now(), compareDate)) {
			throw new AppError('Token expired')
		}

		user.password = await hash(password, 8)

		await userRepository.save(user)
	}
}

export default ResetPasswordService
