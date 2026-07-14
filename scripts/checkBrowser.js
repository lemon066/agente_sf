'use strict';

const fs = require('fs');
const puppeteer = require('puppeteer');
const config = require('../src/config/config');

async function main() {
  const options = {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  };
  if (config.executablePath) {
    if (!fs.existsSync(config.executablePath)) throw new Error('PUPPETEER_EXECUTABLE_PATH no existe.');
    options.executablePath = config.executablePath;
  }

  const browser = await puppeteer.launch(options);
  try {
    const page = await browser.newPage();
    await page.setContent('<title>Agente SF</title><h1>OK</h1>');
    const title = await page.title();
    if (title !== 'Agente SF') throw new Error('Chrome se abrió, pero la prueba de página falló.');
    console.log(`Puppeteer y Chrome funcionan. Ejecutable: ${browser.process()?.spawnfile || 'externo'}`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
