// Backend = Raspberry Pi (app.py sur le port 5000), relié au PC par le câble
// direct 192.168.100.x (Pi = .10, PC = .50). Le Pi N'EST PAS sur le Wi-Fi.
//
// Pour qu'un TÉLÉPHONE (Wi-Fi) atteigne le Pi, le PC sert de pont (bridge) :
//   Téléphone (Wi-Fi) -> PC 10.235.225.56:5000 -> Pi 192.168.100.10:5000 (câble)
// Le pont tourne sur le PC via `node bridge.js`.
//
//   - Depuis un téléphone (Expo Go) : http://10.235.225.56:5000  (IP Wi-Fi du PC)
//   - Depuis le PC en local         : http://192.168.100.10:5000 (câble, direct Pi)
//
// NB: 10.235.225.56 = IP Wi-Fi du PC (change si le PC rejoint un autre réseau).
export const API_URL = 'http://10.235.225.56:5000';
