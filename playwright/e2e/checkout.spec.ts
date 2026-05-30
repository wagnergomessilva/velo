import { test, expect } from '../support/fixtures'

test.describe('Checkout', () => {
  test.describe('Validações de campos obrigatórios', () => {

    test.beforeEach(async ({ app }) => {
      await app.checkout.open()
    })

    test('CT04.1 - deve exibir erro ao deixar todos os campos em branco e confirmar', async ({ app }) => {
      await app.checkout.submitOrder()

      await expect(app.checkout.elements.nomeAlert).toHaveText('Nome deve ter pelo menos 2 caracteres')
      await expect(app.checkout.elements.sobrenomeAlert).toHaveText('Sobrenome deve ter pelo menos 2 caracteres')
      await expect(app.checkout.elements.emailAlert).toHaveText('Email inválido')
      await expect(app.checkout.elements.telefoneAlert).toHaveText('Telefone inválido')
      await expect(app.checkout.elements.cpfAlert).toHaveText('CPF inválido')
      await expect(app.checkout.elements.lojaAlert).toHaveText('Selecione uma loja')
      await expect(app.checkout.elements.termosAlert).toHaveText('Aceite os termos')
    })

  })

  test.beforeEach(async ({ app }) => {
    await app.checkout.open()
  })

  test('CT04.2 - deve exibir erro ao inserir apenas 1 letra no Nome e Sobrenome', async ({ app }) => {
    await app.checkout.fillNome('A')
    await app.checkout.fillSobrenome('B')

    await app.checkout.submitOrder()

    await expect(app.checkout.elements.nomeAlert).toHaveText('Nome deve ter pelo menos 2 caracteres')
    await expect(app.checkout.elements.sobrenomeAlert).toHaveText('Sobrenome deve ter pelo menos 2 caracteres')
  })

  test('CT04.3 - deve exibir erro ao inserir um e-mail sem formato válido', async ({ app }) => {
    await app.checkout.fillEmail('cliente@.com')

    await app.checkout.submitOrder()

    await expect(app.checkout.elements.emailAlert).toHaveText('Email inválido')
  })

  test('CT04.4 - deve exibir erro ao inserir CPF incompleto', async ({ app }) => {
    await app.checkout.fillCpf('123456')

    await app.checkout.submitOrder()

    await expect(app.checkout.elements.cpfAlert).toHaveText('CPF inválido')
  })

  test('CT04.5 - deve exibir erro ao preencher tudo corretamente mas não aceitar os termos', async ({ app }) => {
    await app.checkout.fillNome('João')
    await app.checkout.fillSobrenome('Silva')
    await app.checkout.fillEmail('joao@teste.com')
    await app.checkout.fillTelefone('11999999999')
    await app.checkout.fillCpf('12345678909')

    await app.checkout.selectLoja('Velô Paulista - Av. Paulista, 1000')

    await app.checkout.submitOrder()

    await expect(app.checkout.elements.termosAlert).toHaveText('Aceite os termos')

    // Valida que os outros erros de campo não estão sendo exibidos
    await expect(app.checkout.elements.nomeAlert).not.toBeVisible()
    await expect(app.checkout.elements.emailAlert).not.toBeVisible()
    await expect(app.checkout.elements.cpfAlert).not.toBeVisible()
    await expect(app.checkout.elements.telefoneAlert).not.toBeVisible()
  })
})
