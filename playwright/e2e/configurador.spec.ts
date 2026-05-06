import { test } from '../support/fixtures'

test.describe('Configuração do veículo', () => {
  test('deve trocar a cor do veículo sem alterar o preço base', async ({ app }) => {
    await app.configurador.open()
    await app.configurador.selectColor('Lunar White')

    await app.configurador.assertConfiguration({
      price: 'R$ 40.000,00',
      alt: /lunar-white/i,
      srcFragment: 'lunar-white-aero-wheels\\.png$',
    })
  })

  test('deve atualizar o preço ao alternar rodas entre Sport e Aero', async ({ app }) => {
    await app.configurador.open()
    await app.configurador.selectWheels('Sport Wheels')

    await app.configurador.assertConfiguration({
      price: 'R$ 42.000,00',
      alt: /with sport wheels/i,
      srcFragment: 'glacier-blue-sport-wheels\\.png$',
    })

    await app.configurador.selectWheels('Aero Wheels')
    await app.configurador.assertConfiguration({
      price: 'R$ 40.000,00',
      alt: /with aero wheels/i,
      srcFragment: 'glacier-blue-aero-wheels\\.png$',
    })
  })

  test('deve atualizar preco com Precision Park e Flux Capacitor e redirecionar para checkout', async ({ app }) => {
    await app.configurador.open()

    await app.configurador.checkOptional('Precision Park')
    await app.configurador.validatePrice('R$ 45.500,00')

    await app.configurador.checkOptional('Flux Capacitor')
    await app.configurador.validatePrice('R$ 50.500,00')

    await app.configurador.uncheckOptional('Precision Park')
    await app.configurador.uncheckOptional('Flux Capacitor')
    await app.configurador.validatePrice('R$ 40.000,00')

    await app.configurador.goToCheckout()
    await app.configurador.validateCheckoutSummaryTotal('R$ 40.000,00')
  })
})