import { beforeEach, describe, expect, it } from 'vitest'
import { compare } from 'bcryptjs'

import { RegisterUserUseCase } from './register-user'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { UserAlreadyExistsError } from './errors/user-already-exists-error'


let usersRepository: InMemoryUsersRepository
let sut: RegisterUserUseCase

describe('User - Register Use Case', () => {

  beforeEach( () => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUserUseCase(usersRepository)
  } )
  

  it('should hash user password once it registers', async() => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })


  it('should be able to register', async() => {  
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })
    
    expect(user.id).toEqual(expect.any(String))
  })
  

  it('should not be able to register with the same email twice', async() => { 
    const email = 'johndoe@example.com'
  
    await sut.execute({
      name: 'John Doe',
      email,
      password: '123456'
    })
  
    await expect( () => 
      sut.execute({
        name: 'John Doe',
        email,
        password: '123456'
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
  
})