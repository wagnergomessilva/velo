import { test, expect } from '../support/fixtures'
import { deleteOrderByEmail } from '../support/database/orderRepository'

const data_ct05 = {
  nome: 'Maria',
  sobrenome: 'Oliveira',
  email: 'maria.oliveira@teste.com',
  telefone: '11988887777',
  cpf: '12345678909',
  loja: 'Velô Paulista - Av. Paulista, 1000',
  paymentMethod: 'À Vista',
  totalPrice: 'R$ 40.000,00'
}

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

test.describe('Fluxo E2E - Checkout Completo', () => {
  test('CT05 - deve realizar pedido com pagamento à vista com sucesso', async ({ app, page }) => {
    await deleteOrderByEmail(data_ct05.email)

    // Arrange: Navegação E2E
    await page.goto('/')
    await page.getByTestId('hero-cta-primary').click()

    // Configurador
    await expect(page).toHaveURL(/\/configure/)
    await expect(app.configurador.elements.precoVenda).toHaveText('R$ 40.000,00')
    await app.configurador.goToCheckout()

    // Checkout
    await expect(page).toHaveURL(/\/order/)
    await app.checkout.fillNome(data_ct05.nome)
    await app.checkout.fillSobrenome(data_ct05.sobrenome)
    await app.checkout.fillEmail(data_ct05.email)
    await app.checkout.fillTelefone(data_ct05.telefone)
    await app.checkout.fillCpf(data_ct05.cpf)

    await app.checkout.selectLoja(data_ct05.loja)

    // Assert: Validar preço total e método de pagamento padrão
    await expect(page.getByTestId('summary-total-price')).toHaveText(data_ct05.totalPrice)

    // Act: Selecionar método de pagamento à vista
    await app.checkout.selectPaymentAvista()

    await app.checkout.checkTermos()
    await app.checkout.submitOrder()

    // Assert
    await expect(page).toHaveURL(/\/success/)
    await expect(page.getByTestId('success-status')).toHaveText('Pedido Aprovado!')
    await expect(page.getByTestId('order-id')).toBeVisible()

    // Validar informações do cliente e resumo na página de sucesso
    await expect(page.getByText(`${data_ct05.nome} ${data_ct05.sobrenome}`)).toBeVisible()
    await expect(page.getByText(data_ct05.email)).toBeVisible()
    await expect(page.getByText(data_ct05.loja)).toBeVisible()
  })
})
