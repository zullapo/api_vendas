import { Router } from 'express'
import OrderController from '@modules/orders/controllers/OrderController'
import { celebrate, Joi, Segments } from 'celebrate'
import isAuthenticated from '@modules/users/middlewares/isAuthenticated'

const orderController = new OrderController()

const ordersRouter = Router()

ordersRouter.use(isAuthenticated)

ordersRouter.post(
	'/',
	celebrate({
		[Segments.BODY]: {
			customerId: Joi.string().uuid().required(),
			products: Joi.array().required()
		}
	}),
	orderController.add
)

ordersRouter.get(
	'/:id',
	celebrate({
		[Segments.PARAMS]: {
			id: Joi.string().uuid().required()
		}
	}),
	orderController.getById
)

export default ordersRouter
