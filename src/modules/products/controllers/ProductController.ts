import { Request, Response } from 'express'
import ProductService from '../services/ProductService'

class ProductController {
	private service: ProductService

	constructor() {
		this.service = new ProductService()

		this.add = this.add.bind(this)
		this.get = this.get.bind(this)
		this.getById = this.getById.bind(this)
		this.edit = this.edit.bind(this)
		this.remove = this.remove.bind(this)
	}

	async add(request: Request, response: Response): Promise<Response> {
		const { name, price, quantity } = request.body

		const product = { name, price, quantity }

		const savedProduct = await this.service.add(product)

		return response.status(200).jsonp(savedProduct)
	}

	async get(request: Request, response: Response): Promise<Response> {
		const products = await this.service.get()

		return response.status(200).jsonp(products)
	}

	async getById(request: Request, response: Response): Promise<Response> {
		const { id } = request.params

		const product = await this.service.getById(id)

		return response.status(200).jsonp(product)
	}

	async edit(request: Request, response: Response): Promise<Response> {
		const { id } = request.params
		const { name, price, quantity } = request.body
		const product = { name, price, quantity }

		const updatedProduct = await this.service.edit(id, product)

		return response.status(200).jsonp(updatedProduct)
	}

	async remove(request: Request, response: Response): Promise<Response> {
		const { id } = request.params

		const removedProduct = await this.service.remove(id)

		return response.status(200).jsonp(removedProduct)
	}
}

export default ProductController
