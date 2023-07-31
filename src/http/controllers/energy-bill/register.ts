import { FastifyReply, FastifyRequest } from 'fastify'

import { UnableToReadThePdfError } from '@/use-cases/errors/unable-to-read-the-pdf-error'
import { makeRegisterEnergyBillUseCase } from '@/use-cases/factories/make-register-energy-bill-use-case'
import { EnergyBillAlreadyExistsError } from '@/use-cases/errors/energy-bill-already-exists-error'

interface MulterRequest extends FastifyRequest {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file?: any
}

export async function register(request: MulterRequest, reply: FastifyReply) {
  const pdf = await request.file

  if (!pdf) {
    return reply.status(400).send({ message: 'File not received' })
  }

  try {
    const registerEnergyBillUseCase = makeRegisterEnergyBillUseCase()

    const { energyBill } = await registerEnergyBillUseCase.execute({ 
      userId: request.user.sub,
      pdfBuffer: pdf.buffer
    })
  
    return reply.status(201).send({ energyBill })
  } catch (err) {

    if (err instanceof UnableToReadThePdfError || err instanceof EnergyBillAlreadyExistsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }

}