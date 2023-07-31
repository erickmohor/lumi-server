import { PrismaEnergyBillsRepository } from '@/repositories/prisma/prisma-energy-bills-repository'
import { FetchUsersEnergyBillsUseCase } from '../fetch-user-energy-bills'

export function makeFetchUsersEnergyBillsUseCase() {
  const energyBillRepository = new PrismaEnergyBillsRepository()
  const useCase = new FetchUsersEnergyBillsUseCase(energyBillRepository)

  return useCase
}