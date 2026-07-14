'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');

const temporaryData = fs.mkdtempSync(path.join(os.tmpdir(), 'agente-sf-test-'));
process.env.DATA_DIR = temporaryData;
process.env.LOG_CONVERSATIONS = 'false';

const handleMessage = require('../src/handlers/messageHandler');

function createClient() {
  const messages = [];
  return {
    messages,
    async sendMessage(to, body) {
      messages.push({ to, body });
      return { to, body };
    },
  };
}

function incoming(body, suffix) {
  return {
    from: '50255555555@c.us',
    body,
    id: { _serialized: `TEST-${suffix}` },
    timestamp: Math.floor(Date.now() / 1000),
  };
}

test('conversación navega al buscador y devuelve un producto', async (t) => {
  t.after(() => fs.rmSync(temporaryData, { recursive: true, force: true }));
  const client = createClient();

  await handleMessage(client, incoming('hola', 1));
  assert.match(client.messages.at(-1).body, /Ver productos/);

  await handleMessage(client, incoming('1', 2));
  assert.match(client.messages.at(-1).body, /Catálogo de productos/);

  await handleMessage(client, incoming('2', 3));
  assert.match(client.messages.at(-1).body, /código, nombre o categoría/);

  await handleMessage(client, incoming('ZT411', 4));
  assert.match(client.messages.at(-1).body, /Zebra ZT411/);
});
