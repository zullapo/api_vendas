import UserController from '@modules/users/controllers/UserController'
import { Router } from 'express'
import { celebrate, Joi, Segments } from 'celebrate'
import isAuthenticated from '../middlewares/isAuthenticated'
import multer from 'multer'
import uploadConfig from '@config/upload'
import AvatarController from '../controllers/AvatarController'

const userController = new UserController()
const avatarController = new AvatarController()

const userRouter = Router()

const upload = multer(uploadConfig)

userRouter.get('/', isAuthenticated, userController.get)

userRouter.post(
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

userRouter.get(
	'/:id',
	celebrate({
		[Segments.PARAMS]: {
			id: Joi.string().uuid().required()
		}
	}),
	userController.getById
)

userRouter.patch(
	'/avatar',
	isAuthenticated,
	upload.single('avatar'),
	avatarController.update
)

export default userRouter
