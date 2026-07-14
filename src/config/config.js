'use strict';

const fs = require('fs');
const path = require('path');
try {
  require('dotenv').config();
} catch (error) {
  if (error.code !== 'MODULE_NOT_FOUND') throw error;
}

const projectRoot = path.resolve(__dirname, '../..');

function resolveProjectPath(value, fallback) {
  const selected = value && String(value).trim() ? String(value).trim() : fallback;
  return path.isAbsolute(selected) ? selected : path.resolve(projectRoot, selected);
}

function readBoolean(name, fallback) {
  const value = process.env[name];
  if (value === undefined || value === '') return fallback;
  return ['1', 'true', 'yes', 'si', 'sí', 'on'].includes(String(value).toLowerCase());
}

function readPositiveNumber(name, fallback) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function onlyDigits(value) {
  return String(value || '').replace(/\D/g, '');
}

const dataDir = resolveProjectPath(process.env.DATA_DIR, './data');
const authPath = resolveProjectPath(
  process.env.WWEBJS_AUTH_PATH,
  path.join(dataDir, 'whatsapp-auth'),
);

fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(authPath, { recursive: true });

const clientId = String(process.env.WWEBJS_CLIENT_ID || 'agente-sf').trim();
if (!/^[-_\w]+$/i.test(clientId)) {
  throw new Error('WWEBJS_CLIENT_ID solo puede contener letras, números, guion y guion bajo.');
}

const allowedNumbers = new Set(
  String(process.env.ALLOWED_NUMBERS || '')
    .split(',')
    .map(onlyDigits)
    .filter(Boolean),
);

module.exports = Object.freeze({
  projectRoot,
  dataDir,
  authPath,
  clientId,
  port: readPositiveNumber('PORT', 3000),
  headless: readBoolean('PUPPETEER_HEADLESS', true),
  executablePath: String(process.env.PUPPETEER_EXECUTABLE_PATH || '').trim(),
  pairingNumber: onlyDigits(process.env.PAIRING_NUMBER),
  adminNumber: onlyDigits(process.env.ADMIN_NUMBER),
  respondToGroups: readBoolean('RESPOND_TO_GROUPS', false),
  allowedNumbers,
  inactivityMs: readPositiveNumber('INACTIVITY_MINUTES', 10) * 60 * 1000,
  maxMessagesPerMinute: readPositiveNumber('MAX_MESSAGES_PER_MINUTE', 12),
  ignoreOldMessagesSeconds: readPositiveNumber('IGNORE_OLD_MESSAGES_SECONDS', 120),
  reconnectDelayMs: readPositiveNumber('RECONNECT_DELAY_SECONDS', 15) * 1000,
  maxReconnectAttempts: readPositiveNumber('MAX_RECONNECT_ATTEMPTS', 10),
  logConversations: readBoolean('LOG_CONVERSATIONS', true),
  salesContact: String(
    process.env.SALES_CONTACT ||
      'Un asesor revisará tu solicitud y dará seguimiento por este mismo chat.',
  ).trim(),
  stateFile: path.join(dataDir, 'conversation_state.json'),
  requestsFile: path.join(dataDir, 'requests.json'),
  logsDir: path.join(dataDir, 'logs'),
});
