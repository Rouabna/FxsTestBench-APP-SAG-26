// Pont TCP PC -> Pi pour que le téléphone (Wi-Fi) atteigne le backend du Pi.
//
//   Téléphone (Wi-Fi) -> PC 0.0.0.0:5000 -> Pi 192.168.100.10:5000 (câble)
//
// Le PC est sur les deux réseaux (Wi-Fi 10.235.225.56 + câble 192.168.100.50),
// le Pi seulement sur le câble. Ce relais TCP brut transmet tout (HTTP polling
// ET upgrade websocket de socket.io) sans rien décoder.
//
// Lancer sur le PC :  node bridge.js
// Puis dans l'app, API_URL = http://10.235.225.56:5000 (IP Wi-Fi du PC).

const net = require('net');

const LISTEN_HOST = '0.0.0.0';   // toutes les interfaces du PC (Wi-Fi + câble)
const LISTEN_PORT = 5000;
const PI_HOST = '192.168.100.10'; // Pi sur le câble direct
const PI_PORT = 5000;

const server = net.createServer((client) => {
  const upstream = net.connect(PI_PORT, PI_HOST);

  client.on('error', () => upstream.destroy());
  upstream.on('error', () => client.destroy());

  client.pipe(upstream);
  upstream.pipe(client);
});

server.on('error', (err) => {
  console.error('[bridge] erreur serveur :', err.message);
  if (err.code === 'EADDRINUSE') {
    console.error(`[bridge] le port ${LISTEN_PORT} est déjà utilisé sur le PC.`);
  }
  process.exit(1);
});

server.listen(LISTEN_PORT, LISTEN_HOST, () => {
  console.log(`[bridge] écoute ${LISTEN_HOST}:${LISTEN_PORT} -> ${PI_HOST}:${PI_PORT}`);
  console.log(`[bridge] téléphone : http://10.235.225.56:${LISTEN_PORT}`);
});
