import fastify from 'fastify'
import multer from 'fastify-multer'
import fastifyJwt from '@fastify/jwt'

import { ZodError } from 'zod'

import { env } from './env'

import { usersRoutes } from './http/controllers/users/routes'
import { energyBillRoutes } from './http/controllers/energy-bill/routes'


export const app = fastify()

app.addHook('preHandler', (req, res, done) => {

  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Access-Control-Allow-Headers', '*')

  const isPreflight = /options/i.test(req.method)
  if (isPreflight) {
    return res.send()
  }

  done()
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: '30d'
  }
})

app.register(multer.contentParser)

app.register(usersRoutes)
app.register(energyBillRoutes)


app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
    // eslint-disable-next-line no-empty
  } else { }

  return reply.status(500).send({ message: 'Internal server error.' })
})