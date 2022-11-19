import { Request, Response } from 'express'
import OrderService from '../services/OrderService'

class OrderController {
	service: OrderService

	constructor() {
		this.service = new OrderService()

		this.add = this.add.bind(this)
		this.getById = this.getById.bind(this)
	}

	async add(request: Request, response: Response): Promise<Response> {
		const { customerId, products } = request.body

		const savedOrder = await this.service.add({ customerId, products })

		return response.status(200).jsonp(savedOrder)
	}

	async getById(request: Request, response: Response): Promise<Response> {
		const { id } = request.params

		const order = await this.service.getById(id)

		return response.status(200).jsonp(order)
	}
}

export default OrderController
