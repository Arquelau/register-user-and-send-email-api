import { UserData } from 'usecases/register-user-on-mailing-list/user-data'
import { InMemoryUserRepository } from 'usecases/register-user-on-mailing-list/repository/in-memory-user-repository'

describe('In memory User repository', () => {
  test('should return null if user is not found', async () => {
    const users: UserData[] = []
    const userRepo = new InMemoryUserRepository(users)
    const user = await userRepo.findUserByEmail('any@mail.com')
    expect(user).toBeNull()
  })
})
