'use strict';

const http = require('http');
const fs = require('fs');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const config = require('./config/config');
const handleMessage = require('./handlers/messageHandler');
const menu = require('./menus/menuHandler');
const conversationStore = require('./services/conversationStore');
const messageGuard = require('./services/messageGuard');

const runtime = {
  phase: 'STARTING',
  authenticated: false,
  ready: false,
  whatsappState: null,
  lastError: null,
  startedAt: new Date().toISOString(),
  readyAt: 0,
  reconnectAttempts: 0,
};

let shuttingDown = false;
let initializePromise = null;
let reconnectTimer = null;
const userQueues = new Map();

function buildPuppeteerOptions() {
  const options = {
    headless: config.headless,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
    ],
  };
  if (config.executablePath) {
    if (!fs.existsSync(config.executablePath)) {
      throw new Error(`PUPPETEER_EXECUTABLE_PATH no existe: ${config.executablePath}`);
    }
    options.executablePath = config.executablePath;
  }
  return options;
}

const clientOptions = {
  authStrategy: new LocalAuth({
    clientId: config.clientId,
    dataPath: config.authPath,
    rmMaxRetries: 10,
  }),
  authTimeoutMs: 120000,
  qrMaxRetries: 0,
  takeoverOnConflict: true,
  takeoverTimeoutMs: 10000,
  deviceName: 'Agente SF',
  browserName: 'Chrome',
  puppeteer: buildPuppeteerOptions(),
};

if (config.pairingNumber) {
  clientOptions.pairWithPhoneNumber = {
    phoneNumber: config.pairingNumber,
    showNotification: true,
    intervalMs: 180000,
  };
}

const client = new Client(clientOptions);

function updateRuntime(patch) {
  Object.assign(runtime, patch);
}

function formatError(error) {
  if (error instanceof Error) return error.stack || error.message;
  return String(error);
}

async function initializeClient() {
  if (shuttingDown || initializePromise) return initializePromise;
  updateRuntime({ phase: 'INITIALIZING', ready: false, lastError: null });
  console.log(`Iniciando WhatsApp Web. Sesión: ${config.authPath}`);

  initializePromise = client
    .initialize()
    .catch((error) => {
      const detail = formatError(error);
      updateRuntime({ phase: 'INITIALIZATION_ERROR', lastError: detail, ready: false });
      console.error(`Error al inicializar WhatsApp Web:\n${detail}`);
      scheduleReconnect('initialization-error');
    })
    .finally(() => {
      initializePromise = null;
    });

  return initializePromise;
}

function scheduleReconnect(reason) {
  if (shuttingDown || reconnectTimer) return;
  if (runtime.reconnectAttempts >= config.maxReconnectAttempts) {
    updateRuntime({ phase: 'RECONNECT_LIMIT', lastError: `Límite de reconexión alcanzado: ${reason}` });
    console.error('Se alcanzó el límite de reconexiones. Reinicia el proceso después de revisar el diagnóstico.');
    return;
  }

  runtime.reconnectAttempts += 1;
  console.log(`Reconexión ${runtime.reconnectAttempts}/${config.maxReconnectAttempts} programada por: ${reason}`);
  reconnectTimer = setTimeout(async () => {
    reconnectTimer = null;
    try {
      await client.destroy();
    } catch {}
    await initializeClient();
  }, config.reconnectDelayMs);
  reconnectTimer.unref();
}

function enqueueByUser(userId, operation) {
  const previous = userQueues.get(userId) || Promise.resolve();
  const current = previous
    .catch(() => undefined)
    .then(operation)
    .finally(() => {
      if (userQueues.get(userId) === current) userQueues.delete(userId);
    });
  userQueues.set(userId, current);
  return current;
}

client.on('qr', (qr) => {
  updateRuntime({ phase: 'WAITING_QR', authenticated: false, ready: false });
  console.log('\nEscanea el QR desde WhatsApp > Dispositivos vinculados > Vincular dispositivo:');
  qrcode.generate(qr, { small: true });
});

client.on('code', (code) => {
  updateRuntime({ phase: 'WAITING_PAIRING_CODE', authenticated: false, ready: false });
  console.log(`Código de vinculación: ${code}`);
});

client.on('loading_screen', (percent, message) => {
  updateRuntime({ phase: 'LOADING' });
  console.log(`Cargando WhatsApp: ${percent}% ${message || ''}`.trim());
});

client.on('authenticated', () => {
  updateRuntime({ phase: 'AUTHENTICATED', authenticated: true, lastError: null });
  console.log('Sesión autenticada. Esperando sincronización y evento ready...');
});

client.on('auth_failure', (message) => {
  updateRuntime({
    phase: 'AUTH_FAILURE',
    authenticated: false,
    ready: false,
    lastError: String(message),
  });
  console.error(`Fallo de autenticación: ${message}`);
  console.error('La sesión no se elimina automáticamente. Usa "npm run reset-session" solo si confirmas que está corrupta.');
});

client.on('change_state', (state) => {
  updateRuntime({ whatsappState: state, phase: runtime.ready ? 'READY' : `STATE_${state}` });
  console.log(`Estado de WhatsApp: ${state}`);
});

client.on('ready', async () => {
  updateRuntime({
    phase: 'READY',
    authenticated: true,
    ready: true,
    readyAt: Date.now(),
    reconnectAttempts: 0,
    lastError: null,
  });

  const account = client.info?.wid?._serialized || 'desconocida';
  console.log(`Bot conectado y listo. Cuenta vinculada: ${account}`);

  if (config.adminNumber) {
    try {
      await menu.mostrarMenuPrincipal(client, `${config.adminNumber}@c.us`);
    } catch (error) {
      console.error(`No fue posible enviar el menú al ADMIN_NUMBER: ${formatError(error)}`);
    }
  }
});

client.on('message', async (message) => {
  const guard = await messageGuard.inspect(message, runtime.readyAt || Date.now());
  if (!guard.accepted) {
    if (guard.reason === 'limite') {
      console.warn(`Límite de mensajes aplicado a ${message.from}`);
    }
    return;
  }

  await enqueueByUser(message.from, async () => {
    try {
      await handleMessage(client, message);
    } catch (error) {
      const detail = formatError(error);
      console.error(`Error procesando mensaje de ${message.from}:\n${detail}`);
      try {
        await client.sendMessage(
          message.from,
          '⚠️ No fue posible procesar el mensaje. Escribe *menu* para reiniciar la conversación.',
        );
      } catch (sendError) {
        console.error(`También falló el mensaje de error: ${formatError(sendError)}`);
      }
    }
  });
});

client.on('disconnected', (reason) => {
  updateRuntime({
    phase: 'DISCONNECTED',
    authenticated: false,
    ready: false,
    whatsappState: String(reason),
  });
  console.warn(`Cliente desconectado: ${reason}`);
  scheduleReconnect(String(reason));
});

setInterval(() => conversationStore.cleanup(), 30 * 60 * 1000).unref();

const healthServer = http.createServer((request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (request.url === '/ready') {
    response.statusCode = runtime.ready ? 200 : 503;
    response.end(JSON.stringify({ ready: runtime.ready, phase: runtime.phase }));
    return;
  }

  if (request.url === '/health' || request.url === '/') {
    response.statusCode = 200;
    response.end(
      JSON.stringify({
        service: 'agente-sf',
        phase: runtime.phase,
        authenticated: runtime.authenticated,
        ready: runtime.ready,
        whatsappState: runtime.whatsappState,
        startedAt: runtime.startedAt,
        lastError: runtime.lastError,
      }),
    );
    return;
  }

  response.statusCode = 404;
  response.end(JSON.stringify({ error: 'Not found' }));
});

healthServer.listen(config.port, '0.0.0.0', () => {
  console.log(`Diagnóstico HTTP disponible en http://localhost:${config.port}/health`);
});

async function shutdown(signal, exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`Cerrando por ${signal}...`);
  if (reconnectTimer) clearTimeout(reconnectTimer);

  const forceExit = setTimeout(() => process.exit(exitCode), 10000);
  forceExit.unref();

  healthServer.close();
  try {
    await client.destroy();
  } catch (error) {
    console.error(`Error al cerrar el cliente: ${formatError(error)}`);
  }
  process.exit(exitCode);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('uncaughtException', (error) => {
  updateRuntime({ phase: 'UNCAUGHT_EXCEPTION', lastError: formatError(error) });
  console.error(formatError(error));
  shutdown('uncaughtException', 1);
});
process.on('unhandledRejection', (error) => {
  updateRuntime({ phase: 'UNHANDLED_REJECTION', lastError: formatError(error) });
  console.error(formatError(error));
});

initializeClient();
