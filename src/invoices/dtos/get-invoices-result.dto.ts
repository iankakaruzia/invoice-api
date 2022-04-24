import { Status } from '@prisma/client'

export class GetInvoicesResultDTO {
  data: {
    invoices: InvoiceDTO[]
  }
  nextCursor: string | null
}

export class InvoiceDTO {
  id: number
  slug: string
  dueDate: Date | null
  status: Status
  total: number
  billTo: string | null
}
