import { User, UserData } from '@/entities'
import { Either, right } from '@/share'
import { MailServiceError } from '@/usecases/error'
import { RegisterAndSendEmail } from '@/usecases/register-and-send-email'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository'
import { SendEmail } from '@/usecases/send-email'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports'

describe('Register user on mailing list use case', () => {
  const attachmentFilePath = '../resources/text.txt'
  const fromName = 'Test'
  const fromEmail = 'from_email@mail.com'
  const toName = 'any_name'
  const toEmail = 'any_email@mail.com'
  const subject = 'Test e-mail'
  const emailBody = 'Hello world attachment test'
  const emailBodyHtml = '<b>Hello world attachment test</b>'
  const attachment = [{
    filename: attachmentFilePath,
    contentType: 'text/plain'
  }]

  const mailOptions: EmailOptions = {
    host: 'test',
    port: 867,
    username: 'test',
    password: 'test',
    from: fromName + ' ' + fromEmail,
    to: toName + '<' + toEmail + '>',
    subject,
    text: emailBody,
    html: emailBodyHtml,
    attachments: attachment
  }

  class MailServiceMock implements EmailService {
    public timesSendWasCalled = 0
    async send (emailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
      this.timesSendWasCalled++
      return right(emailOptions)
    }
  }
  test('should add user with complete data to mailing list', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const registerUsecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const mailServiceMock = new MailServiceMock()
    const sendEmailUseCase: SendEmail = new SendEmail(mailOptions, mailServiceMock)
    const registerAndSendEmailUseCase : RegisterAndSendEmail = new RegisterAndSendEmail(registerUsecase, sendEmailUseCase)
    const name = 'any_name'
    const email = 'any@mail.com'
    const response: User = (await registerAndSendEmailUseCase.perform({ name, email })).value as User
    const user = repo.findUserByEmail('any@mail.com')
    expect((await user).name).toBe('any_name')
    expect(response.name.value).toBe('any_name')
    expect(mailServiceMock.timesSendWasCalled).toEqual(1)
    expect(response.name.value).toEqual('any_name')
  })
})
