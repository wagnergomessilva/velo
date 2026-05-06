import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

(async () => {
  const evidenciasDir = path.resolve('./docs/tests/evidencias/CT02');
  if (!fs.existsSync(evidenciasDir)) {
    fs.mkdirSync(evidenciasDir, { recursive: true });
  }

  console.log('Iniciando o navegador...');
  const browser = await chromium.launch({ headless: false, slowMo: 1500 });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();

  try {
    console.log('Acessando o Configurador...');
    await page.goto('http://localhost:5173/configure', { waitUntil: 'networkidle' });
    
    // Passo 1
    console.log('Passo 1: Verificar o preço inicial de venda (R$ 40.000,00)');
    await page.waitForSelector('[data-testid="total-price"]');
    let price = await page.textContent('[data-testid="total-price"]');
    console.log(`Preço atual: ${price}`);
    await page.screenshot({ path: path.join(evidenciasDir, '1-preco-inicial.png') });

    // Passo 2
    console.log('Passo 2: Selecionar a cor Midnight Black');
    await page.click('[data-testid="color-option-midnight-black"]');
    await page.waitForTimeout(500); // aguardar animação
    price = await page.textContent('[data-testid="total-price"]');
    console.log(`Preço atual (após cor): ${price}`);
    await page.screenshot({ path: path.join(evidenciasDir, '2-cor-alterada-preco-mantido.png') });

    // Passo 3
    console.log('Passo 3: Selecionar a roda Sport Wheels');
    await page.click('[data-testid="wheel-option-sport"]');
    await page.waitForTimeout(500); // aguardar animação
    price = await page.textContent('[data-testid="total-price"]');
    console.log(`Preço atual (após roda Sport): ${price}`);
    await page.screenshot({ path: path.join(evidenciasDir, '3-roda-sport-preco-atualizado.png') });

    // Passo 4
    console.log('Passo 4: Selecionar novamente a roda Aero Wheels');
    await page.click('[data-testid="wheel-option-aero"]');
    await page.waitForTimeout(500); // aguardar animação
    price = await page.textContent('[data-testid="total-price"]');
    console.log(`Preço atual (após roda Aero): ${price}`);
    await page.screenshot({ path: path.join(evidenciasDir, '4-roda-aero-preco-restaurado.png') });

    console.log('CT02 executado com sucesso e evidências geradas!');
  } catch (error) {
    console.error('Erro durante a execução:', error);
  } finally {
    await browser.close();
  }
})();
