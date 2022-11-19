import AppError from '@shared/errors/AppError'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { getCustomRepository } from 'typeorm'
import User from '../typeorm/entities/User'
import UserRepository from '../repositories/UserRepository'
import authConfig from '@config/auth'

interface UserDTO {
	email: string
	password: string
}

interface AuthenticationResponse {
	user: User
	token: string
}

class AuthenticationService {
	async authenticate(data: UserDTO): Promise<AuthenticationResponse> {
		const { email, password } = data
		const userRepository = getCustomRepository(UserRepository)

		const user = await userRepository.findByEmail(email)
		if (!user) {
			throw new AppError("There's no user with this e-mail", 401)
		}

		const isPasswordValid = await compare(password, user.password)
		if (!isPasswordValid) {
			throw new AppError('Incorrect password', 401)
		}

		const token = sign({}, authConfig.jwt.secret, {
			subject: user.id,
			expiresIn: authConfig.jwt.expiresIn
		})

		return {
			user,
			token
		}
	}
}

export default AuthenticationService
