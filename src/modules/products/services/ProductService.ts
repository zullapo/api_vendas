import AppError from '@shared/errors/AppError'
import { getCustomRepository } from 'typeorm'
import Product from '../typeorm/entities/Product'
import ProductRepository from '../repositories/ProductRepository'
import RedisCache from '@shared/cache/RedisCache'

interface ProductDTO {
	name: string
	price: number
	quantity: number
}

class ProductService {
	async add(data: ProductDTO): Promise<Product> {
		const productRepository = getCustomRepository(ProductRepository)

		const productExists = await productRepository.findByName(data.name)
		if (productExists) {
			throw new AppError("There's already a product with this name")
		}

		const redisCache = new RedisCache()

		const createdProduct = productRepository.create(data)

		await redisCache.invalidate('api_vendas_products')

		const product = await productRepository.save(createdProduct)

		return product
	}

	async get(): Promise<Product[]> {
		const productRepository = getCustomRepository(ProductRepository)

		const redisCache = new RedisCache()

		let products = await redisCache.recover<Product[]>('api_vendas_products')

		if (!products) {
			products = await productRepository.find()

			await redisCache.save<Product[]>('api_vendas_products', products)
		}

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

		const productExists = await productRepository.findByName(name)
		if (productExists) {
			throw new AppError("There's already a product with this name")
		}

		const redisCache = new RedisCache()

		await redisCache.invalidate('api_vendas_products')

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

		const redisCache = new RedisCache()

		await redisCache.invalidate('api_vendas_products')

		await productRepository.remove(product)

		return product
	}
}

export default ProductService
