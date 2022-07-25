import { UserData } from './user-data'
import { Either, left } from '../share/either'
import { InvalidEmailError } from 'entities/errors/invalid-email-error'
import { InvalidNameError } from './errors/invalid-name-error'
import { Email } from './email'
import { Name } from './name'

export class User {
  static create (userData: UserData): Either<InvalidEmailError | InvalidNameError, User> {
    const nameOrError = Name.create(userData.name)
    if (nameOrError.isLeft()) {
      return left(new InvalidNameError())
    }

    const emailOrError = Email.create(userData.email)
    if (emailOrError.isLeft()) {
      return left(new InvalidEmailError())
    }
  }
}
