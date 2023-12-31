import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'


describe('User - Register (e2e)', () => {
  beforeAll( async() => {
    app.ready()
  })

  afterAll( async() => {
    app.close()
  })

  it('should be able to register', async() => {
    const response = await request(app.server)
      .post('/user/register')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456'
      })

    expect(response.statusCode).toEqual(201)
  })

})