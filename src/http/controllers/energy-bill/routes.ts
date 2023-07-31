import { FastifyInstance } from 'fastify'
import { register } from './register'
import multer from 'fastify-multer'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { all } from './all'
import { show } from './show'


const storage = multer.memoryStorage()
const upload = multer({storage: storage})

export async function energyBillRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/energy-bill/show/:energyBillId', show)
  app.get('/energy-bill/all', all)

  app.post('/energy-bill/register', { preHandler: upload.single('file') }, register)
}