import AppError from '@shared/errors/AppError'
import { compare, hash } from 'bcryptjs'
import { getCustomRepository } from 'typeorm'
import User from '../typeorm/entities/User'
import UserRepository from '../repositories/UserRepository'

interface UserDTO {
	name: string
	email: string
}

interface UserAddDTO extends UserDTO {
	password: string
}

interface UserEditDTO extends UserDTO {
	userId: string
	oldPassword?: string
	password?: string
}

class UserService {
	async add(user: UserAddDTO): Promise<User> {
		const { name, email, password } = user
		const userRepository = getCustomRepository(UserRepository)

		const emailExists = await userRepository.findByEmail(email)
		if (emailExists) {
			throw new AppError("There's already a user with this e-mail")
		}

		const hashedPassword = await hash(password, 8)

		const createdUser = userRepository.create({
			name,
			email,
			password: hashedPassword
		})

		await userRepository.save(createdUser)

		return createdUser
	}

	async get(): Promise<User[]> {
		const userRepository = getCustomRepository(UserRepository)

		const users = await userRepository.find()

		return users
	}

	async getById(userId: string): Promise<User> {
		const userRepository = getCustomRepository(UserRepository)

		const user = await userRepository.findById(userId)
		if (!user) {
			throw new AppError('User not found')
		}

		return user
	}

	async edit(data: UserEditDTO): Promise<User> {
		const { name, email, password, oldPassword, userId } = data
		const userRepository = getCustomRepository(UserRepository)

		const user = await userRepository.findById(userId)

		if (!user) {
			throw new AppError('User not found')
		}

		const userUpdateEmail = await userRepository.findByEmail(email)

		if (userUpdateEmail && userUpdateEmail.id !== userId) {
			throw new AppError('Email already used by some user')
		}

		if (password && !oldPassword) {
			throw new AppError('Old password is required')
		}

		if (password && oldPassword) {
			const checkOldPassword = await compare(oldPassword, user.password)

			if (!checkOldPassword) {
				throw new AppError('Old password does not match')
			}

			user.password = await hash(password, 8)
		}

		user.name = name
		user.email = email

		await userRepository.save(user)

		return user
	}
}

export default UserService
