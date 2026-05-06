import { Page, expect } from '@playwright/test'

export type CorVeiculo = 'Glacier Blue' | 'Midnight Black' | 'Lunar White'
export type TipoRoda = 'Aero Wheels' | 'Sport Wheels'
export type Opcional = 'Precision Park' | 'Flux Capacitor'

type ConfiguracaoEsperada = {
  price: string
  alt?: RegExp
  srcFragment?: string
}

export function createConfiguradorActions(page: Page) {
  const elements = {
    precoVenda: page.getByTestId('total-price'),
    imagemPreview: page.locator('img[alt*="Sprint"]'),
    carroImagem: page.locator('img[alt*="Sprint"]'),
    checkoutButton: page.getByRole('button', { name: 'Monte o Seu' }),
    resumoTotal: page.getByText('Total').locator('xpath=following-sibling::*[1]'),
    cores: {
      'Glacier Blue': page.getByRole('button', { name: 'Glacier Blue' }),
      'Midnight Black': page.getByRole('button', { name: 'Midnight Black' }),
      'Lunar White': page.getByRole('button', { name: 'Lunar White' }),
    } as const,
    rodas: {
      'Aero Wheels': page.getByRole('button', { name: /Aero Wheels/i }),
      'Sport Wheels': page.getByRole('button', { name: /Sport Wheels/i }),
    } as const,
    opcionais: {
      'Precision Park': page.getByRole('checkbox', { name: /Precision Park/i }),
      'Flux Capacitor': page.getByRole('checkbox', { name: /Flux Capacitor/i }),
    } as const,
  }

  async function validatePrice(value: string) {
    await expect(elements.precoVenda).toHaveText(value)
  }

  async function validatePreviewAlt(pattern: RegExp) {
    await expect(elements.imagemPreview).toHaveAttribute('alt', pattern)
  }

  async function validatePreviewSrcContains(fragment: string) {
    await expect(elements.carroImagem).toHaveAttribute('src', new RegExp(fragment))
  }

  async function assertConfiguration(config: ConfiguracaoEsperada) {
    await validatePrice(config.price)

    if (config.alt) {
      await validatePreviewAlt(config.alt)
    }

    if (config.srcFragment) {
      await validatePreviewSrcContains(config.srcFragment)
    }
  }

  return {
    elements,

    async open() {
      await page.goto('/configure')
      await expect(page).toHaveURL(/\/configure$/)
      await expect(elements.precoVenda).toBeVisible()
      await expect(elements.precoVenda).toHaveText('R$ 40.000,00')
    },

    async selectColor(color: CorVeiculo) {
      await elements.cores[color].click()
    },

    async selectWheels(wheels: TipoRoda) {
      await elements.rodas[wheels].click()
    },

    async checkOptional(opcional: Opcional) {
      await elements.opcionais[opcional].check()
    },

    async uncheckOptional(opcional: Opcional) {
      await elements.opcionais[opcional].uncheck()
    },

    async goToCheckout() {
      await expect(elements.checkoutButton).toBeEnabled()
      await elements.checkoutButton.click()
      await expect(page).toHaveURL(/\/order$/)
    },

    async validateCheckoutSummaryTotal(value: string) {
      await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Resumo' })).toBeVisible()
      await expect(elements.resumoTotal).toContainText(value)
    },

    validatePrice,
    validatePreviewAlt,
    validatePreviewSrcContains,
    assertConfiguration,
  }
}
