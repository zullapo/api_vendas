import UserController from '@modules/users/controllers/UserController'
import { Router } from 'express'
import { celebrate, Joi, Segments } from 'celebrate'
import isAuthenticated from '../middlewares/isAuthenticated'
import multer from 'multer'
import uploadConfig from '@config/upload'
import AvatarController from '../controllers/AvatarController'

const userController = new UserController()
const avatarController = new AvatarController()

const usersRouter = Router()

const upload = multer(uploadConfig)

usersRouter.post(
	'/',
	celebrate({
		[Segments.BODY]: {
			name: Joi.string().required(),
			email: Joi.string().email().required(),
			password: Joi.string().required(),
			avatar: Joi.string().optional()
		}
	}),
	userController.add
)

usersRouter.use(isAuthenticated)

usersRouter.get('/', userController.get)

usersRouter.get(
	'/:id',
	celebrate({
		[Segments.PARAMS]: {
			id: Joi.string().uuid().required()
		}
	}),
	userController.getById
)

usersRouter.patch(
	'/avatar',
	isAuthenticated,
	upload.single('avatar'),
	avatarController.update
)

usersRouter.put(
	'/',
	celebrate({
		[Segments.BODY]: {
			name: Joi.string().required(),
			email: Joi.string().email().required(),
			oldPassword: Joi.string(),
			password: Joi.string().optional(),
			passwordConfirmation: Joi.string()
				.valid(Joi.ref('password'))
				.when('password', {
					is: Joi.exist(),
					then: Joi.required()
				})
		}
	}),
	userController.edit
)

export default usersRouter
