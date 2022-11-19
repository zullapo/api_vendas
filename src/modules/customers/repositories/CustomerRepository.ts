import { EntityRepository, Repository } from 'typeorm'
import Customer from '../typeorm/entities/Customer'

@EntityRepository(Customer)
class CustomerRepository extends Repository<Customer> {
	async findByName(name: string): Promise<Customer | undefined> {
		const customer = await this.findOne({
			where: {
				name: name
			}
		})
		return customer
	}

	async findById(id: string): Promise<Customer | undefined> {
		const customer = await this.findOne({
			where: {
				id: id
			}
		})
		return customer
	}

	async findByEmail(email: string): Promise<Customer | undefined> {
		const customer = await this.findOne({
			where: {
				email: email
			}
		})
		return customer
	}
}

export default CustomerRepository
