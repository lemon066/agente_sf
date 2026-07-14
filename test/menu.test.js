'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const menuTree = require('../src/menus/menuTree');
const productService = require('../src/services/productService');
const { inferCategory } = require('../src/utils/responseUtils');

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

test('inferencia de soporte responde a batería', () => {
  const result = inferCategory('Tengo problema con la batería');
  assert.equal(result.category, 'hardware-bateria');
  assert.ok(result.response);
});
