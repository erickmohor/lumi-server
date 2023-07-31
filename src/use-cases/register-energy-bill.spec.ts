import { beforeEach, describe, expect, it } from 'vitest'
import { Prisma } from '@prisma/client'
import fs from 'fs'

import { RegisterEnergyBillUseCase } from './register-energy-bill'
import { InMemoryEnergyBillsRepository } from '@/repositories/in-memory/in-memory-energy-bills-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { ResourceNotFoundError } from './errors/resource-not-found'
import { UnableToReadThePdfError } from './errors/unable-to-read-the-pdf-error'
import { EnergyBillAlreadyExistsError } from './errors/energy-bill-already-exists-error'


let energyBillsRepository: InMemoryEnergyBillsRepository
let usersRepository: InMemoryUsersRepository
let sut: RegisterEnergyBillUseCase

let createdUser: Prisma.UserCreateInput

describe('Energy Bill - Register Use Case', () => {

  beforeEach(async() => {
    energyBillsRepository = new InMemoryEnergyBillsRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterEnergyBillUseCase(energyBillsRepository, usersRepository)

    createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: '123456'
    })
  })


  it('should be able to register the energy bill from a cemig pdf file', async() => {
    const pdfBuffer = fs.readFileSync('src/utils/test-files/cemig-bill.pdf')

    const { energyBill } = await sut.execute({
      pdfBuffer,
      userId: createdUser.id ?? ''
    })

    expect(energyBill.id).toEqual(expect.any(String))
    expect(energyBill.user_id).toEqual(createdUser.id)
  })


  it('should not be able to register the energy bill without an existing user', async() => {
    const pdfBuffer = fs.readFileSync('src/utils/test-files/cemig-bill.pdf')

    await expect(() =>
      sut.execute({
        pdfBuffer,
        userId: 'user-that-does-not-exist'
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })


  it('should not be able to register the same energy bill twice or more for the same user', async() => {
    const pdfBuffer = fs.readFileSync('src/utils/test-files/cemig-bill.pdf')

    await sut.execute({
      pdfBuffer,
      userId: createdUser.id ?? ''
    })

    await expect(() =>
      sut.execute({
        pdfBuffer,
        userId: createdUser.id ?? ''
      })
    ).rejects.toBeInstanceOf(EnergyBillAlreadyExistsError)
  })


  it('should not be able to register the energy bill from a pdf file different from cemig', async() => {
    const pdfBuffer = fs.readFileSync('src/utils/test-files/wrong-pdf.pdf')

    await expect(() =>
      sut.execute({
        pdfBuffer,
        userId: createdUser.id ?? ''
      })
    ).rejects.toBeInstanceOf(UnableToReadThePdfError)
  })

})