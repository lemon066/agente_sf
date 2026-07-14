'use strict';

const fs = require('fs');
const config = require('../src/config/config');

if (!fs.existsSync(config.authPath)) {
  console.log(`No existe una sesión en: ${config.authPath}`);
  process.exit(0);
}

fs.rmSync(config.authPath, { recursive: true, force: true, maxRetries: 10, retryDelay: 250 });
fs.mkdirSync(config.authPath, { recursive: true });
console.log(`Sesión eliminada: ${config.authPath}`);
console.log('Ejecuta npm start para generar un nuevo QR o código de vinculación.');
