import nodemailer from 'nodemailer'
import HandlebarsMailTemplate, { ParseTemplate } from './HandlebarsMailTemplate'

interface EmailContact {
	name: string
	email: string
}

interface MessageDTO {
	to: EmailContact
	from?: EmailContact
	subject: string
	templateData: ParseTemplate
}

class EtherealMail {
	static async sendMail({ to, from, subject, templateData }: MessageDTO) {
		const account = await nodemailer.createTestAccount()
		const emailTemplate = new HandlebarsMailTemplate()
		const transporter = nodemailer.createTransport({
			host: account.smtp.host,
			port: account.smtp.port,
			secure: account.smtp.secure,
			auth: {
				user: account.user,
				pass: account.pass
			}
		})
		const message = await transporter.sendMail({
			from: {
				name: from?.name || 'Equipe API Vendas',
				address: from?.email || 'equipe@apivendas.com.br'
			},
			to: {
				name: to.name,
				address: to.email
			},
			subject,
			html: await emailTemplate.parse(templateData)
		})
		console.log(`Message sent: ${message.messageId}`)
		console.log(`Preview URL: ${nodemailer.getTestMessageUrl(message)}`)
	}
}

export default EtherealMail
