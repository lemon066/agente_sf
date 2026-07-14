'use strict';

const config = require('../config/config');
const menuTree = require('./menuTree');
const { dynamicMessage } = require('../services/actionHandlers');
const { sendText } = require('../utils/responseUtils');

async function renderState(client, userId, state) {
  const node = menuTree[state] || menuTree.menuPrincipal;
  const message = node.dynamicMessage
    ? dynamicMessage(node.dynamicMessage, userId, config) || node.message
    : node.message;
  await sendText(client, userId, message, `menu:${state}`);
  return node;
}

async function mostrarMenuPrincipal(client, userId) {
  return renderState(client, userId, 'menuPrincipal');
}

module.exports = { renderState, mostrarMenuPrincipal };
