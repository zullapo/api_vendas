import handlebars from 'handlebars'
import fs from 'fs'

interface TemplateVariables {
	[variable: string]: string | number
}

interface ParseTemplate {
	templateFile: string
	variables: TemplateVariables
}

class HandlebarsMailTemplate {
	async parse({ templateFile, variables }: ParseTemplate): Promise<string> {
		const templateFileContent = await fs.promises.readFile(templateFile, {
			encoding: 'utf-8'
		})
		const parseTemplate = handlebars.compile(templateFileContent)

		return parseTemplate(variables)
	}
}

export default HandlebarsMailTemplate
export { ParseTemplate }
