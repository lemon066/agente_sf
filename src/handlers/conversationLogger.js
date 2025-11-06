const fs = require('fs');
const path = require('path');

const logsDir = path.resolve('tokens', 'wms-support');

// Crear carpeta de logs si no existe
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Guarda conversaciones por usuario y fecha.
 */
module.exports = function logConversation(userId, message, type = 'entrada') {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const logFilePath = path.join(logsDir, `${today}.json`);

    let logs = {};
    if (fs.existsSync(logFilePath)) {
      const data = fs.readFileSync(logFilePath, 'utf8');
      if (data.trim()) logs = JSON.parse(data);
    }

    if (!logs[userId]) logs[userId] = [];

    logs[userId].push({
      timestamp: new Date().toISOString(),
      type,
      message,
    });

    fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2), 'utf8');
  } catch (err) {
    console.error('❌ Error guardando conversación:', err);
  }
};
