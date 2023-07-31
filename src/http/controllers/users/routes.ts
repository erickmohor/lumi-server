import { FastifyInstance } from 'fastify'
import { register } from './register'
import { authenticate } from './authenticate'
import { profile } from './profile'
import { verifyJWT } from '@/http/middlewares/verify-jwt'


export async function usersRoutes(app: FastifyInstance) {
  app.post('/user/register', register)
  app.post('/user/auth', authenticate)


  /** Authenticated */
  app.get('/user/me', { onRequest: [verifyJWT] }, profile)

}