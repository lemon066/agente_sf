'use strict';

const hardware = require('../KnowledgeBase/hardware');
const software = require('../KnowledgeBase/software');
const logConversation = require('../handlers/conversationLogger');

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function inferCategory(value) {
  const text = normalizeText(value);
  const rules = [
    { category: 'hardware-lector', words: ['lector', 'scanner', 'escaner'], response: hardware.lector },
    { category: 'hardware-wifi', words: ['wifi', 'wi-fi', 'red'], response: hardware.wifi },
    { category: 'hardware-bateria', words: ['bateria', 'carga'], response: hardware.bateria },
    { category: 'software-login', words: ['login', 'sesion', 'usuario', 'contrasena'], response: software.login },
    { category: 'software-api', words: ['api', 'servidor', 'sincronizar', 'conexion'], response: software.api },
    { category: 'software-error', words: ['error', 'falla', 'problema'], response: software.error },
  ];

  const match = rules.find((rule) => rule.words.some((word) => text.includes(word)));
  return match || { category: null, response: null };
}

async function sendText(client, userId, message, type = 'respuesta') {
  const text = String(message || '').trim();
  if (!text) return null;
  const sent = await client.sendMessage(userId, text);
  logConversation(userId, 'salida', text, type);
  return sent;
}

module.exports = { normalizeText, inferCategory, sendText };
