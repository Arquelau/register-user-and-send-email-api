import { UserData } from '@/entities'
import { Either, right } from '@/share'
import { MailServiceError } from '@/usecases/error'
import { RegisterAndSendEmail } from '@/usecases/register-and-send-email'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository'
import { SendEmail } from '@/usecases/send-email'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports'

describe('Register and send email use case', () => {
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
  test('should register user and send an email with valid data', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const registerUsecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const mailServiceMock = new MailServiceMock()
    const sendEmailUseCase: SendEmail = new SendEmail(mailOptions, mailServiceMock)
    const registerAndSendEmailUseCase : RegisterAndSendEmail = new RegisterAndSendEmail(registerUsecase, sendEmailUseCase)
    const name = 'any_name'
    const email = 'any@mail.com'
    const response: UserData = (await registerAndSendEmailUseCase.perform({ name, email })).value as UserData
    const user = repo.findUserByEmail('any@mail.com')
    expect((await user).name).toBe('any_name')
    expect(response.name).toBe('any_name')
    expect(mailServiceMock.timesSendWasCalled).toEqual(1)
    expect(response.name).toEqual('any_name')
  })

  test('should not add and send an email with invalid email', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const registerUsecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const mailServiceMock = new MailServiceMock()
    const sendEmailUseCase: SendEmail = new SendEmail(mailOptions, mailServiceMock)
    const registerAndSendEmailUseCase : RegisterAndSendEmail = new RegisterAndSendEmail(registerUsecase, sendEmailUseCase)
    const name = 'any_name'
    const invalidEmail = 'invalid_email'
    const response = (await registerAndSendEmailUseCase.perform({ name, email: invalidEmail })).value as Error
    expect(response.name).toEqual('InvalidEmailError')
  })

  test('should not add and send an email with invalid name', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const registerUsecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const mailServiceMock = new MailServiceMock()
    const sendEmailUseCase: SendEmail = new SendEmail(mailOptions, mailServiceMock)
    const registerAndSendEmailUseCase : RegisterAndSendEmail = new RegisterAndSendEmail(registerUsecase, sendEmailUseCase)
    const invalidName = 'a'
    const email = 'any@mail.com'
    const response = (await registerAndSendEmailUseCase.perform({ name: invalidName, email })).value as Error
    expect(response.name).toEqual('InvalidNameError')
  })
})
