import { EnergyBill } from '@prisma/client'
import { EnergyBillRepository } from '@/repositories/energy-bills-repository'


interface FetchUsersEnergyBillsUseCaseRequest {
  userId: string,
  page: number,
}

interface FetchUsersEnergyBillsUseCaseResponse {
  energyBills: EnergyBill[]
}

export class FetchUsersEnergyBillsUseCase {
  constructor(
    private energyBillRepository: EnergyBillRepository
  ) {}

  async execute({ 
    userId, page 
  }: FetchUsersEnergyBillsUseCaseRequest): Promise<FetchUsersEnergyBillsUseCaseResponse> {
    const energyBills = await this.energyBillRepository.findManyByUserId(userId, page)

    return { energyBills }
  }


}