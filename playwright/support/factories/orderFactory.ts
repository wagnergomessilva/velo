import type { OrderDetails } from '../fixtures'
import { upsertOrder } from '../db/ordersDb'

const colorMap: Record<OrderDetails['color'], string> = {
  'Lunar White': 'lunar-white',
  'Midnight Black': 'midnight-black',
}

const wheelMap: Record<OrderDetails['wheels'], string> = {
  'aero Wheels': 'aero',
  'sport Wheels': 'sport',
}

function resolvePaymentMethod(payment: string) {
  const normalized = payment
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

  if (normalized.includes('financiamento')) {
    return 'financiamento'
  }

  return 'avista'
}

export async function seedOrder(order: OrderDetails) {
  await upsertOrder({
    orderNumber: order.number,
    status: order.status,
    color: colorMap[order.color] ?? 'lunar-white',
    wheelType: wheelMap[order.wheels] ?? 'aero',
    customerName: order.customer.name,
    customerEmail: order.customer.email,
    paymentMethod: resolvePaymentMethod(order.payment),
  })
}
