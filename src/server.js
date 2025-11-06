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

client.on('qr', (qr) => {
  console.log('📱 Escanea este código QR para iniciar sesión:');
  qrcode.generate(qr, { small: true });
   console.log('🔗 QR_STRING:', qr); // ← ESTA LÍNEA NUEVA
});

client.on('ready', async () => {
  console.log('✅ Bot conectado y listo para recibir mensajes.');

  // ✅ Si quieres enviar un “menú de bienvenida” proactivo, hazlo *después* de ready
  // y pasando client + destinatario válido:
  const usuario = 'usuario_demo';
  const to = process.env.ADMIN_NUMBER || ''; // p.ej. "502XXXXXXXX"
  if (to) {
    const jid = to.includes('@') ? to : `${to}@c.us`;
    try {
      // Asegúrate de que mostrarMenuPrincipal acepte (client, jid, usuario)
      await menuHandler.mostrarMenuPrincipal(client, jid, usuario);
    } catch (err) {
      console.error('❌ Error enviando menú de bienvenida:', err);
    }
  }
});

client.on('message', async (message) => {
  // Aquí sí le pasas el client correctamente
  await handleMessage(client, message);
});

client.initialize();
