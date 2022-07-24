import { User } from 'entities/user'
import { left } from 'share/either'
import { InvalidEmailError } from 'entities/errors/invalid-email-error'

describe('User domain class', () => {
  test('should not create user with inavlid e-mail adress', () => {
    const invalidEmail = 'invalid_email'
    const error = User.create({ name: 'any_name', email: invalidEmail })
    expect(error).toEqual(left(new InvalidEmailError()))
  })
})
