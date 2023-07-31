import { makeFetchUsersEnergyBillsUseCase } from '@/use-cases/factories/make-fetch-user-energy-bills-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'


export async function all(request: FastifyRequest, reply: FastifyReply) {
  const fetchAdminsQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = fetchAdminsQuerySchema.parse(request.query)

  const fetchUsersEnergyBillUseCase = makeFetchUsersEnergyBillsUseCase()

  const { energyBills } = await fetchUsersEnergyBillUseCase.execute({ 
    userId: request.user.sub,
    page 
  })

  return reply.status(200).send({ energyBills })
}