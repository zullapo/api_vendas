import AppError from '@shared/errors/AppError'
import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'
import authConfig from '@config/auth'

interface TokenPayload {
	iat: number
	exp: number
	sub: string
}

function isAuthenticated(request: Request, response: Response, next: NextFunction) {
	const authHeader = request.headers.authorization

	if (!authHeader) {
		throw new AppError('Missing token')
	}

	const [, token] = authHeader.split(' ')

	try {
		const decodedToken = verify(token, authConfig.jwt.secret)
		const { sub } = decodedToken as TokenPayload
		request.user = {
			id: sub
		}
		return next()
	} catch (e) {
		throw new AppError('Invalid token')
	}
}

export default isAuthenticated
