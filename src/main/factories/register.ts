import { RegisterAndSendEmailController } from '@/web-controllers'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { MongodbUserRepository } from '@/external/repositories/mongodb'
import { NodemailerEmailService } from '@/external/repositories/mongodb/mail-services'
import { SendEmail } from '@/usecases/send-email'
import { getEmailOptions } from '@/main/config/email'
import { RegisterAndSendEmail } from '@/usecases/register-and-send-email'

export const makeRegisterAndSendEmailController = (): RegisterAndSendEmailController => {
  const userRepository = new MongodbUserRepository()
  const emailService = new NodemailerEmailService()
  const sendEmailUseCase = new SendEmail(getEmailOptions(), emailService)
  const registerUserOnMailingListUseCase = new RegisterUserOnMailingList(userRepository)
  const registerAndSendEmailUseCase = new RegisterAndSendEmail(registerUserOnMailingListUseCase, sendEmailUseCase)
  const registerUserController = new RegisterAndSendEmailController(registerAndSendEmailUseCase)
  return registerUserController
}
