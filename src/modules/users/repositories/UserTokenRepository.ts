import { EntityRepository, Repository } from 'typeorm'
import UserToken from '../typeorm/entities/UserToken'

@EntityRepository(UserToken)
class UserTokenRepository extends Repository<UserToken> {
	async findByToken(token: string): Promise<UserToken | undefined> {
		const userToken = await this.findOne({
			where: {
				token
			}
		})

		return userToken
	}

	async generate(userId: string): Promise<UserToken> {
		const userToken = this.create({
			user_id: userId
		})

		await this.save(userToken)

		return userToken
	}
}

export default UserTokenRepository
