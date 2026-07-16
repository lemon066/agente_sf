'use strict';

module.exports = {
  menuPrincipal: {
    parent: null,
    message:
      '👋 Hola. Soy el asistente de *ventas y soporte*.\n\n' +
      '1️⃣ Ver productos\n' +
      '2️⃣ Cotizaciones\n' +
      '3️⃣ Clientes\n' +
      '4️⃣ Oportunidades\n' +
      '5️⃣ Soporte y contacto\n\n' +
      'Escribe el número de una opción. También puedes escribir *menu*, *atras* o *cancelar*. Si no encuentras una, presiona 5 para soporte y contacto.',
    options: {
      '1': 'productosMenu',
      '2': 'cotizacionMenu',
      '3': 'clientesMenu',
      '4': 'oportunidadesMenu',
      '5': 'soporteMenu',
    },
  },

  productosMenu: {
    parent: 'menuPrincipal',
    message:
      '🛍️ *Catálogo de productos*\n\n' +
      '1️⃣ Ver categorías\n' +
      '2️⃣ Buscar producto\n' +
      '3️⃣ Productos destacados\n\n' +
      '0️⃣ Volver',
    options: { '1': 'productosCategorias', '2': 'productosBuscar', '3': 'productosDestacados', '0': 'menuPrincipal' },
  },

  productosCategorias: {
    parent: 'productosMenu',
    message:
      '🏷️ *Categorías*\n\n' +
      '1️⃣ Handhelds industriales\n' +
      '2️⃣ Impresoras Zebra\n' +
      '3️⃣ Software WMS\n' +
      '4️⃣ Accesorios y repuestos\n\n' +
      '0️⃣ Volver',
    options: { '1': 'productosHandhelds', '2': 'productosZebra', '3': 'productosWMS', '4': 'productosAccesorios', '0': 'productosMenu' },
  },

  productosHandhelds: {
    parent: 'productosCategorias',
    message: '📱 *Handhelds industriales*\n\n• Zebra TC21 / TC26\n• Honeywell EDA52\n• Datalogic Memor 11\n\nEscribe *cotizar* para registrar una solicitud o 0 para volver.',
    options: { cotizar: 'cotizacionNueva', '0': 'productosCategorias' },
  },

  productosZebra: {
    parent: 'productosCategorias',
    message: '🖨️ *Impresoras Zebra*\n\n• Zebra ZT411\n• Zebra ZD421\n• Zebra QLn420\n\nEscribe *cotizar* para registrar una solicitud o 0 para volver.',
    options: { cotizar: 'cotizacionNueva', '0': 'productosCategorias' },
  },

  productosWMS: {
    parent: 'productosCategorias',
    message: '💻 *Software WMS*\n\n• WMS Basic\n• WMS Pro\n• WMS Cloud\n\nEscribe *cotizar* para registrar una solicitud o 0 para volver.',
    options: { cotizar: 'cotizacionNueva', '0': 'productosCategorias' },
  },

  productosAccesorios: {
    parent: 'productosCategorias',
    message: '🔋 *Accesorios y repuestos*\n\n• Baterías\n• Cables y bases\n• Cabezales térmicos\n\nEscribe *cotizar* para registrar una solicitud o 0 para volver.',
    options: { cotizar: 'cotizacionNueva', '0': 'productosCategorias' },
  },

  productosBuscar: {
    parent: 'productosMenu',
    inputAction: 'productSearch',
    message: '🔎 Escribe el código, nombre o categoría del producto.\n\n0️⃣ Volver',
    options: { '0': 'productosMenu' },
  },

  productosDestacados: {
    parent: 'productosMenu',
    dynamicMessage: 'featuredProducts',
    message: '⭐ Productos destacados.\n\n0️⃣ Volver',
    options: { '0': 'productosMenu' },
  },

  cotizacionMenu: {
    parent: 'menuPrincipal',
    message: '💰 *Cotizaciones*\n\n1️⃣ Nueva solicitud\n2️⃣ Consultar solicitudes previas\n\n0️⃣ Volver',
    options: { '1': 'cotizacionNueva', '2': 'cotizacionConsultar', '0': 'menuPrincipal' },
  },

  cotizacionNueva: {
    parent: 'cotizacionMenu',
    inputAction: 'newQuotation',
    message: '📝 Escribe el producto, cantidad y cualquier observación para la cotización.\n\n0️⃣ Volver',
    options: { '0': 'cotizacionMenu' },
  },

  cotizacionConsultar: {
    parent: 'cotizacionMenu',
    dynamicMessage: 'quotationHistory',
    message: '📄 Solicitudes de cotización registradas localmente.\n\n0️⃣ Volver',
    options: { '0': 'cotizacionMenu' },
  },

  clientesMenu: {
    parent: 'menuPrincipal',
    message: '👤 *Clientes*\n\n1️⃣ Buscar cliente\n2️⃣ Registrar cliente de prueba\n\n0️⃣ Volver',
    options: { '1': 'clienteBuscar', '2': 'clienteNuevo', '0': 'menuPrincipal' },
  },

  clienteBuscar: {
    parent: 'clientesMenu',
    inputAction: 'searchClient',
    message: '🔎 Escribe el nombre, empresa o correo del cliente.\n\n0️⃣ Volver',
    options: { '0': 'clientesMenu' },
  },

  clienteNuevo: {
    parent: 'clientesMenu',
    inputAction: 'newClient',
    message: '➕ Escribe los datos con el formato: *nombre | empresa | correo*.\n\n0️⃣ Volver',
    options: { '0': 'clientesMenu' },
  },

  oportunidadesMenu: {
    parent: 'menuPrincipal',
    message: '📈 *Oportunidades*\n\n1️⃣ Ver solicitudes abiertas\n2️⃣ Actualizar oportunidad\n3️⃣ Crear oportunidad\n\n0️⃣ Volver',
    options: { '1': 'oportunidadesVer', '2': 'oportunidadesActualizar', '3': 'oportunidadesNueva', '0': 'menuPrincipal' },
  },

  oportunidadesVer: {
    parent: 'oportunidadesMenu',
    dynamicMessage: 'opportunityHistory',
    message: '📋 Oportunidades registradas localmente.\n\n0️⃣ Volver',
    options: { '0': 'oportunidadesMenu' },
  },

  oportunidadesActualizar: {
    parent: 'oportunidadesMenu',
    inputAction: 'updateOpportunity',
    message: '✏️ Escribe: *ID | nuevo estado | observación*.\n\n0️⃣ Volver',
    options: { '0': 'oportunidadesMenu' },
  },

  oportunidadesNueva: {
    parent: 'oportunidadesMenu',
    inputAction: 'newOpportunity',
    message: '➕ Describe la nueva oportunidad: cliente, producto y valor estimado.\n\n0️⃣ Volver',
    options: { '0': 'oportunidadesMenu' },
  },

  soporteMenu: {
    parent: 'menuPrincipal',
    message: '☎️ *Soporte y contacto*\n\n1️⃣ Contactar asesor\n2️⃣ Enviar solicitud a ventas\n\nTambién puedes describir directamente un problema de lector, WiFi, batería, login o conexión.\n\n0️⃣ Volver',
    options: { '1': 'contactarAsesor', '2': 'enviarMensajeVentas', '0': 'menuPrincipal' },
  },

  contactarAsesor: {
    parent: 'soporteMenu',
    dynamicMessage: 'salesContact',
    message: '☎️ Información de contacto.\n\n0️⃣ Volver',
    options: { '0': 'soporteMenu' },
  },

  enviarMensajeVentas: {
    parent: 'soporteMenu',
    inputAction: 'salesMessage',
    message: '✉️ Escribe el mensaje que deseas registrar para ventas.\n\n0️⃣ Volver',
    options: { '0': 'soporteMenu' },
  },
};
