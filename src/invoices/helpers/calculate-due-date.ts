import { addDays } from 'date-fns'
import { Invoice } from '@prisma/client'

export function calculateDueDate({ date, paymentTerm }: Invoice) {
  if (!date || !paymentTerm) {
    return null
  }

  return addDays(date, paymentTerm)
}
