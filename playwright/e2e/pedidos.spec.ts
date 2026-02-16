import { test } from '@playwright/test'

import { generateOrderCode } from '../support/helpers'

import { LandingPage } from '../support/pages/LandingPage'
import { Navbar } from '../support/components/NavBar'
import { OrderLockupPage, OrderDetails } from '../support/pages/OrderLookupPage'

test.describe('Consulta de Pedido', () => {

  let orderLockupPage: OrderLockupPage

  test.beforeEach(async ({ page }) => {
    await new LandingPage(page).goto()
    await new Navbar(page).orderLockupLink()

    orderLockupPage = new OrderLockupPage(page)
    await orderLockupPage.validatePageLoaded()
  })

  test('deve consultar um pedido aprovado', async ({ page }) => {

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
    
    // Assert (detalhes + badge encapsulados no Page Object)
    await orderLockupPage.assertOrderIsDisplayed(order)

  })

  test('deve consultar um pedido reprovado', async ({ page }) => {


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
    
    // Assert (detalhes + badge encapsulados no Page Object)
    await orderLockupPage.assertOrderIsDisplayed(order)
  })

  test('deve consultar um pedido em analise', async ({ page }) => {

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
    
    // Assert (detalhes + badge encapsulados no Page Object)
    await orderLockupPage.assertOrderIsDisplayed(order)
  })

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {

    const order = generateOrderCode()

    await orderLockupPage.searchOrder(order)


    await orderLockupPage.validateOrderNotFound()

  })
})