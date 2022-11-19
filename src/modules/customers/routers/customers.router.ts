import { Router } from 'express'
import CustomerController from '@modules/customers/controllers/CustomerController'
import { celebrate, Joi, Segments } from 'celebrate'
import isAuthenticated from '@modules/users/middlewares/isAuthenticated'

const customerController = new CustomerController()

const customersRouter = Router()

customersRouter.use(isAuthenticated)

customersRouter.get('/', customerController.get)
customersRouter.post(
	'/',
	celebrate({
		[Segments.BODY]: {
			name: Joi.string().required(),
			email: Joi.string().required()
		}
	}),
	customerController.add
)

customersRouter
	.route('/:id')
	.get(
		celebrate({
			[Segments.PARAMS]: {
				id: Joi.string().uuid().required()
			}
		}),
		customerController.getById
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
				email: Joi.string().required()
			}
		}),
		customerController.edit
	)
	.delete(
		celebrate({
			[Segments.PARAMS]: {
				id: Joi.string().uuid().required()
			}
		}),
		customerController.remove
	)

export default customersRouter
