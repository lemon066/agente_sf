'use strict';

const menuTree = require('../menus/menuTree');
const menu = require('../menus/menuHandler');
const conversationStore = require('../services/conversationStore');
const { handleInput } = require('../services/actionHandlers');
const logConversation = require('./conversationLogger');
const { inferCategory, normalizeText, sendText } = require('../utils/responseUtils');

const ROOT_STATE = conversationStore.ROOT_STATE;
const MENU_COMMANDS = new Set(['menu', 'inicio', 'empezar', 'hola', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches']);
const BACK_COMMANDS = new Set(['atras', 'atrás', 'volver']);
const CANCEL_COMMANDS = new Set(['cancelar', 'salir']);

module.exports = async function handleMessage(client, message) {
  const userId = message.from;
  const rawText = String(message.body || '').trim();
  const text = normalizeText(rawText);
  if (!userId || !text) return;

  logConversation(userId, 'entrada', rawText, 'mensaje');

  if (conversationStore.isExpired(userId)) {
    conversationStore.reset(userId);
    await sendText(client, userId, '⌛ La conversación anterior venció por inactividad.', 'inactividad');
    await menu.mostrarMenuPrincipal(client, userId);
    return;
  }

  const session = conversationStore.touch(userId);

  if (MENU_COMMANDS.has(text) || CANCEL_COMMANDS.has(text)) {
    conversationStore.reset(userId);
    await menu.mostrarMenuPrincipal(client, userId);
    return;
  }

  if (BACK_COMMANDS.has(text)) {
    const currentNode = menuTree[session.state] || menuTree[ROOT_STATE];
    const parent = currentNode.parent || ROOT_STATE;
    conversationStore.setState(userId, parent);
    await menu.renderState(client, userId, parent);
    return;
  }

  const currentState = menuTree[session.state] ? session.state : ROOT_STATE;
  const currentNode = menuTree[currentState];
  const nextState = currentNode.options?.[text];

  if (nextState) {
    conversationStore.setState(userId, nextState);
    await menu.renderState(client, userId, nextState);
    return;
  }

  if (currentNode.inputAction) {
    const result = await handleInput(currentNode.inputAction, userId, rawText);
    if (result) {
      if (result.nextState) conversationStore.setState(userId, result.nextState);
      else conversationStore.touch(userId);
      await sendText(client, userId, result.message, `accion:${currentNode.inputAction}`);
      if (result.nextState) await menu.renderState(client, userId, result.nextState);
      return;
    }
  }

  const inferred = inferCategory(text);
  if (inferred.response) {
    await sendText(client, userId, inferred.response, inferred.category);
    return;
  }

  const invalidAttempts = conversationStore.incrementInvalid(userId);
  if (invalidAttempts >= 3) {
    conversationStore.reset(userId);
    await sendText(client, userId, 'No pude identificar la opción. La conversación regresó al menú principal.', 'opcion-invalida');
    await menu.mostrarMenuPrincipal(client, userId);
    return;
  }

  await sendText(client, userId, 'Opción no válida. Usa una opción del menú, escribe *atras* o escribe *menu* para reiniciar.', 'opcion-invalida');
  await menu.renderState(client, userId, currentState);
};
