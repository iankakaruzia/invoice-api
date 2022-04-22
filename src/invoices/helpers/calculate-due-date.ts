import { addDays } from 'date-fns'

export function calculateDueDate(
  date: Date | null,
  paymentTerm: number | null
) {
  if (!date || !paymentTerm) {
    return null
  }

  return addDays(date, paymentTerm)
}
