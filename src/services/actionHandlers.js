'use strict';

const productService = require('./productService');
const requestStore = require('./requestStore');

function formatHistory(records, emptyMessage) {
  if (!records.length) return emptyMessage;
  return records
    .slice(-10)
    .reverse()
    .map((item) => `• *${item.id}* - ${item.status} - ${item.createdAt.slice(0, 10)}`)
    .join('\n');
}

async function handleInput(action, userId, text) {
  switch (action) {
    case 'productSearch': {
      const results = productService.search(text);
      return {
        message: `${productService.format(results)}\n\nEscribe otra búsqueda o 0 para volver.`,
        stay: true,
      };
    }

    case 'newQuotation': {
      const record = requestStore.add('cotizacion', userId, { detail: text });
      return {
        message: `✅ Solicitud registrada con el ID *${record.id}*.\nSe almacenó localmente para fines de prueba.`,
        nextState: 'cotizacionMenu',
      };
    }

    case 'searchClient': {
      const records = requestStore.data.filter(
        (item) =>
          item.type === 'cliente' &&
          JSON.stringify(item.payload).toLowerCase().includes(text.toLowerCase()),
      );
      return {
        message: `${formatHistory(records, 'No se encontró un cliente local con ese criterio.')}\n\nEscribe otra búsqueda o 0 para volver.`,
        stay: true,
      };
    }

    case 'newClient': {
      const parts = text.split('|').map((value) => value.trim());
      if (parts.length < 3 || parts.some((value) => !value)) {
        return {
          message: 'Formato inválido. Usa: *nombre | empresa | correo*.',
          stay: true,
        };
      }
      const record = requestStore.add('cliente', userId, {
        name: parts[0],
        company: parts[1],
        email: parts[2],
      });
      return {
        message: `✅ Cliente de prueba registrado con el ID *${record.id}*.`,
        nextState: 'clientesMenu',
      };
    }

    case 'newOpportunity': {
      const record = requestStore.add('oportunidad', userId, { detail: text });
      return {
        message: `✅ Oportunidad registrada con el ID *${record.id}*.`,
        nextState: 'oportunidadesMenu',
      };
    }

    case 'updateOpportunity': {
      const record = requestStore.add('actualizacion-oportunidad', userId, { detail: text });
      return {
        message: `✅ Actualización registrada con el ID *${record.id}*.`,
        nextState: 'oportunidadesMenu',
      };
    }

    case 'salesMessage': {
      const record = requestStore.add('ventas', userId, { message: text });
      return {
        message: `✅ Mensaje registrado con el ID *${record.id}*.`,
        nextState: 'soporteMenu',
      };
    }

    default:
      return null;
  }
}

function dynamicMessage(name, userId, config) {
  switch (name) {
    case 'featuredProducts':
      return `⭐ *Productos destacados*\n\n${productService.format(productService.featured())}\n\n0️⃣ Volver`;
    case 'quotationHistory':
      return `📄 *Cotizaciones registradas*\n\n${formatHistory(requestStore.findByUser(userId, 'cotizacion'), 'No existen solicitudes registradas.')}\n\n0️⃣ Volver`;
    case 'opportunityHistory':
      return `📋 *Oportunidades registradas*\n\n${formatHistory(requestStore.findByUser(userId, 'oportunidad'), 'No existen oportunidades registradas.')}\n\n0️⃣ Volver`;
    case 'salesContact':
      return `☎️ *Contacto de ventas*\n\n${config.salesContact}\n\n0️⃣ Volver`;
    default:
      return null;
  }
}

module.exports = { handleInput, dynamicMessage };
