import { PrismaEnergyBillsRepository } from '@/repositories/prisma/prisma-energy-bills-repository'
import { RegisterEnergyBillUseCase } from '../register-energy-bill'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeRegisterEnergyBillUseCase() {
  const energyBillRepository = new PrismaEnergyBillsRepository()
  const usersRepository = new PrismaUsersRepository()
  const useCase = new RegisterEnergyBillUseCase(energyBillRepository, usersRepository)

  return useCase
}