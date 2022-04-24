import { BillFrom, BillTo, Invoice, Item } from '@prisma/client'
import { SavePendingInvoiceDTO } from '../dtos/save-pending-invoice.dto'

export interface SavedInvoice extends Invoice {
  billTo: BillTo
  billFrom: BillFrom
  items: Item[]
}

export function isSameInvoice(
  invoice: SavedInvoice,
  savePendingInvoiceDTO: SavePendingInvoiceDTO
) {
  let isEqualRegularValues = false
  if (
    invoice.description === savePendingInvoiceDTO.description &&
    invoice.date.getTime() === new Date(savePendingInvoiceDTO.date).getTime() &&
    invoice.paymentTerm === savePendingInvoiceDTO.paymentTerm
  ) {
    isEqualRegularValues = true
  }

  let isEqualBillToValues = false
  if (
    invoice.billTo.address === savePendingInvoiceDTO.billTo.address &&
    invoice.billTo.city === savePendingInvoiceDTO.billTo.city &&
    invoice.billTo.country === savePendingInvoiceDTO.billTo.country &&
    invoice.billTo.email === savePendingInvoiceDTO.billTo.email &&
    invoice.billTo.name === savePendingInvoiceDTO.billTo.name &&
    invoice.billTo.postcode === savePendingInvoiceDTO.billTo.postcode
  ) {
    isEqualBillToValues = true
  }

  let isEqualBillFromValues = false
  if (
    invoice.billFrom.address === savePendingInvoiceDTO.billFrom.address &&
    invoice.billFrom.city === savePendingInvoiceDTO.billFrom.city &&
    invoice.billFrom.country === savePendingInvoiceDTO.billFrom.country &&
    invoice.billFrom.postcode === savePendingInvoiceDTO.billFrom.postcode
  ) {
    isEqualBillFromValues = true
  }

  const itemsVerification = []
  if (invoice.items.length === savePendingInvoiceDTO.items.length) {
    invoice.items.forEach((item) => {
      savePendingInvoiceDTO.items.forEach((itemToCompare) => {
        if (
          item.name === itemToCompare.name &&
          item.price === itemToCompare.price &&
          item.quantity === itemToCompare.quantity
        ) {
          itemsVerification.push(true)
        }
      })
    })
  }

  const isEqualItems = !!itemsVerification.length

  return (
    isEqualRegularValues &&
    isEqualBillToValues &&
    isEqualBillFromValues &&
    isEqualItems
  )
}
