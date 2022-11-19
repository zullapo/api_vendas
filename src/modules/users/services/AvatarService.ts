import AppError from '@shared/errors/AppError'
import path from 'path'
import { getCustomRepository } from 'typeorm'
import UserRepository from '../repositories/UserRepository'
import User from '../typeorm/entities/User'
import uploadConfig from '@config/upload'
import fs from 'fs'

interface AvatarDTO {
	userId: string
	avatarFilename: string | undefined
}

class AvatarService {
	async update(data: AvatarDTO): Promise<User> {
		const { userId, avatarFilename } = data
		const userRepository = getCustomRepository(UserRepository)

		if (!avatarFilename) {
			throw new AppError('No avatar sent')
		}

		const user = await userRepository.findById(userId)
		if (!user) {
			throw new AppError('User not found')
		}

		if (user.avatar) {
			const avatarPath = path.join(uploadConfig.directory, user.avatar)
			const avatarExists = await fs.promises.stat(avatarPath)
			if (avatarExists) {
				await fs.promises.unlink(avatarPath)
			}
		}

		user.avatar = avatarFilename

		await userRepository.save(user)

		return user
	}
}

export default AvatarService
