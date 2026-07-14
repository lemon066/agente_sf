'use strict';

const products = [
  { code: 'TC21', name: 'Zebra TC21', category: 'Handheld', featured: true },
  { code: 'TC26', name: 'Zebra TC26', category: 'Handheld', featured: false },
  { code: 'EDA52', name: 'Honeywell EDA52', category: 'Handheld', featured: true },
  { code: 'MEMOR11', name: 'Datalogic Memor 11', category: 'Handheld', featured: false },
  { code: 'ZT411', name: 'Zebra ZT411', category: 'Impresora', featured: true },
  { code: 'ZD421', name: 'Zebra ZD421', category: 'Impresora', featured: true },
  { code: 'QLN420', name: 'Zebra QLn420', category: 'Impresora', featured: false },
  { code: 'WMS-BASIC', name: 'WMS Basic', category: 'Software', featured: false },
  { code: 'WMS-PRO', name: 'WMS Pro', category: 'Software', featured: true },
  { code: 'WMS-CLOUD', name: 'WMS Cloud', category: 'Software', featured: false },
];

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function search(term) {
  const query = normalize(term);
  if (!query) return [];
  return products.filter((product) =>
    [product.code, product.name, product.category].some((field) =>
      normalize(field).includes(query),
    ),
  );
}

function featured() {
  return products.filter((product) => product.featured);
}

function format(list) {
  if (!list.length) return 'No se encontraron productos con ese criterio.';
  return list
    .slice(0, 10)
    .map((product) => `• *${product.code}* - ${product.name} (${product.category})`)
    .join('\n');
}

module.exports = { products, search, featured, format };
