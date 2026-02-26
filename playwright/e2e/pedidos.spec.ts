import { generateOrderCode } from '../support/helpers'
import { test, OrderDetails } from '../support/fixtures'

test.describe('Consulta de Pedido', () => {

  test.beforeEach(async ({ app }) => {
    await app.orderLookup.open()
  })

  test('deve consultar um pedido aprovado', async ({ app }) => {

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
    
    // Assert (detalhes + badge encapsulados na action)
    await app.orderLookup.assertOrderIsDisplayed(order)

  })

  test('deve consultar um pedido reprovado', async ({ app }) => {


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
    
    // Assert (detalhes + badge encapsulados na action)
    await app.orderLookup.assertOrderIsDisplayed(order)
  })

  test('deve consultar um pedido em analise', async ({ app }) => {

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
    
    // Assert (detalhes + badge encapsulados na action)
    await app.orderLookup.assertOrderIsDisplayed(order)
  })

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ app }) => {

    const order = generateOrderCode()

    await app.orderLookup.searchOrder(order)
    await app.orderLookup.validateOrderNotFound()

  })
})