import AppError from '@shared/errors/AppError'
import { getCustomRepository, getRepository } from 'typeorm'
import Product from '../entities/Product'
import ProductRepository from '../repositories/ProductRepository'

interface ProductDTO {
	name: string
	price: number
	quantity: number
}

class ProductService {
	async add(product: ProductDTO): Promise<Product> {
		const productRepository = getCustomRepository(ProductRepository)

		const productExists = await productRepository.findByName(product.name)
		if (productExists) {
			throw new AppError("There's already a product with this name")
		}

		const createdProduct = productRepository.create(product)

		await productRepository.save(product)

		return createdProduct
	}

	async get(): Promise<Product[]> {
		const productRepository = getCustomRepository(ProductRepository)

		const products = await productRepository.find()

		return products
	}

	async getById(id: string): Promise<Product> {
		const productRepository = getCustomRepository(ProductRepository)

		const product = await productRepository.findOne(id)

		if (!product) {
			throw new AppError('Product not found')
		}

		return product
	}

	async edit(id: string, data: ProductDTO): Promise<Product> {
		const { name, price, quantity } = data

		const productRepository = getCustomRepository(ProductRepository)

		const product = await productRepository.findOne(id)

		if (!product) {
			throw new AppError('Product not found')
		}

		const productExists = await productRepository.findByName(product.name)
		if (productExists) {
			throw new AppError("There's already a product with this name")
		}

		product.name = name
		product.price = price
		product.quantity = quantity

		await productRepository.save(product)

		return product
	}

	async remove(id: string): Promise<Product> {
		const productRepository = getCustomRepository(ProductRepository)

		const product = await productRepository.findOne(id)

		if (!product) {
			throw new AppError('Product not found')
		}

		await productRepository.remove(product)

		return product
	}
}

export default ProductService
