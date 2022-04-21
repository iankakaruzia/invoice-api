import { Item } from '@prisma/client'

export function calculateTotalItems(items: Item[]) {
  const parsedItems = items.map((item) => {
    return {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      total: item.price * item.quantity
    }
  })

  const itemsTotal = parsedItems.reduce((acc, item) => acc + item.total, 0)

  return {
    items: parsedItems,
    itemsTotal
  }
}
