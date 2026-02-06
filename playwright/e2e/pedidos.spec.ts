import { test, expect } from '@playwright/test'
import { generateOrderCode } from '../support/helpers'

///AAA - Arrange, Act, Assert

test.describe('Consulta de pedido', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/')
        await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')

        await page.getByRole('link', { name: 'Consultar Pedido' }).click();
        await expect(page.getByRole('heading')).toContainText('Consultar Pedido')
    })

    // test.beforeAll(async () => {
    //     console.log(
    //         'beforeAll: roda uma vez antes de todos os testes.'
    //     )
    // })

    // test.afterEach(async () => {
    //     console.log(
    //         'afterEach: roda depois de cada teste.'
    //     )
    // })

    // test.afterAll(async () => {
    //     console.log(
    //         'afterAll: roda uma vez depois de todos os testes.'
    //     )
    // })

    test('deve consultar um pedido aprovado', async ({ page }) => {

        //Massa de teste

        //const order = 'VLO-4PXWIM'
        const order = {
            number: 'VLO-4PXWIM',
            status: 'APROVADO',
            color: 'Midnight Black',
            wheels: 'sport Wheels',
            customer: {
                name: 'Wagner Gomes',
                email: 'wag.gomes2015@gmail.com',
            },
            payment: 'À Vista',
        }

        await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.number)
        await page.getByRole('button', { name: 'Buscar Pedido' }).click()

        // Assert

        // const containerPedido = page.getByRole('paragraph')
        //     .filter({ hasText: /^Pedido$/ })
        //     .locator('..') //Pega o elemento pai do texto "Pedido"

        // await expect(containerPedido).toContainText(order, { timeout: 10_000 })
        // await expect(page.getByTestId('order-result-VLO-4PXWIM')).toContainText(order)

        // await expect(page.getByText('APROVADO')).toBeVisible()
        // await expect(page.getByTestId('order-result-VLO-4PXWIM')).toContainText('APROVADO')

        await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
            - img
            - paragraph: Pedido
            - paragraph: ${order.number}
            - img
            - text: ${order.status}
            - img "Velô Sprint"
            - paragraph: Modelo
            - paragraph: Velô Sprint
            - paragraph: Cor
            - paragraph: ${order.color}
            - paragraph: Interior
            - paragraph: cream
            - paragraph: Rodas
            - paragraph: ${order.wheels}
            - heading "Dados do Cliente" [level=4]
            - paragraph: Nome
            - paragraph: ${order.customer.name}
            - paragraph: Email
            - paragraph: ${order.customer.email}
            - paragraph: Loja de Retirada
            - paragraph
            - paragraph: Data do Pedido
            - paragraph: /\\d+\\/\\d+\\/\\d+/
            - heading "Pagamento" [level=4]
            - paragraph: ${order.payment}
            - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
            `);
    })

    test('deve consultar um pedido reprovado', async ({ page }) => {

        //Massa de teste
        //const order = 'VLO-H18ESA'
        const order = {
            number: 'VLO-H18ESA',
            status: 'REPROVADO',
            color: 'Midnight Black',
            wheels: 'sport Wheels',
            customer: {
                name: 'Steve Jobs',
                email: 'jobs@apple.com',
            },
            payment: 'À Vista',
        }

        await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.number)
        await page.getByRole('button', { name: 'Buscar Pedido' }).click()

        await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
            - img
            - paragraph: Pedido
            - paragraph: ${order.number}
            - img
            - text: ${order.status}
            - img "Velô Sprint"
            - paragraph: Modelo
            - paragraph: Velô Sprint
            - paragraph: Cor
            - paragraph: ${order.color}
            - paragraph: Interior
            - paragraph: cream
            - paragraph: Rodas
            - paragraph: ${order.wheels}
            - heading "Dados do Cliente" [level=4]
            - paragraph: Nome
            - paragraph: ${order.customer.name}
            - paragraph: Email
            - paragraph: ${order.customer.email}
            - paragraph: Loja de Retirada
            - paragraph
            - paragraph: Data do Pedido
            - paragraph: /\\d+\\/\\d+\\/\\d+/
            - heading "Pagamento" [level=4]
            - paragraph: ${order.payment}
            - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
            `);
    })

    test('deve consultar um pedido em análise', async ({ page }) => {

        //Massa de teste
        //const order = 'VLO-H18ESA'
        const order = {
            number: 'VLO-6SDLHZ',
            status: 'EM_ANALISE',
            color: 'Lunar White',
            wheels: 'aero Wheels',
            customer: {
                name: 'Joao Silva',
                email: 'joao@velo.dev',
            },
            payment: 'À Vista',
        }

        await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.number)
        await page.getByRole('button', { name: 'Buscar Pedido' }).click()

        await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
            - img
            - paragraph: Pedido
            - paragraph: ${order.number}
            - img
            - text: ${order.status}
            - img "Velô Sprint"
            - paragraph: Modelo
            - paragraph: Velô Sprint
            - paragraph: Cor
            - paragraph: ${order.color}
            - paragraph: Interior
            - paragraph: cream
            - paragraph: Rodas
            - paragraph: ${order.wheels}
            - heading "Dados do Cliente" [level=4]
            - paragraph: Nome
            - paragraph: ${order.customer.name}
            - paragraph: Email
            - paragraph: ${order.customer.email}
            - paragraph: Loja de Retirada
            - paragraph
            - paragraph: Data do Pedido
            - paragraph: /\\d+\\/\\d+\\/\\d+/
            - heading "Pagamento" [level=4]
            - paragraph: ${order.payment}
            - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
            `);
    })

    test('deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {

        //Massa de teste
        const order = generateOrderCode()

        await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order)
        await page.getByRole('button', { name: 'Buscar Pedido' }).click()

        await expect(page.locator('#root')).toMatchAriaSnapshot(`
            - img
            - heading "Pedido não encontrado" [level=3]
            - paragraph: Verifique o número do pedido e tente novamente
            `)
    })
})