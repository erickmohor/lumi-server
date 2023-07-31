import { app } from '@/app'
import request from 'supertest'
import { prisma } from '@/lib/prisma'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'


describe('Energy Bill - Show (e2e)', () => {
  beforeAll( async() => {
    app.ready()
  })

  afterAll( async() => {
    app.close()
  })

  it('should be able to get the energy bill', async() => {
    const { token } = await createAndAuthenticateUser(app)

    const user = await prisma.user.findFirstOrThrow()

    const energyBill = await prisma.energyBill.create({
      data: {
        created_at: '2023-07-27T17:41:24.238Z',
        customer_number: '7202788969',
        installation_number: '3004298116',
        reference_month: 'ABR/2023',
        invoice_number: '027811849',
        invoice_total: 157.49,
        due_date: '09/05/2023',
        due_date_iso: '2023-05-09',
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
        user_id: user.id
      }
    })


    const response = await request(app.server)
      .get(`/energy-bill/show/${energyBill.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.energyBill.invoice_number).toEqual('027811849')
  })

})