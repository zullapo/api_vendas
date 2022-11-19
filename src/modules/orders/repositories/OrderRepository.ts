import Customer from '@modules/customers/typeorm/entities/Customer'
import { EntityRepository, Repository } from 'typeorm'
import Order from '@modules/orders/typeorm/entities/Order'

interface ProductDTO {
	product_id: string
	price: number
	quantity: number
}

interface OrderDTO {
	customer: Customer
	products: ProductDTO[]
}

@EntityRepository(Order)
class OrderRepository extends Repository<Order> {
	async findById(id: string): Promise<Order | undefined> {
		const order = this.findOne(id, { relations: ['customer', 'order_products'] })

		return order
	}

	async add(data: OrderDTO): Promise<Order> {
		const { customer, products } = data

		const order = this.create({ customer, order_products: products })

		await this.save(order)

		return order
	}
}

export default OrderRepository
