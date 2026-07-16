'use strict';

const hardware = require('../KnowledgeBase/hardware');
const software = require('../KnowledgeBase/software');
const logConversation = require('../handlers/conversationLogger');
const menuTree = require('../menus/menuTree');

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

function getTimeGreeting(date = new Date()) {
  const hour = date.getHours();
  return hour < 12 ? 'Buenos dias' : 'Buenas tardes';
}

function isGreeting(value) {
  const text = normalizeText(value);
  const greetingWords = ['hola', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches'];
  return greetingWords.includes(text);
}

function inferMenuIntent(value, inferred = inferCategory(value)) {
  const text = normalizeText(value);
  const rules = [
    { option: '1', label: 'Ver productos', words: ['producto', 'productos', 'catalogo', 'equipo', 'handheld', 'impresora', 'zebra', 'wms'] },
    { option: '2', label: 'Cotizaciones', words: ['cotizacion', 'cotizar', 'precio', 'presupuesto', 'propuesta'] },
    { option: '3', label: 'Clientes', words: ['cliente', 'clientes', 'empresa', 'correo'] },
    { option: '4', label: 'Oportunidades', words: ['oportunidad', 'oportunidades', 'seguimiento', 'venta'] },
    { option: '5', label: 'Soporte y contacto', words: ['soporte', 'contacto', 'asesor', 'ayuda'] },
  ];

  if (inferred?.category) {
    return { option: '5', label: 'Soporte y contacto' };
  }

  const match = rules.find((rule) => rule.words.some((word) => text.includes(word)));
  if (!match) {
    return null;
  }

  return { option: match.option, label: match.label };
}

function buildInitialIntro(value, inferred, date) {
  const greeting = getTimeGreeting(date);
  const intent = inferMenuIntent(value, inferred);

  if (isGreeting(value)) {
    return `${greeting}, estimado usuario. Gracias por comunicarte con nosotros. Te comparto el menu de servicio:`;
  }

  if (intent) {
    return `${greeting}, estimado usuario. Tu consulta parece relacionada con la opcion ${intent.option}: ${intent.label}.`;
  }

  return `${greeting}, estimado usuario. Gracias por escribirnos. Te comparto las opciones disponibles para atenderte:`;
}

function getMainMenuMessage() {
  return menuTree.menuPrincipal.message;
}

function buildInitialGuidance(value, inferred = inferCategory(value), date = new Date()) {
  return [
    buildInitialIntro(value, inferred, date),
    '',
    getMainMenuMessage(),
  ].join('\n');
}

async function sendText(client, userId, message, type = 'respuesta') {
  const text = String(message || '').trim();
  if (!text) return null;
  const sent = await client.sendMessage(userId, text);
  logConversation(userId, 'salida', text, type);
  return sent;
}

module.exports = { normalizeText, inferCategory, buildInitialGuidance, sendText };
