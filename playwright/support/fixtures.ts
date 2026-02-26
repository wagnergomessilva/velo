import { test as base } from '@playwright/test'
import { createOrderLookupActions, type OrderDetails, type OrderStatus } from './actions/orderLookupActions'

type App = {
  orderLookup: ReturnType<typeof createOrderLookupActions>
}

export const test = base.extend<{ app: App }>({
  app: async ({ page }, use) => {
    const app: App = {
      orderLookup: createOrderLookupActions(page),
    }
    await use(app)
  },
})

export type { OrderDetails, OrderStatus }
export { expect } from '@playwright/test'

