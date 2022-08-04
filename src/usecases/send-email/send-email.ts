import { User } from '@/entities'
import { Either } from '@/share'
import { UseCase } from '@/usecases/ports'
import { MailServiceError } from '@/usecases/error'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports'

export class SendEmail implements UseCase {
  private readonly emailOptions: EmailOptions
  private readonly emailService: EmailService

  constructor (emailOptions: EmailOptions, emailService: EmailService) {
    this.emailOptions = emailOptions
    this.emailService = emailService
  }

  async perform (request: User):
    Promise<Either<MailServiceError, EmailOptions>> {
    const greetings = 'Eae, <b>' + request.name.value + '</b>, seu fedapulto do caraio do caraio kkkkkkk'
    const customizedHtml = greetings + '<br> <br>' + this.emailOptions.html
    const emailInfo: EmailOptions = {
      host: this.emailOptions.host,
      port: this.emailOptions.port,
      username: this.emailOptions.username,
      password: this.emailOptions.password,
      from: this.emailOptions.from,
      to: request.name.value + '<' + request.email.value + '>',
      subject: this.emailOptions.subject,
      text: this.emailOptions.text,
      html: customizedHtml,
      attachments: this.emailOptions.attachments
    }
    return await this.emailService.send(emailInfo)
  }
}
