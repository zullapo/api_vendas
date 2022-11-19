import AppError from '@shared/errors/AppError'
import { getCustomRepository } from 'typeorm'
import CustomerRepository from '../repositories/CustomerRepository'
import Customer from '../typeorm/entities/Customer'

interface CustomerDTO {
	name: string
	email: string
}

class CustomerService {
	async add(data: CustomerDTO): Promise<Customer> {
		const { name, email } = data

		const customerRepository = getCustomRepository(CustomerRepository)

		const emailExists = await customerRepository.findByEmail(email)
		if (emailExists) {
			throw new AppError('Email address already used by some user')
		}

		const customer = customerRepository.create({ name, email })

		const savedCustomer = await customerRepository.save(customer)

		return savedCustomer
	}

	async get(): Promise<Customer[]> {
		const customerRepository = getCustomRepository(CustomerRepository)

		const customers = await customerRepository.find()

		return customers
	}

	async getById(id: string): Promise<Customer> {
		const customerRepository = getCustomRepository(CustomerRepository)

		const customer = await customerRepository.findById(id)
		if (!customer) {
			throw new AppError('Customer not found')
		}

		return customer
	}

	async edit(id: string, data: CustomerDTO): Promise<Customer> {
		const { name, email } = data

		const customerRepository = getCustomRepository(CustomerRepository)

		const customer = await customerRepository.findById(id)
		if (!customer) {
			throw new AppError('Customer not found')
		}

		const customerEmail = await customerRepository.findByEmail(email)
		if (customerEmail && customer.email !== email) {
			throw new AppError('Email address already used by some user')
		}

		customer.name = name
		customer.email = email

		await customerRepository.save(customer)

		return customer
	}

	async remove(id: string): Promise<Customer> {
		const customerRepository = getCustomRepository(CustomerRepository)

		const customer = await customerRepository.findById(id)

		if (!customer) {
			throw new AppError('Customer not found')
		}

		await customerRepository.remove(customer)

		return customer
	}
}

export default CustomerService
