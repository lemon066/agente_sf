'use strict';

const fs = require('fs');
const path = require('path');
const config = require('../config/config');

module.exports = function logConversation(userId, direction, message, type = 'general') {
  if (!config.logConversations) return;

  try {
    fs.mkdirSync(config.logsDir, { recursive: true });
    const date = new Date().toISOString().slice(0, 10);
    const logPath = path.join(config.logsDir, `${date}.jsonl`);
    const record = {
      timestamp: new Date().toISOString(),
      userId,
      direction,
      type,
      message: String(message || '').slice(0, 2000),
    };
    fs.appendFileSync(logPath, `${JSON.stringify(record)}\n`, 'utf8');
  } catch (error) {
    console.error(`No fue posible guardar el registro de conversación: ${error.message}`);
  }
};
