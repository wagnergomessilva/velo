import { Page, expect } from '@playwright/test'

export function createCheckoutActions(page: Page) {
  const elements = {
    nomeInput: page.getByLabel('Nome', { exact: true }),
    sobrenomeInput: page.getByLabel('Sobrenome', { exact: true }),
    emailInput: page.getByLabel('Email', { exact: true }),
    telefoneInput: page.getByLabel('Telefone', { exact: true }),
    cpfInput: page.getByLabel('CPF', { exact: true }),
    lojaSelect: page.getByRole('combobox', { name: 'Loja para Retirada' }),
    lojaOption: (name: string) => page.getByRole('option', { name }),
    termosCheckbox: page.getByLabel(/Li e aceito os Termos/i),
    confirmarButton: page.getByRole('button', { name: 'Confirmar Pedido' }),

    // Alertas de validação
    nomeAlert: page.locator('//label[text() = "Nome"]/..//p'),
    sobrenomeAlert: page.locator('//label[text() = "Sobrenome"]/..//p'),
    emailAlert: page.locator('//label[text() = "Email"]/..//p'),
    telefoneAlert: page.locator('//label[text() = "Telefone"]/..//p'),
    cpfAlert: page.locator('//label[text() = "CPF"]/..//p'),
    lojaAlert: page.locator('//label[text() = "Loja para Retirada"]/..//p'),
    termosAlert: page.locator('//label[contains(., "Li e aceito")]/..//p')
  }

  return {
    elements,

    async open() {
      await page.goto('/order')
      await expect(page).toHaveURL(/\/order$/)
    },

    async fillNome(nome: string) {
      await elements.nomeInput.fill(nome)
    },

    async fillSobrenome(sobrenome: string) {
      await elements.sobrenomeInput.fill(sobrenome)
    },

    async fillEmail(email: string) {
      await elements.emailInput.fill(email)
    },

    async fillTelefone(telefone: string) {
      await elements.telefoneInput.fill(telefone)
    },

    async fillCpf(cpf: string) {
      await elements.cpfInput.fill(cpf)
    },

    async selectLoja(loja: string) {
      await elements.lojaSelect.click()
      await elements.lojaOption(loja).click()
    },

    async submitOrder() {
      await elements.confirmarButton.click()
    }
  }
}
