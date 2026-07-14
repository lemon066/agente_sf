'use strict';

const config = require('../config/config');

const processedIds = new Map();
const rateState = new Map();

function cleanup() {
  const now = Date.now();
  for (const [id, timestamp] of processedIds.entries()) {
    if (now - timestamp > 10 * 60 * 1000) processedIds.delete(id);
  }
  for (const [userId, state] of rateState.entries()) {
    if (now - state.windowStartedAt > 2 * 60 * 1000) rateState.delete(userId);
  }
}

setInterval(cleanup, 5 * 60 * 1000).unref();

function isDuplicate(message) {
  const id = message.id?._serialized;
  if (!id) return false;
  if (processedIds.has(id)) return true;
  processedIds.set(id, Date.now());
  return false;
}

function isRateLimited(userId) {
  const now = Date.now();
  let state = rateState.get(userId);
  if (!state || now - state.windowStartedAt >= 60 * 1000) {
    state = { windowStartedAt: now, count: 0 };
    rateState.set(userId, state);
  }
  state.count += 1;
  return state.count > config.maxMessagesPerMinute;
}

async function resolveNumber(message) {
  const serialized = message.from || '';
  if (serialized.endsWith('@c.us')) return serialized.split('@')[0].replace(/\D/g, '');
  try {
    const contact = await message.getContact();
    return String(contact?.number || '').replace(/\D/g, '');
  } catch {
    return '';
  }
}

async function inspect(message, readyAt) {
  if (!message?.from || message.fromMe) return { accepted: false, reason: 'propio-o-invalido' };
  if (message.from === 'status@broadcast' || message.from.endsWith('@broadcast') || message.from.endsWith('@newsletter')) {
    return { accepted: false, reason: 'estado-o-difusion' };
  }
  if (!config.respondToGroups && message.from.endsWith('@g.us')) {
    return { accepted: false, reason: 'grupo' };
  }
  if (!String(message.body || '').trim()) return { accepted: false, reason: 'sin-texto' };
  if (isDuplicate(message)) return { accepted: false, reason: 'duplicado' };

  const messageTime = Number(message.timestamp || 0) * 1000;
  const oldestAccepted = readyAt - config.ignoreOldMessagesSeconds * 1000;
  if (messageTime && messageTime < oldestAccepted) {
    return { accepted: false, reason: 'mensaje-antiguo' };
  }

  const number = await resolveNumber(message);
  if (config.allowedNumbers.size && !config.allowedNumbers.has(number)) {
    return { accepted: false, reason: 'numero-no-autorizado' };
  }
  if (isRateLimited(message.from)) return { accepted: false, reason: 'limite' };

  return { accepted: true, number };
}

module.exports = { inspect };
