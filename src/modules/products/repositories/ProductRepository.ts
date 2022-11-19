import { EntityRepository, Repository } from 'typeorm'
import Product from '../typeorm/entities/Product'

@EntityRepository(Product)
class ProductRepository extends Repository<Product> {
	async findByName(name: string) {
		const product = this.findOne({
			where: {
				name: name
			}
		})
		return product
	}
}

export default ProductRepository
