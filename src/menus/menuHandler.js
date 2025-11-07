const responseUtils = require('../utils/responseUtils');
const menuTree = require('./menuTree');

module.exports = {
  handleMenuOption: function (client, usuario, opcion) {
    switch (opcion) {
      // 🔹 Nivel 1: Menú principal
      case "1":
        // Ahora el menú de productos se gestiona dinámicamente desde menuTree
        responseUtils.enviarTexto(client, usuario, menuTree.productosMenu.message);
        break;

      case "2":
        responseUtils.enviarTexto(client, usuario, menuTree.cotizacionMenu.message);
        break;

      case "3":
        responseUtils.enviarTexto(client, usuario, menuTree.clientesMenu.message);
        break;

      case "4":
        responseUtils.enviarTexto(client, usuario, menuTree.oportunidadesMenu.message);
        break;

      case "5":
        responseUtils.enviarTexto(client, usuario, menuTree.soporteMenu.message);
        break;

      // 🔹 Permite volver al menú principal
      case "menu":
      case "0":
        responseUtils.enviarTexto(client, usuario, menuTree.menuPrincipal.message);
        break;

      // 🔹 Manejo dinámico para subniveles (productosCategorias, etc.)
      default:
        // Si la opción coincide con una clave del árbol de menús, mostrar el mensaje correspondiente
        if (menuTree[opcion] && menuTree[opcion].message) {
          responseUtils.enviarTexto(client, usuario, menuTree[opcion].message);
        } else {
          // Si no existe en el árbol, enviar mensaje genérico
          responseUtils.enviarTexto(client, usuario, "❌ Opción no válida. Escribe *menu* para volver al inicio.");
        }
        break;
    }
  },

  mostrarMenuPrincipal: function (client, usuario) {
    responseUtils.enviarTexto(client, usuario, menuTree.menuPrincipal.message);
  }
};
