import { EntityRepository, Repository } from 'typeorm'
import User from '../typeorm/entities/User'

@EntityRepository(User)
class UserRepository extends Repository<User> {
	async findByName(name: string): Promise<User | undefined> {
		const user = await this.findOne({
			where: {
				name: name
			}
		})
		return user
	}

	async findById(id: string): Promise<User | undefined> {
		const user = await this.findOne({
			where: {
				id: id
			}
		})
		return user
	}

	async findByEmail(email: string): Promise<User | undefined> {
		const user = await this.findOne({
			where: {
				email: email
			}
		})
		return user
	}
}

export default UserRepository
