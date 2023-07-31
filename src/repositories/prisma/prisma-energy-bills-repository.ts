import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

import { EnergyBillsRepository } from '../energy-bills-repository'


export class PrismaEnergyBillsRepository implements EnergyBillsRepository {
  async register(data: Prisma.EnergyBillUncheckedCreateInput) {
    const energyBill = await prisma.energyBill.create({
      data
    })

    return energyBill
  }

  async findById(id: string) {
    const energyBill = await prisma.energyBill.findUnique({
      where: {
        id
      }
    })

    return energyBill
  }

  async findInvoiceByUserIdAndByInvoiceNumber(userId: string, invoiceNumber: string) {
    const energyBill = await prisma.energyBill.findUnique({
      where: {
        user_id: userId,
        invoice_number: invoiceNumber
      }
    })

    return energyBill
  }

  async findManyByUserId(userId: string, page: number) {
    const energyBill = await prisma.energyBill.findMany({
      where: {
        user_id: userId
      },
      orderBy: [
        {
          installation_number: 'desc',
        },
        {
          due_date_iso: 'desc',
        }
      ],
      take: 20,
      skip: (page - 1) * 20
    })

    return energyBill
  }

}