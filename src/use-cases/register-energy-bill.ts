import { EnergyBill } from '@prisma/client'

import { UsersRepository } from '@/repositories/users-repository'
import { EnergyBillsRepository } from '@/repositories/energy-bills-repository'

import { ResourceNotFoundError } from './errors/resource-not-found'
import { UnableToReadThePdfError } from './errors/unable-to-read-the-pdf-error'
import { EnergyBillAlreadyExistsError } from './errors/energy-bill-already-exists-error'

import { EnergyBillProps, cemigParser } from '@/lib/cemig-parser'


interface RegisterEnergyBillUseCaseRequest {
  userId: string,
  pdfBuffer: Buffer,
}

interface RegisterEnergyBillUseCaseResponse {
  energyBill: EnergyBill
}

export class RegisterEnergyBillUseCase {
  constructor(
    private energyBillRepository: EnergyBillsRepository,
    private usersRepository: UsersRepository,
  ) { }

  async execute({ pdfBuffer, userId }: RegisterEnergyBillUseCaseRequest): Promise<RegisterEnergyBillUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    let energyBillParsed: EnergyBillProps = {} as EnergyBillProps

    try {
      energyBillParsed = await cemigParser(pdfBuffer)
    } catch (error) {
      throw new UnableToReadThePdfError()
    }

    const energyBillWithSameInvoiceNumber = await this.energyBillRepository.findInvoiceByUserIdAndByInvoiceNumber(userId, energyBillParsed.invoiceNumber)
  
    if (energyBillWithSameInvoiceNumber) {
      throw new EnergyBillAlreadyExistsError()
    }

    const energyBill = await this.energyBillRepository.register({
      customer_number: energyBillParsed.customerNumber,
      installation_number: energyBillParsed.installationNumber,
      reference_month: energyBillParsed.referenceMonth,
      invoice_number: energyBillParsed.invoiceNumber,
      invoice_total: Number(energyBillParsed.invoiceTotal),
      due_date: energyBillParsed.dueDate,
      due_date_iso: energyBillParsed.dueDateIso,
      energy_unit: energyBillParsed.energyUnit,
      energy_amount: Number(energyBillParsed.energyAmount),
      energy_price: Number(energyBillParsed.energyPrice),
      total_energy_cost: Number(energyBillParsed.totalEnergyCost),
      injected_energy_unit: energyBillParsed.injectedEnergyUnit,
      injected_energy_amount: Number(energyBillParsed.injectedEnergyAmount),
      injected_energy_price: Number(energyBillParsed.injectedEnergyPrice),
      total_injected_energy_cost: Number(energyBillParsed.totalInjectedEnergyCost),
      compensated_energy_unit: energyBillParsed.compensatedEnergyUnit,
      compensated_energy_amount: Number(energyBillParsed.compensatedEnergyAmount),
      compensated_energy_price: Number(energyBillParsed.compensatedEnergyPrice),
      total_compensated_energy_cost: Number(energyBillParsed.totalCompensatedEnergyCost),
      contribution_public_lighting: Number(energyBillParsed.contributionPublicLighting),
      user_id: userId
    })

    return { energyBill }
  }

}