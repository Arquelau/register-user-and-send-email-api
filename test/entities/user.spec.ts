import { User } from 'entities/user'
import { left } from 'share/either'
import { InvalidEmailError } from 'entities/errors/invalid-email-error'
import { InvalidNameError } from 'entities/errors/invalid-name-error'

describe('User domain class', () => {
  test('should not create user with invalid e-mail adress', () => {
    const invalidEmail = 'invalid_email'
    const error = User.create({ name: 'any_name', email: invalidEmail })
    expect(error).toEqual(left(new InvalidEmailError()))
  })

  test('should not create user with invalid name (too few characters)', () => {
    const invalidName = 'O        '
    const error = User.create({ name: invalidName, email: 'any@mail.com' })
    expect(error).toEqual(left(new InvalidNameError()))
  })

  test('should not create user with invalid name (too many characters)', () => {
    const invalidName = 'O'.repeat(257)
    const error = User.create({ name: invalidName, email: 'any@mail.com' })
    expect(error).toEqual(left(new InvalidNameError()))
  })

  test('should create user with valid data', () => {
    const validName = 'any_name'
    const validEmail = 'any@maill.com'
    const user: User = User.create({ name: validName, email: validEmail }).value as User
    expect(user.name.value).toEqual(validName)
    expect(user.email.value).toEqual(validEmail)
  })
})
