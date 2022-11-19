import AuthenticationController from '@modules/users/controllers/AuthenticationController'
import { celebrate, Joi, Segments } from 'celebrate'
import { Router } from 'express'

const authenticationRouter = Router()

const authenticationController = new AuthenticationController()

authenticationRouter.post(
	'/',
	celebrate({
		[Segments.BODY]: {
			email: Joi.string().email().required(),
			password: Joi.string().required()
		}
	}),
	authenticationController.authenticate
)

export default authenticationRouter
