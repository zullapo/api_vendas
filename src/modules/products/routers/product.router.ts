import { Router } from 'express'
import ProductController from '@modules/products/controllers/ProductController'
import { celebrate, Joi, Segments } from 'celebrate'

const productController = new ProductController()

const productRouter = Router()

productRouter.get('/', productController.get)
productRouter.post(
	'/',
	celebrate({
		[Segments.BODY]: {
			name: Joi.string().required(),
			price: Joi.number().precision(2),
			quantity: Joi.number().required()
		}
	}),
	productController.add
)

productRouter
	.route('/:id')
	.get(
		celebrate({
			[Segments.PARAMS]: {
				id: Joi.string().uuid().required()
			}
		}),
		productController.getById
	)
	.put(
		celebrate({
			[Segments.PARAMS]: {
				id: Joi.string().uuid().required()
			}
		}),
		celebrate({
			[Segments.BODY]: {
				name: Joi.string().required(),
				price: Joi.number().precision(2),
				quantity: Joi.number().required()
			}
		}),
		productController.edit
	)
	.delete(
		celebrate({
			[Segments.PARAMS]: {
				id: Joi.string().uuid().required()
			}
		}),
		productController.remove
	)

export default productRouter
