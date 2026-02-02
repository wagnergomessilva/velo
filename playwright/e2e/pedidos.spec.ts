import { test, expect } from '@playwright/test'
import { generateOrderCode } from '../support/helpers'

///AAA - Arrange, Act, Assert

test('deve consultar um pedido aprovado', async ({ page }) => {

    //Massa de teste
    const order = 'VLO-4PXWIM'

    // Arrange
    await page.goto('http://localhost:5173/')
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')
    await page.getByRole('link', { name: 'Consultar Pedido' }).click();
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido')

    // Act
    //await page.getByTestId('search-order-id').fill('VLO-4PXWIM')
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order)
    await page.getByRole('button', { name: 'Buscar Pedido' }).click()

    // Assert
    const containerPedido = page.getByRole('paragraph')
        .filter({ hasText: /^Pedido$/ })
        .locator('..') //Pega o elemento pai do texto "Pedido"

    await expect(containerPedido).toContainText(order, { timeout: 10_000 })
    await expect(page.getByTestId('order-result-VLO-4PXWIM')).toContainText(order)

    await expect(page.getByText('APROVADO')).toBeVisible()
    await expect(page.getByTestId('order-result-VLO-4PXWIM')).toContainText('APROVADO')
})

test('deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {

    //Massa de teste
    const order = generateOrderCode()

    // Arrange
    await page.goto('http://localhost:5173/')
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')

    await page.getByRole('link', { name: 'Consultar Pedido' }).click();
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido')

    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order)
    await page.getByRole('button', { name: 'Buscar Pedido' }).click()

    await expect(page.locator('#root')).toMatchAriaSnapshot(`
        - img
        - heading "Pedido não encontrado" [level=3]
        - paragraph: Verifique o número do pedido e tente novamente
        `)
})