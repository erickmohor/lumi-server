import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { makeGetEnergyBillUseCase } from '@/use-cases/factories/make-get-energy-bill-use-case'


export async function show(request: FastifyRequest, reply: FastifyReply) {
  const showEnergyBillParamsSchema = z.object({
    energyBillId: z.string(),
  })

  const { energyBillId } = showEnergyBillParamsSchema.parse(request.params)

  try {
    const showEnergyBillUseCase = makeGetEnergyBillUseCase()

    const { energyBill } = await showEnergyBillUseCase.execute({ energyBillId })

    return reply.status(200).send({ energyBill })
  } catch (err) {

    if (err instanceof ResourceNotFoundError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }

}