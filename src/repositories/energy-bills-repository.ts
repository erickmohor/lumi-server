import { EnergyBill, Prisma } from '@prisma/client'

export interface EnergyBillsRepository {
  register(data: Prisma.EnergyBillUncheckedCreateInput): Promise<EnergyBill>
  findInvoiceByUserIdAndByInvoiceNumber(userId: string, invoiceNumber: string): Promise<EnergyBill | null>
  findById(id: string): Promise<EnergyBill | null>
  findManyByUserId(userId: string, page: number): Promise<EnergyBill[]>
}