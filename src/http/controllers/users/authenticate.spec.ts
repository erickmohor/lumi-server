import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'


describe('User - Authenticate (e2e)', () => {
  beforeAll( async() => {
    app.ready()
  })

  afterAll( async() => {
    app.close()
  })

  it('should be able to authenticate', async() => {
    await request(app.server)
      .post('/user/register')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456'
      })

    const response = await request(app.server)
      .post('/user/auth')
      .send({
        email: 'johndoe@example.com',
        password: '123456'
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
      user: {
        id: expect.any(String),
        name: 'John Doe',
        email: 'johndoe@example.com',
        role: 'MEMBER',
        created_at: expect.any(String),
      },
    })
  })

  it('should not be able to authenticate with wrong password', async() => {
    const response = await request(app.server)
      .post('/user/auth')
      .send({
        email: 'johndoe@example.com',
        password: '123457'
      })

    expect(response.statusCode).toEqual(400)
    expect(response.body.message).toEqual('Invalid Credentials.')
  })

})