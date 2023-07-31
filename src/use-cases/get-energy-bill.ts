import { EnergyBill } from '@prisma/client'
import { EnergyBillRepository } from '@/repositories/energy-bills-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'


interface GetEnergyBillUseCaseRequest {
  energyBillId: string,
}

interface GetEnergyBillUseCaseResponse {
  energyBill: EnergyBill
}

export class GetEnergyBillUseCase {
  constructor(private energyBillRepository: EnergyBillRepository) { }

  async execute({
    energyBillId
  }: GetEnergyBillUseCaseRequest): Promise<GetEnergyBillUseCaseResponse> {
    const energyBill = await this.energyBillRepository.findById(energyBillId)

    if (!energyBill) {
      throw new ResourceNotFoundError()
    }

    return { energyBill }
  }

}