import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../constants/theme';
import { apiGateway } from '../services/socket';

// Badge de statut du pilotage de la SONNERIE (gateway).
//  - mode 'local'  : le Pi telnet le gateway directement -> rien à lancer côté PC.
//  - mode 'remote' : sonnerie déportée sur le PC ; on indique si le serveur PC
//                    (gateway_server.py) répond. S'il est injoignable, l'opérateur
//                    est prévenu AVANT de lancer un test (la sonnerie/p2p échouerait).
// Auto-rafraîchi toutes les 6 s, sans toucher à l'état global de l'app.
export default function GatewayStatus() {
  const { colors } = useTheme();
  const [gw, setGw] = useState(undefined);   // undefined = en cours, null = API Pi KO
  const timer = useRef(null);

  useEffect(() => {
    let alive = true;
    const poll = () => apiGateway().then(d => { if (alive) setGw(d); })
                                   .catch(() => { if (alive) setGw(null); });
    poll();
    timer.current = setInterval(poll, 6000);
    return () => { alive = false; clearInterval(timer.current); };
  }, []);

  // Choix de l'apparence selon l'état.
  let dot = colors.idleGray, label = 'GATEWAY', sub = 'statut…', text = colors.textMuted;

  if (gw === null) {
    label = 'SONNERIE'; sub = 'statut indisponible'; dot = colors.idleGray;
  } else if (gw && gw.mode === 'local') {
    label = 'SONNERIE'; sub = `Telnet local (Pi) · ${gw.gateway || ''}`.trim();
    dot = colors.cyan; text = colors.cyan;
  } else if (gw && gw.mode === 'remote' && gw.reachable) {
    label = 'SERVEUR SONNERIE PC'; sub = `${gw.url} · joignable`;
    dot = colors.passGreen; text = colors.passGreen;
  } else if (gw && gw.mode === 'remote') {
    label = 'SERVEUR SONNERIE PC';
    sub = `${gw.url} · INJOIGNABLE — lancer gateway_server.py`;
    dot = colors.failRed; text = colors.failRed;
  }

  return (
    <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: text + '40' }]}>
      <View style={[styles.dot, { backgroundColor: dot }]} />
      <Text style={[styles.label, { color: text }]}>{label}</Text>
      <Text style={[styles.sub, { color: colors.textSecondary }]} numberOfLines={1}>{sub}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 10, borderWidth: 1,
    paddingHorizontal: 12, paddingVertical: 8, marginBottom: 10,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  label: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  sub: { fontSize: 9, marginLeft: 8, flex: 1 },
});
