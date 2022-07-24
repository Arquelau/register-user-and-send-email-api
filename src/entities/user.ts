import { UserData } from './user-data'
import { Either, left } from '../share/either'
import { InvalidEmailError } from 'entities/errors/invalid-email-error'
import { Email } from './email'

export class User {
  static create (userData: UserData): Either<InvalidEmailError, User> {
    const emailOrError = Email.create(userData.email)

    if (emailOrError.isLeft()) {
      return left(new InvalidEmailError())
    }
  }
}
