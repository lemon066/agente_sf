const logConversation = require('./conversationLogger');
const menu = require('../menus/menuHandler');
const menuTree = require('../menus/menuTree');
const inferCategory = require('../utils/responseUtils');

// Estado por usuario (nivel actual del menú)
const userStates = {};

// Clave raíz real según tu menuTree
const ROOT_STATE = 'menuPrincipal';

// Helper: renderiza cualquier estado usando menuTree (sin tocar menuHandler)
async function renderState(client, to, state) {
  const node = menuTree?.[state];
  if (!node || typeof node.message !== 'string') {
    // Fallback: muestra el principal si el estado no existe
    await menu.mostrarMenuPrincipal(client, to);
    return;
  }
  await client.sendMessage(to, node.message);
}

module.exports = async (client, message) => {
  const text = String((message.body || '')).toLowerCase().trim();
  const from = message?.from;
  if (!from) return;

  // 🔹 Saludo / pedir menú → ir SIEMPRE al menú raíz de tu menuTree
  if (['hola', 'menu', 'inicio', 'buenas', 'empezar'].some(g => text.includes(g))) {
    userStates[from] = ROOT_STATE;
    try {
      await menu.mostrarMenuPrincipal(client, from);
    } catch (err) {
      console.error('❌ Error mostrando menú principal:', err);
    }
    logConversation(from, text, 'menú principal');
    return;
  }

  // 🔹 Determinar nivel actual del usuario (por defecto, raíz)
  const currentLevel = userStates[from] || ROOT_STATE;

  // 🔹 Tomar las opciones del estado actual
  const stateNode = menuTree[currentLevel];
  const options = stateNode?.options;

  // Si no hay opciones para ese estado, vuelve al menú principal
  if (!options || typeof options !== 'object') {
    console.warn(`⚠️ options undefined para estado "${currentLevel}". Volviendo a ${ROOT_STATE}.`);
    userStates[from] = ROOT_STATE;
    try {
      await menu.mostrarMenuPrincipal(client, from);
    } catch (err) {
      console.error('❌ Error mostrando menú principal (fallback):', err);
    }
    logConversation(from, text, 'fallback menú principal');
    return;
  }

  // 🔹 Buscar coincidencia por número (las claves del objeto options)
  let selectedKey = null;
  for (const key of Object.keys(options)) {
    if (key === text) {
      selectedKey = key;
      break;
    }
  }

  if (!selectedKey) {
    // Si no reconoce, intenta inferir respuesta; si no, re-muestra el menú actual
    try {
      const { category, response } = inferCategory(text);
      if (response) {
        await client.sendMessage(from, response);
        logConversation(from, text, category || 'sin categoría');
      } else {
        await renderState(client, from, currentLevel);
        logConversation(from, text, `repetir menú ${currentLevel}`);
      }
    } catch (err) {
      console.error('❌ Error al inferir/responder:', err);
    }
    return;
  }

  // 🔹 Avanzar al siguiente estado según el mapeo
  const nextState = options[selectedKey];

  if (nextState) {
    userStates[from] = nextState;
    try {
      await renderState(client, from, nextState); // ⬅️ reemplaza menu.showMenu(...)
    } catch (err) {
      console.error('❌ Error mostrando submenú:', err);
      // fallback al menú principal si falla
      userStates[from] = ROOT_STATE;
      try { await menu.mostrarMenuPrincipal(client, from); } catch {}
    }
    logConversation(from, text, `ir a ${nextState}`);
  } else {
    // Si una opción no tuviera nextState (no es tu caso), confirmación genérica
    try {
      await client.sendMessage(from, '✅ Opción seleccionada.');
    } catch (err) {
      console.error('❌ Error enviando confirmación:', err);
    }
    logConversation(from, text, `${currentLevel} - opción final`);
  }
};
