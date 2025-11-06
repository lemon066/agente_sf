const responseUtils = require('../utils/responseUtils');
const menuTree = require('./menuTree');

module.exports = {
  handleMenuOption: function (client, usuario, opcion) {
    switch (opcion) {
      case "1":
        responseUtils.enviarTexto(client, usuario, "🛍️ Mostrando productos destacados...\n\n• Laptop X100\n• Monitor UltraView 27''\n• Mouse inalámbrico Pro\n\n¿Deseas cotizar alguno?");
        break;
      case "2":
        responseUtils.enviarTexto(client, usuario, "💰 Nueva cotización. Indica el producto y cantidad que deseas cotizar.");
        break;
      case "3":
        responseUtils.enviarTexto(client, usuario, "👤 Consultar cliente. Escribe el nombre o número del cliente a buscar.");
        break;
      case "4":
        responseUtils.enviarTexto(client, usuario, "📈 Estas son tus oportunidades abiertas:\n• OP-1234 - Laptop X100 - Etapa: Negociación\n• OP-1235 - Monitor UltraView - Etapa: Propuesta\n\n¿Deseas actualizar alguna?");
        break;
      case "5":
        responseUtils.enviarTexto(client, usuario, "☎️ Puedes contactar a un asesor o enviar mensaje al departamento de ventas.\n\nCorreo: ventas@miempresa.com");
        break;
      case "menu":
      case "0":
        responseUtils.enviarTexto(client, usuario, menuTree.menuPrincipal.message);
        break;
      default:
        responseUtils.enviarTexto(client, usuario, "❌ Opción no válida. Escribe *menu* para volver al inicio.");
        break;
    }
  },

  mostrarMenuPrincipal: function (client, usuario) {
    responseUtils.enviarTexto(client, usuario, menuTree.menuPrincipal.message);
  }


  
};
