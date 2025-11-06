module.exports = {
  enviarTexto: async function (client, usuario, mensaje) {
    try {
      await client.sendMessage(usuario, mensaje);
      console.log(`[MENSAJE ENVIADO A ${usuario}]: ${mensaje}`);
    } catch (error) {
      console.error(`❌ Error enviando mensaje a ${usuario}:`, error);
    }
  }
};
