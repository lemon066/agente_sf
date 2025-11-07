module.exports = {
  menuPrincipal: {
    message:
      "👋 ¡Hola! Soy tu asistente de *ventas Salesforce*.\n\n" +
      "Puedo ayudarte con lo siguiente:\n\n" +
      "1️⃣ Ver productos\n" +
      "2️⃣ Generar cotización\n" +
      "3️⃣ Consultar clientes\n" +
      "4️⃣ Seguimiento de oportunidades\n" +
      "5️⃣ Soporte y contacto\n\n" +
      "Escribe el número o palabra clave para continuar.",
    options: {
      "1": "productosMenu",
      "2": "cotizacionMenu",
      "3": "clientesMenu",
      "4": "oportunidadesMenu",
      "5": "soporteMenu",
      "menu": "menuPrincipal"
    }
  },

  productosMenu: {
    message:
      "🛍️ *Catálogo de productos*\n\n" +
      "1️⃣ Ver categorías\n" +
      "2️⃣ Buscar producto por nombre\n" +
      "3️⃣ Productos destacados\n\n" +
      "0️⃣ Volver al menú principal",
    options: {
      "1": "productosCategorias",
      "2": "productosBuscar",
      "3": "productosDestacados",
      "0": "menuPrincipal"
    }
  },

  // Subnivel: categorías de productos (logística)
  productosCategorias: {
    message:
      "🏷️ *Categorías de productos disponibles:*\n\n" +
      "1️⃣ Handhelds industriales\n" +
      "2️⃣ Impresoras Zebra\n" +
      "3️⃣ Software WMS\n" +
      "4️⃣ Accesorios y repuestos\n\n" +
      "0️⃣ Volver al menú anterior",
    options: {
      "1": "productosHandhelds",
      "2": "productosZebra",
      "3": "productosWMS",
      "4": "productosAccesorios",
      "0": "productosMenu"
    }
  },

  // Categorías específicas (submenús de productos)
  productosHandhelds: {
    message:
      "📱 *Handhelds Industriales*\n\n" +
      "• Zebra TC21 / TC26\n" +
      "• Honeywell EDA52\n" +
      "• Datalogic Memor 11\n\n" +
      "¿Deseas cotizar alguno?\n\n" +
      "0️⃣ Volver al menú de categorías",
    options: {
      "0": "productosCategorias"
    }
  },

  productosZebra: {
    message:
      "🖨️ *Impresoras Zebra*\n\n" +
      "• Zebra ZT411 (Industrial)\n" +
      "• Zebra ZD421 (Desktop)\n" +
      "• Zebra QLn420 (Móvil)\n\n" +
      "¿Deseas cotizar alguno?\n\n" +
      "0️⃣ Volver al menú de categorías",
    options: {
      "0": "productosCategorias"
    }
  },

  productosWMS: {
    message:
      "💻 *Software WMS (Warehouse Management System)*\n\n" +
      "• WMS Basic (control de ubicaciones)\n" +
      "• WMS Pro (multibodega + integración ERP)\n" +
      "• WMS Cloud (modelo SaaS)\n\n" +
      "¿Deseas una demostración o cotización?\n\n" +
      "0️⃣ Volver al menú de categorías",
    options: {
      "0": "productosCategorias"
    }
  },

  productosAccesorios: {
    message:
      "🔋 *Accesorios y repuestos*\n\n" +
      "• Baterías para handhelds\n" +
      "• Cables USB / Cradles\n" +
      "• Cabezales térmicos Zebra\n\n" +
      "¿Deseas cotizar alguno?\n\n" +
      "0️⃣ Volver al menú de categorías",
    options: {
      "0": "productosCategorias"
    }
  },

  // Cotización
  cotizacionMenu: {
    message:
      "💰 *Generar cotización*\n\n" +
      "1️⃣ Nueva cotización\n" +
      "2️⃣ Consultar cotizaciones previas\n\n" +
      "0️⃣ Volver al menú principal",
    options: {
      "1": "cotizacionNueva",
      "2": "cotizacionConsultar",
      "0": "menuPrincipal"
    }
  },

  // Clientes
  clientesMenu: {
    message:
      "👤 *Gestión de clientes*\n\n" +
      "1️⃣ Buscar cliente\n" +
      "2️⃣ Registrar nuevo cliente\n\n" +
      "0️⃣ Volver al menú principal",
    options: {
      "1": "clienteBuscar",
      "2": "clienteNuevo",
      "0": "menuPrincipal"
    }
  },

  // Oportunidades
  oportunidadesMenu: {
    message:
      "📈 *Seguimiento de oportunidades*\n\n" +
      "1️⃣ Ver oportunidades abiertas\n" +
      "2️⃣ Actualizar estado\n" +
      "3️⃣ Crear nueva oportunidad\n\n" +
      "0️⃣ Volver al menú principal",
    options: {
      "1": "oportunidadesVer",
      "2": "oportunidadesActualizar",
      "3": "oportunidadesNueva",
      "0": "menuPrincipal"
    }
  },

  // Soporte
  soporteMenu: {
    message:
      "☎️ *Soporte de ventas*\n\n" +
      "1️⃣ Contactar asesor\n" +
      "2️⃣ Enviar mensaje al departamento de ventas\n\n" +
      "0️⃣ Volver al menú principal",
    options: {
      "1": "contactarAsesor",
      "2": "enviarMensajeVentas",
      "0": "menuPrincipal"
    }
  }
};
