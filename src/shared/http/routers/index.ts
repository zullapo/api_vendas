import { Router } from 'express'
import productsRouter from '@modules/products/routers/products.router'
import usersRouter from '@modules/users/routers/users.router'
import authenticationRouter from '@modules/users/routers/authentication.router'
import passwordRouter from '@modules/users/routers/password.router'
import customersRouter from '@modules/customers/routers/customers.router'
import ordersRouter from '@modules/orders/routes/orders.router'

const routers = Router()

routers.use('/products', productsRouter)
routers.use('/users', usersRouter)
routers.use('/login', authenticationRouter)
routers.use('/password', passwordRouter)
routers.use('/customers', customersRouter)
routers.use('/orders', ordersRouter)

export default routers
