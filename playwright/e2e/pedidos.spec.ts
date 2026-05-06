import { generateOrderCode } from '../support/helpers'
import { test, expect, OrderDetails } from '../support/fixtures'
import type { Page } from '@playwright/test'

function toMockDbOrder(order: OrderDetails) {
  const colorMap: Record<OrderDetails['color'], string> = {
    'Lunar White': 'lunar-white',
    'Midnight Black': 'midnight-black',
  }

  const wheelMap: Record<OrderDetails['wheels'], string> = {
    'aero Wheels': 'aero',
    'sport Wheels': 'sport',
  }

  return {
    id: `mock-${order.number}`,
    order_number: order.number,
    color: colorMap[order.color],
    wheel_type: wheelMap[order.wheels],
    optionals: [],
    customer_name: order.customer.name,
    customer_email: order.customer.email,
    customer_phone: '11999999999',
    customer_cpf: '11111111111',
    payment_method: order.payment === 'À Vista' ? 'avista' : 'financiamento',
    total_price: 40000,
    status: order.status,
    created_at: '2026-05-05T00:00:00.000Z',
    updated_at: '2026-05-05T00:00:00.000Z',
  }
}

async function mockOrderLookup(page: Page, order: OrderDetails) {
  await page.route('**/rest/v1/orders*', async (route) => {
    const requestUrl = route.request().url()
    const encodedOrder = encodeURIComponent(`eq.${order.number}`)

    if (requestUrl.includes(`order_number=${encodedOrder}`)) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(toMockDbOrder(order)),
      })
      return
    }

    await route.continue()
  })
}

test.describe('Consulta de Pedido', () => {

  test.beforeEach(async ({ app }) => {
    await app.orderLookup.open()
  })

  test('deve consultar um pedido aprovado', async ({ app, page }) => {

    const order: OrderDetails = {
      number: 'VLO-6E2J20',
      status: 'APROVADO',
      color: 'Lunar White',
      wheels: 'aero Wheels',
      customer: {
        name: 'Fernando Papito',
        email: 'papito@velo.dev'
      },
      payment: 'À Vista'
    }

    await mockOrderLookup(page, order)

    // Assert (detalhes + badge encapsulados na action)
    await app.orderLookup.assertOrderIsDisplayed(order)

  })

  test('deve consultar um pedido reprovado', async ({ app, page }) => {

    const order: OrderDetails = {
      number: 'VLO-0LNFEA',
      status: 'REPROVADO',
      color: 'Midnight Black',
      wheels: 'sport Wheels',
      customer: {
        name: 'Steve Jobs',
        email: 'jobs@apple.com'
      },
      payment: 'À Vista'
    }

    await mockOrderLookup(page, order)

    // Assert (detalhes + badge encapsulados na action)
    await app.orderLookup.assertOrderIsDisplayed(order)
  })

  test('deve consultar um pedido em analise', async ({ app, page }) => {

    // Test Data
    const order: OrderDetails = {
      number: 'VLO-412O06',
      status: 'EM_ANALISE',
      color: 'Lunar White',
      wheels: 'aero Wheels',
      customer: {
        name: 'Joao Silva',
        email: 'joao@velo.dev'
      },
      payment: 'À Vista'
    }

    await mockOrderLookup(page, order)

    // Assert (detalhes + badge encapsulados na action)
    await app.orderLookup.assertOrderIsDisplayed(order)
  })

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ app }) => {

    const order = generateOrderCode()

    await app.orderLookup.searchOrder(order)
    await app.orderLookup.validateOrderNotFound()

  })

  test('deve manter o botão de busca desabilitado com o campo vazio ou apenas espaços', async ({ app }) => {
    const button = app.orderLookup.elements.searchButton
    await expect(button).toBeDisabled()

    await app.orderLookup.elements.orderInput.fill('   ')
    await expect(button).toBeDisabled()
  })

})