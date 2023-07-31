import { beforeEach, describe, expect, it } from 'vitest'

import { FetchUsersEnergyBillsUseCase } from './fetch-user-energy-bills'
import { InMemoryEnergyBillsRepository } from '@/repositories/in-memory/in-memory-energy-bills-repository'


let energyBillsRepository: InMemoryEnergyBillsRepository
let sut: FetchUsersEnergyBillsUseCase

describe('Energy Bill - Fetch User Energy Bill Use Case', () => {

  beforeEach(async() => {
    energyBillsRepository = new InMemoryEnergyBillsRepository()
    sut = new FetchUsersEnergyBillsUseCase(energyBillsRepository)
  })


  it('should be able to fetch user energy bill', async() => {
    await energyBillsRepository.register({
      customer_number: '7202788969',
      installation_number: '3004298116',
      reference_month: 'JAN/2023',
      invoice_number: '012345678',
      invoice_total: 150,
      due_date: '09/02/2023',
      energy_unit: 'kWh',
      energy_amount: 100,
      energy_price: 0.83003141,
      total_energy_cost: 80.4,
      injected_energy_unit: 'kWh',
      injected_energy_amount: 1100,
      injected_energy_price: 0.60313,
      total_injected_energy_cost: -800.53,
      compensated_energy_unit: 'kWh',
      compensated_energy_amount: 1041,
      compensated_energy_price: 0.68090576,
      total_compensated_energy_cost: 840.10,
      contribution_public_lighting: 30.20,
      user_id: 'user-01'
    })
    
    await energyBillsRepository.register({
      created_at: '2023-07-27T17:41:24.238Z',
      customer_number: '7202788969',
      installation_number: '3004298116',
      reference_month: 'FEV/2023',
      invoice_number: '023001800',
      invoice_total: 157.49,
      due_date: '09/03/2023',
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
    
    await energyBillsRepository.register({
      created_at: '2023-07-27T17:41:24.238Z',
      customer_number: '1111000000',
      installation_number: '0000111122',
      reference_month: 'ABR/2023',
      invoice_number: '010101010',
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
      user_id: 'user-02'
    })

    const { energyBills } = await sut.execute({
      page: 1,
      userId: 'user-01',
    })

    expect(energyBills).toHaveLength(2)
    expect(energyBills).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          user_id: 'user-01'
        }),
      ])
    )
  })

})