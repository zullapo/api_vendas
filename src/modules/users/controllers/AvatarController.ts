import { Request, Response } from 'express'
import AvatarService from '../services/AvatarService'

class AvatarController {
	private service: AvatarService

	constructor() {
		this.service = new AvatarService()
		this.update = this.update.bind(this)
	}

	async update(request: Request, response: Response): Promise<Response> {
		const data = { userId: request.user.id, avatarFilename: request.file?.filename }

		const updatedUser = await this.service.update(data)

		return response.status(200).jsonp(updatedUser)
	}
}

export default AvatarController
