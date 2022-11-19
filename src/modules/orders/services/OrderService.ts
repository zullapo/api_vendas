import AppError from '@shared/errors/AppError'
import { getCustomRepository } from 'typeorm'
import Order from '../typeorm/entities/Order'
import OrderRepository from '../repositories/OrderRepository'
import CustomerRepository from '@modules/customers/repositories/CustomerRepository'
import ProductRepository from '@modules/products/repositories/ProductRepository'

interface ProductDTO {
	id: string
	price: number
	quantity: number
}

interface OrderDTO {
	customerId: string
	products: ProductDTO[]
}

class OrderService {
	async add(data: OrderDTO): Promise<Order> {
		const { customerId, products } = data

		const customerRepository = getCustomRepository(CustomerRepository)
		const orderRepository = getCustomRepository(OrderRepository)
		const productRepository = getCustomRepository(ProductRepository)

		const customer = await customerRepository.findById(customerId)
		if (!customer) {
			throw new AppError('Customer not found')
		}

		const existentProducts = await productRepository.findByIds(
			products.map((product) => product.id)
		)

		if (!existentProducts) {
			throw new AppError(`Couldn't find any product`)
		}

		const existentProductsIds = existentProducts.map((product) => product.id)

		const inexistentProducts = products.filter(
			(product) => !existentProductsIds.includes(product.id)
		)

		if (inexistentProducts.length) {
			throw new AppError(
				`Couldn't find product with the given id: ${inexistentProducts[0].id}`
			)
		}

		const isQuantityNotAvailable = (product: ProductDTO) =>
			existentProducts.filter((p) => p.id === product.id)[0].quantity <
			product.quantity

		const notAvailableQuantityProducts = products.filter((product) =>
			isQuantityNotAvailable(product)
		)

		if (notAvailableQuantityProducts.length) {
			throw new AppError(
				`The quantity ${notAvailableQuantityProducts[0].quantity} is not available
				for product with the given id: ${notAvailableQuantityProducts[0].id}`
			)
		}

		const serializedProducts = products.map((product) => ({
			product_id: product.id,
			quantity: product.quantity,
			price: existentProducts.filter((p) => p.id == product.id)[0].price
		}))

		const order = await orderRepository.add({
			customer: customer,
			products: serializedProducts
		})

		const { order_products } = order

		const updatedProductQuantity = order_products.map((order_product) => ({
			id: order_product.product_id,
			quantity:
				existentProducts.filter((p) => p.id === order_product.product_id)[0]
					.quantity - order_product.quantity
		}))

		await productRepository.save(updatedProductQuantity)

		return order
	}

	async getById(id: string): Promise<Order> {
		const orderRepository = getCustomRepository(OrderRepository)

		const order = await orderRepository.findById(id)
		if (!order) {
			throw new AppError('Order not found')
		}

		return order
	}
}

export default OrderService
