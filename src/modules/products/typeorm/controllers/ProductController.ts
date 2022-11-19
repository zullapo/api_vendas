import { Request, Response } from 'express'
import ProductService from '../services/ProductService'

class ProductController {
	constructor(private service: ProductService) {}

	async add(req: Request, res: Response) {
		const { name, price, quantity } = req.body

		const product = { name, price, quantity }

		this.service.add(product)
	}
}

export default ProductController
