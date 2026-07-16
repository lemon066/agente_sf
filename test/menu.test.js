'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const menuTree = require('../src/menus/menuTree');
const productService = require('../src/services/productService');
const { buildInitialGuidance, inferCategory } = require('../src/utils/responseUtils');

for (const [state, node] of Object.entries(menuTree)) {
  test(`estado ${state} referencia únicamente destinos existentes`, () => {
    for (const target of Object.values(node.options || {})) {
      assert.ok(menuTree[target], `${state} referencia el estado inexistente ${target}`);
    }
    if (node.parent) assert.ok(menuTree[node.parent], `${state} tiene padre inexistente ${node.parent}`);
  });
}

test('búsqueda de producto encuentra ZT411', () => {
  const result = productService.search('ZT411');
  assert.equal(result[0]?.code, 'ZT411');
});

test('orientacion inicial saluda y muestra el menu visual', () => {
  const inferred = inferCategory('Hola, tengo problema con la bateria');
  const message = buildInitialGuidance(
    'Hola, tengo problema con la bateria',
    inferred,
    new Date('2026-07-15T09:00:00'),
  );

  assert.match(message, /^Buenos dias, estimado usuario\./);
  assert.match(message, /Tu consulta parece relacionada con la opcion 5: Soporte y contacto\./);
  assert.match(message, /Hola\. Soy el asistente de \*ventas y soporte\*/);
  assert.match(message, /5.*Soporte y contacto/);
  assert.match(message, /Escribe el n.mero de una opci.n\..*presiona 5 para soporte y contacto\./);
  assert.doesNotMatch(message, /Por favor selecciona/);
  assert.doesNotMatch(message, /un saludo o una consulta general/);
  assert.doesNotMatch(message, /Tu mensaje indica/);
});

test('saludo inicial responde de forma agradable sin inferencia generica', () => {
  const message = buildInitialGuidance('hola', inferCategory('hola'), new Date('2026-07-15T15:00:00'));

  assert.match(message, /^Buenas tardes, estimado usuario\./);
  assert.match(message, /Gracias por comunicarte con nosotros/);
  assert.match(message, /Hola\. Soy el asistente de \*ventas y soporte\*/);
  assert.doesNotMatch(message, /Tu consulta parece relacionada/);
  assert.doesNotMatch(message, /un saludo o una consulta general/);
});

test('inferencia de soporte responde a batería', () => {
  const result = inferCategory('Tengo problema con la batería');
  assert.equal(result.category, 'hardware-bateria');
  assert.ok(result.response);
});
