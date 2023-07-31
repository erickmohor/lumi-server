import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'


describe('Energy Bill - Register (e2e)', () => {
  let userToken = ''

  beforeAll( async() => {
    app.ready()
    const { token } = await createAndAuthenticateUser(app)
    userToken = token
  })

  afterAll( async() => {
    app.close()
  })

  it('should be able to register the energy bill from a cemig pdf file', async() => {
    const response = await request(app.server)
      .post('/energy-bill/register')
      .attach('file', 'src/utils/test-files/cemig-bill.pdf')
      .set('Authorization', `Bearer ${userToken}`)

    expect(response.statusCode).toEqual(201)
    expect(response.body.energyBill).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        customer_number: expect.any(String),
        installation_number: expect.any(String),
      })
    )
  })

  
  it('should not be able to register the same energy bill twice or more for the same user', async() => {
    const response = await request(app.server)
      .post('/energy-bill/register')
      .attach('file', 'src/utils/test-files/cemig-bill.pdf')
      .set('Authorization', `Bearer ${userToken}`)

    expect(response.statusCode).toEqual(400)
    expect(response.body.message).toEqual('Invoice number already exists for this user.')
  })


  it('should not be able to register the energy bill from a pdf file different from cemig', async() => {
    const response = await request(app.server)
      .post('/energy-bill/register')
      .attach('file', 'src/utils/test-files/wrong-pdf.pdf')
      .set('Authorization', `Bearer ${userToken}`)

    expect(response.statusCode).toEqual(400)
    expect(response.body.message).toEqual('Unable to read the pdf.')
  })

})