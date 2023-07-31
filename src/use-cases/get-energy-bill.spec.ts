import { beforeEach, describe, expect, it } from 'vitest'

import { GetEnergyBillUseCase } from './get-energy-bill'
import { InMemoryEnergyBillsRepository } from '@/repositories/in-memory/in-memory-energy-bills-repository'


let energyBillsRepository: InMemoryEnergyBillsRepository
let sut: GetEnergyBillUseCase

describe('Energy Bill - Get Energy Bill Use Case', () => {

  beforeEach(async() => {
    energyBillsRepository = new InMemoryEnergyBillsRepository()
    sut = new GetEnergyBillUseCase(energyBillsRepository)
  })


  it('should be able to get the energy bill', async() => {
    const createdEnergyBill = await energyBillsRepository.register({
      customer_number: '7202788969',
      installation_number: '3004298116',
      reference_month: 'ABR/2023',
      invoice_number: '027811849',
      invoice_total: 157.49,
      due_date: '09/05/2023',
      energy_unit: 'kWh',
      energy_amount: 100,
      energy_price: 0.83403141,
      total_energy_cost: 83.39,
      injected_energy_unit: 'kWh',
      injected_energy_amount: 1241,
      injected_energy_price: 0.65313,
      total_injected_energy_cost: -810.53,
      compensated_energy_unit: 'kWh',
      compensated_energy_amount: 1241,
      compensated_energy_price: 0.68390576,
      total_compensated_energy_cost: 848.71,
      contribution_public_lighting: 35.92,
      user_id: 'user-01'
    })

    const { energyBill } = await sut.execute({
      energyBillId: createdEnergyBill.id,
    })
    
    expect(energyBill.id).toEqual(expect.any(String))
    expect(energyBill.customer_number).toEqual('7202788969')
    expect(energyBill.installation_number).toEqual('3004298116')
    expect(energyBill.user_id).toEqual('user-01')
  })

})