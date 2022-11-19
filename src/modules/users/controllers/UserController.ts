import { Request, Response } from 'express'
import UserService from '../services/UserService'

class UserController {
	service: UserService

	constructor() {
		this.service = new UserService()

		this.add = this.add.bind(this)
		this.get = this.get.bind(this)
		this.getById = this.getById.bind(this)
		this.edit = this.edit.bind(this)
	}

	async add(request: Request, response: Response): Promise<Response> {
		const { name, email, password, avatar } = request.body
		const user = { name, email, password, avatar }

		const savedUser = await this.service.add(user)

		return response.status(200).jsonp(savedUser)
	}

	async get(request: Request, response: Response): Promise<Response> {
		const users = await this.service.get()

		return response.status(200).jsonp(users)
	}

	async getById(request: Request, response: Response): Promise<Response> {
		const userId = request.user.id

		const user = await this.service.getById(userId)

		return response.status(200).jsonp(user)
	}

	async edit(request: Request, response: Response): Promise<Response> {
		const userId = request.user.id
		const { name, email, oldPassword, password } = request.body
		const data = { name, email, oldPassword, password, userId }

		const updatedUser = await this.service.edit(data)

		return response.status(200).jsonp(updatedUser)
	}
}

export default UserController
