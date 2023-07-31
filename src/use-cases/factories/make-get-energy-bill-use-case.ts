import { PrismaEnergyBillsRepository } from '@/repositories/prisma/prisma-energy-bills-repository'
import { GetEnergyBillUseCase } from '../get-energy-bill'

export function makeGetEnergyBillUseCase() {
  const energyBillRepository = new PrismaEnergyBillsRepository()
  const useCase = new GetEnergyBillUseCase(energyBillRepository)

  return useCase
}