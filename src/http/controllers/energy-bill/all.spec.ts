import { app } from '@/app'
import request from 'supertest'
import { randomUUID } from 'crypto'
import { prisma } from '@/lib/prisma'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'


describe('Energy Bill - Get all user energy bills (e2e)', () => {
  beforeAll( async() => {
    app.ready()

  })

  afterAll( async() => {
    app.close()
  })


  it('should be able to show all user energy bills', async() => {
    const { token } = await createAndAuthenticateUser(app)

    const user = await prisma.user.findFirstOrThrow()

    await prisma.energyBill.createMany({
      data: [
        {
          id: randomUUID(),
          created_at: '2023-07-27T17:41:24.238Z',
          customer_number: '0000112233',
          installation_number: '0000445566',
          reference_month: 'JAN/2023',
          invoice_number: '012345678',
          invoice_total: '157.49',
          due_date: '09/02/2023',
          due_date_iso: '2023-02-09',
          energy_unit: 'kWh',
          energy_amount: '100',
          energy_price: '0.83403141',
          total_energy_cost: '83.39',
          injected_energy_unit: 'kWh',
          injected_energy_amount: '1241',
          injected_energy_price: '0.65313',
          total_injected_energy_cost: '-810.53',
          compensated_energy_unit: 'kWh',
          compensated_energy_amount: '1241',
          compensated_energy_price: '0.68390576',
          total_compensated_energy_cost: '848.71',
          contribution_public_lighting: '35.92',
          user_id: user.id
        },
        {
          id: randomUUID(),
          created_at: '2023-07-27T17:41:24.238Z',
          customer_number: '0000112233',
          installation_number: '0000445566',
          reference_month: 'FEV/2023',
          invoice_number: '102345678',
          invoice_total: '157.49',
          due_date: '09/03/2023',
          due_date_iso: '2023-03-09',
          energy_unit: 'kWh',
          energy_amount: '100',
          energy_price: '0.83403141',
          total_energy_cost: '83.39',
          injected_energy_unit: 'kWh',
          injected_energy_amount: '1241',
          injected_energy_price: '0.65313',
          total_injected_energy_cost: '-810.53',
          compensated_energy_unit: 'kWh',
          compensated_energy_amount: '1241',
          compensated_energy_price: '0.68390576',
          total_compensated_energy_cost: '848.71',
          contribution_public_lighting: '35.92',
          user_id: user.id
        }
      ]
    })

    const response = await request(app.server)
      .get('/energy-bill/all')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.energyBills).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          customer_number: '0000112233',
          installation_number: '0000445566',
          reference_month: 'JAN/2023',
          invoice_number: '012345678',
        }),
        expect.objectContaining({
          customer_number: '0000112233',
          installation_number: '0000445566',
          reference_month: 'FEV/2023',
          invoice_number: '102345678',
        })
      ])
    )
  })

})