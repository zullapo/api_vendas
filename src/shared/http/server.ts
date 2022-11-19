import 'reflect-metadata'
import express, { NextFunction, Request, Response } from 'express'
import 'express-async-errors'
import cors from 'cors'
import routers from './routers'
import AppError from '@shared/errors/AppError'
import '@shared/typeorm'
import { errors } from 'celebrate'
import uploadConfig from '@config/upload'
import rateLimiter from '@shared/http/middlewares/rateLimiter'

const app = express()
const port = 3333

app.use(cors())
app.use(express.json())

app.use(rateLimiter)

app.use('/files', express.static(uploadConfig.directory))

app.use(routers)

app.use(errors())

function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
	if (err instanceof AppError) {
		return res.status(err.statusCode).json({ status: 'error', message: err.message })
	}
	console.log(err.message)
	return res.status(500).json({ status: 'error', message: 'Unexpected error' })
}

app.use(errorMiddleware)

app.listen(3333, () => {
	console.log(`Listening on port ${port}`)
})
