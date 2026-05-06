import { test as base } from '@playwright/test'
import { createConfiguradorActions, type CorVeiculo, type TipoRoda } from './actions/configuradorActions'
import { createOrderLookupActions, type OrderDetails, type OrderStatus } from './actions/orderLookupActions'

type App = {
  configurador: ReturnType<typeof createConfiguradorActions>
  orderLookup: ReturnType<typeof createOrderLookupActions>
}

export const test = base.extend<{ app: App }>({
  app: async ({ page }, use) => {
    const app: App = {
      configurador: createConfiguradorActions(page),
      orderLookup: createOrderLookupActions(page),
    }
    await use(app)
  },
})

export type { CorVeiculo, TipoRoda, OrderDetails, OrderStatus }
export { expect } from '@playwright/test'

