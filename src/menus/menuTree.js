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
