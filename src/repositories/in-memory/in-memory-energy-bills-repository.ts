import { randomUUID } from 'node:crypto'
import { EnergyBill, Prisma } from '@prisma/client'

import { EnergyBillsRepository } from '../energy-bills-repository'


export class InMemoryEnergyBillsRepository implements EnergyBillsRepository {
  public items: EnergyBill[] = []

  async register(data: Prisma.EnergyBillUncheckedCreateInput) {

    const energyBill = {
      id: randomUUID(),
      created_at: new Date(),
      customer_number: data.customer_number,
      installation_number: data.installation_number,
      reference_month: data.reference_month,
      invoice_number: data.invoice_number,
      invoice_total: new Prisma.Decimal(String(data.invoice_total)),
      due_date: data.due_date,
      due_date_iso: data.due_date_iso,
      energy_unit: data.energy_unit,
      energy_amount: new Prisma.Decimal(String(data.energy_amount)),
      energy_price: new Prisma.Decimal(String(data.energy_price)),
      total_energy_cost: new Prisma.Decimal(String(data.total_energy_cost)),
      injected_energy_unit: data.injected_energy_unit,
      injected_energy_amount: new Prisma.Decimal(String(data.injected_energy_amount)),
      injected_energy_price: new Prisma.Decimal(String(data.injected_energy_price)),
      total_injected_energy_cost: new Prisma.Decimal(String(data.total_injected_energy_cost)),
      compensated_energy_unit: data.compensated_energy_unit,
      compensated_energy_amount: new Prisma.Decimal(String(data.compensated_energy_amount)),
      compensated_energy_price: new Prisma.Decimal(String(data.compensated_energy_price)),
      total_compensated_energy_cost: new Prisma.Decimal(String(data.total_compensated_energy_cost)),
      contribution_public_lighting: new Prisma.Decimal(String(data.contribution_public_lighting)),
      user_id: data.user_id,
    }

    this.items.push(energyBill)

    return energyBill
  }


  async findById(id: string) {
    const energyBill = this.items.find(item => item.id === id)

    if (!energyBill) {
      return null
    }

    return energyBill
  }


  async findInvoiceByUserIdAndByInvoiceNumber(userId: string, invoiceNumber: string) {
    const energyBill = this.items.find(item => item.user_id === userId && item.invoice_number === invoiceNumber)

    if (!energyBill) {
      return null
    }

    return energyBill
  }


  async findManyByUserId(userId: string, page: number) {
    return this.items
      .filter((item) => item.user_id === userId)
      .slice((page - 1) * 20, page * 20)
  }

}