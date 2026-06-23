// Backend URL = adresse du Raspberry Pi (qui fait tourner app.py sur le port 5000).
// Le Pi est relié au PC par le lien direct 192.168.100.x (Pi = .10, PC = .50).
//   - Depuis le PC : http://192.168.100.10:5000 fonctionne (réseau du câble Pi↔PC).
//   - Depuis un téléphone : il faut que le Pi soit aussi sur un Wi-Fi/LAN joignable
//     par le tlf, et mettre ICI l'adresse du Pi sur CE réseau-là.
// (Trouver l'IP du Pi : `hostname -I` sur le Pi.)
export const API_URL = 'http://192.168.100.10:5000';
