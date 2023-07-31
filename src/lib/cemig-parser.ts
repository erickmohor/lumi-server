/* eslint-disable @typescript-eslint/no-explicit-any */
import { PdfReader } from 'pdfreader'

import { removeEmptySpaces, splitEmptySpaces } from '../utils/functions'
import { UnableToReadThePdfError } from '@/use-cases/errors/unable-to-read-the-pdf-error'


export interface EnergyBillProps {
  customerNumber: string,
  installationNumber: string,
  referenceMonth: string,
  invoiceNumber: string,
  invoiceTotal: string,
  dueDate: string,
  dueDateIso: string,

  energyUnit: string,
  energyAmount: string,
  energyPrice: string,
  totalEnergyCost: string,

  injectedEnergyUnit: string,
  injectedEnergyAmount: string,
  injectedEnergyPrice: string,
  totalInjectedEnergyCost: string,

  compensatedEnergyUnit: string,
  compensatedEnergyAmount: string,
  compensatedEnergyPrice: string,
  totalCompensatedEnergyCost: string,

  contributionPublicLighting: string,
}


export async function cemigParser(buffer: Buffer) {

  function readPDFPages(buffer: Buffer, reader = (new PdfReader())) {

    return new Promise((resolve, reject) => {
      const pages: any = []

      reader.parseBuffer(buffer, (error: any, item: any) => {

        if (error) {
          console.log(error)
          reject({ message: 'Unable to read the pdf.' })
        }
        else if (!item) {
          resolve(pages)
        }
        else if (item.page) {
          pages.push({})
        }
        else if (item.text) {
          const row = pages[pages.length - 1][item.y] || []
          row.push(item.text)
          pages[pages.length - 1][item.y] = row
        }
      })
    })

  }


  function parseBill(pages: any) {
    const page = pages[0]

    const fields: any = {
      customerNumber: { row: '9.272', index: 0 },
      referenceMonth: { row: '3.9219999999999997', index: 0 },
      invoiceTotal: { row: '17.256', index: 1 },
      invoiceNumber: { row: '4.831', index: 0 },

      energyUnit: { row: '14.856', index: 1 },
      energyAmount: { row: '14.856', index: 2 },
      energyPrice: { row: '14.856', index: 3 },
      totalEnergyCost: { row: '14.856', index: 4 },

      injectedEnergyUnit: { row: '15.456', index: 1 },
      injectedEnergyAmount: { row: '15.456', index: 2 },
      injectedEnergyPrice: { row: '15.456', index: 3 },
      totalInjectedEnergyCost: { row: '15.456', index: 4 },

      compensatedEnergyUnit: { row: '16.056', index: 1 },
      compensatedEnergyAmount: { row: '16.056', index: 2 },
      compensatedEnergyPrice: { row: '16.056', index: 3 },
      totalCompensatedEnergyCost: { row: '16.056', index: 4 },

      contributionPublicLighting: { row: '16.656', index: 1 },
    }

    const data: any = {}

    try {
      Object.keys(fields)
        .forEach((key) => {
          const field = fields[key]
          const val = page[field.row][field.index]
          data[key] = val
        })
      
    } catch (error) {
      throw new UnableToReadThePdfError()
    }

    const customerNumberSplitted = splitEmptySpaces(data['customerNumber'])
    const referenceMonthSplitted = splitEmptySpaces(data['referenceMonth'])

    const invoiceNumberSplitted = data['invoiceNumber'].split('NOTA FISCAL Nº').pop()?.split(' - SÉRIE')

    data['customerNumber'] = customerNumberSplitted[1]
    data['invoiceNumber'] = invoiceNumberSplitted ? invoiceNumberSplitted[0] : '0'
    data['installationNumber'] = customerNumberSplitted[2]
    data['referenceMonth'] = referenceMonthSplitted[1]
    data['dueDate'] = referenceMonthSplitted[2]

    const dueDateSplitted = data['dueDate'].split('/')

    const convertedDueDate = `${dueDateSplitted[2]}-${dueDateSplitted[1]}-${dueDateSplitted[0]}`

    data['dueDateIso'] = convertedDueDate

    const formattedBill: any = {}
    
    for (const key in data) {
      const removeAllDots = data[key].replaceAll('.', '')
      const transformCommaToDot = removeAllDots.replaceAll(',', '.')
      formattedBill[key] = removeEmptySpaces(transformCommaToDot)      
    }

    return formattedBill
  }


  const pdfContent = await readPDFPages(buffer)

  const parsedBill = parseBill(pdfContent)

  return parsedBill
}