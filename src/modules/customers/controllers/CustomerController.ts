import { Request, Response } from 'express'
import CustomerService from '../services/CustomerService'

class CustomerController {
	private service: CustomerService

	constructor() {
		this.service = new CustomerService()

		this.add = this.add.bind(this)
		this.get = this.get.bind(this)
		this.getById = this.getById.bind(this)
		this.edit = this.edit.bind(this)
		this.remove = this.remove.bind(this)
	}

	async add(request: Request, response: Response): Promise<Response> {
		const { name, email } = request.body

		const customer = { name, email }

		const savedCustomer = await this.service.add(customer)

		return response.status(200).jsonp(savedCustomer)
	}

	async get(request: Request, response: Response): Promise<Response> {
		const customers = await this.service.get()

		return response.status(200).jsonp(customers)
	}

	async getById(request: Request, response: Response): Promise<Response> {
		const { id } = request.params

		const customer = await this.service.getById(id)

		return response.status(200).jsonp(customer)
	}

	async edit(request: Request, response: Response): Promise<Response> {
		const { id } = request.params
		const { name, email } = request.body
		const customer = { name, email }

		const updatedCustomer = await this.service.edit(id, customer)

		return response.status(200).jsonp(updatedCustomer)
	}

	async remove(request: Request, response: Response): Promise<Response> {
		const { id } = request.params

		const removedCustomer = await this.service.remove(id)

		return response.status(200).jsonp(removedCustomer)
	}
}

export default CustomerController
