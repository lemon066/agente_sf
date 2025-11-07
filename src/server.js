const fs = require('fs');
const path = require('path');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const handleMessage = require('./handlers/messageHandler');
const menuHandler = require('./menus/menuHandler');

// 🔹 (opcional) SOLO si realmente quieres forzar nueva sesión cada arranque
const authPath = path.join(__dirname, '../.wwebjs_auth');
if (fs.existsSync(authPath)) {
  console.log('🧹 Eliminando sesión anterior...');
  fs.rmSync(authPath, { recursive: true, force: true });
}

const client = new Client({
  authStrategy: new LocalAuth(), // usa el mismo path .wwebjs_auth por defecto
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
});

/* ─────────────────────────────────────────────────────────────────────────────
   >>> BLOQUE DE CONTROL DE INACTIVIDAD (10 min)
   ───────────────────────────────────────────────────────────────────────────── */
const INACTIVITY_MS = 10 * 60 * 1000; // 10 minutos
const STATE_FILE = path.join('/data', 'conversation_state.json');

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function saveState(db) {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (e) {
    console.error('Error guardando estado:', e.message);
  }
}

const stateDB = loadState();
const now = () => Date.now();

// 🔹 Mantiene consistencia con el menú raíz definido en messageHandler
const ROOT_STATE = 'menuPrincipal';

function getUserState(jid) {
  if (!stateDB[jid]) stateDB[jid] = { lastInteractionAt: 0, state: ROOT_STATE };
  return stateDB[jid];
}
function touch(jid) {
  const u = getUserState(jid);
  u.lastInteractionAt = now();
  saveState(stateDB);
}
function isExpired(jid) {
  const u = getUserState(jid);
  return (now() - (u.lastInteractionAt || 0)) > INACTIVITY_MS;
}
function resetToMenu(jid) {
  const u = getUserState(jid);
  u.state = ROOT_STATE;
  u.lastInteractionAt = now();
  saveState(stateDB);
}

// 🔹 Limpieza ligera de estados viejos
setInterval(() => {
  const cutoff = now() - 24 * 60 * 60 * 1000;
  let changed = false;
  for (const [jid, u] of Object.entries(stateDB)) {
    if ((u.lastInteractionAt || 0) < cutoff) {
      delete stateDB[jid];
      changed = true;
    }
  }
  if (changed) saveState(stateDB);
}, 30 * 60 * 1000);

/* ──────────────────────────── FIN BLOQUE ─────────────────────────── */

client.on('qr', (qr) => {
  console.log('📱 Escanea este código QR para iniciar sesión:');
  qrcode.generate(qr, { small: true });
  console.log('🔗 QR_STRING:', qr);
});

client.on('ready', async () => {
  console.log('✅ Bot conectado y listo para recibir mensajes.');

  // ✅ Envío opcional de menú inicial
  const usuario = 'usuario_demo';
  const to = process.env.ADMIN_NUMBER || ''; // ej: "502XXXXXXXX"
  if (to) {
    const jid = to.includes('@') ? to : `${to}@c.us`;
    try {
      await menuHandler.mostrarMenuPrincipal(client, jid, usuario);
    } catch (err) {
      console.error('❌ Error enviando menú de bienvenida:', err);
    }
  }
});

client.on('message', async (message) => {
  const jid = message.from;
  const usuario = message._data?.notifyName || message._data?.pushname || 'usuario';

  // 🔹 Control de inactividad
  if (isExpired(jid)) {
    resetToMenu(jid);
    try {
      await client.sendMessage(jid, '⌛ Se ha reiniciado tu sesión por inactividad.');
      await menuHandler.mostrarMenuPrincipal(client, jid, usuario);
    } catch (e) {
      console.error('Error al enviar menú por reinicio de inactividad:', e.message);
    }
    return;
  }

  touch(jid);

  // 🔹 Delegar procesamiento al messageHandler central
  try {
    await handleMessage(client, message);
  } catch (err) {
    console.error('❌ Error procesando mensaje:', err);
    await client.sendMessage(jid, '⚠️ Ocurrió un error al procesar tu solicitud. Escribe *menu* para reiniciar.');
  }
});

client.initialize();
