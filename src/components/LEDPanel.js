import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../constants/theme';

/**
 * Indicateur d'AVANCEMENT (logiciel, pas des LED matérielles).
 * Une "LED" s'allume quand la mesure a été EFFECTUÉE (sa valeur est arrivée) ;
 * elle reste éteinte si la mesure n'a pas été faite (séquence non atteinte /
 * interrompue). On voit ainsi d'un coup d'œil ce qui a tourné, par port.
 *
 * NB : le banc de production ne câble aucune LED — ces pins servent au
 * multiplexage de mesure. C'est donc volontairement un témoin LOGICIEL.
 */
const MEAS = [
  { key: 'tr',        label: 'TR',    colorKey: 'sectionVoltage' },
  { key: 'cl',        label: 'CL',    colorKey: 'sectionCurrent' },
  { key: 'alarm_rms', label: 'Ring',  colorKey: 'sectionDial' },
  { key: 'trans_1000',label: 'Trans', colorKey: 'sectionAudio' },
];
const PORTS = ['FXS1', 'FXS2'];

function Led({ on, active, color, label, colors }) {
  return (
    <View style={styles.ledItem}>
      <View style={[styles.ledOuter, {
        borderColor: on ? color : active ? color : colors.borderColor,
      }]}>
        <View style={[styles.ledInner, {
          backgroundColor: on ? color : colors.bgCardAlt,
          opacity: on ? 1 : active ? 0.4 : 1,
        }]} />
      </View>
      <Text style={[styles.ledLabel, { color: on ? color : colors.textMuted }]}>{label}</Text>
    </View>
  );
}

export default function LEDPanel({ data }) {
  const { colors } = useTheme();
  // Mesure en cours (statut "TR_FXS1", "TRANS_FXS2"...) -> affichée en "active".
  const m = /^(TR|CL|RING|TRANS)_(FXS\d)$/.exec(data.status || '');
  const activeKey = m ? { TR: 'tr', CL: 'cl', RING: 'alarm_rms', TRANS: 'trans_1000' }[m[1]] : null;
  const activePort = m ? m[2] : null;

  const doneCount = PORTS.reduce((acc, p) =>
    acc + MEAS.filter(me => data[`${me.key}_${p.toLowerCase()}`] != null).length, 0);

  return (
    <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.borderColor }]}>
      <View style={[styles.header, { borderBottomColor: colors.borderColor }]}>
        <Text style={[styles.title, { color: colors.textSecondary }]}>MESURES EFFECTUÉES</Text>
        <Text style={[styles.sub, { color: colors.textMuted }]}>allumé = faite · {doneCount}/8</Text>
      </View>
      <View style={styles.body}>
        {PORTS.map(port => {
          const p = port.toLowerCase();
          return (
            <View key={port} style={styles.portRow}>
              <Text style={[styles.portTag, { color: colors.textMuted }]}>{port}</Text>
              <View style={styles.ledRow}>
                {MEAS.map(me => {
                  const on = data[`${me.key}_${p}`] != null;
                  const active = activeKey === me.key && activePort === port && !on;
                  return (
                    <Led key={me.key} on={on} active={active}
                         color={colors[me.colorKey]} label={me.label} colors={colors} />
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 12, borderWidth: 1, marginBottom: 10, overflow: 'hidden' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 9, borderBottomWidth: 1,
  },
  title: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  sub: { fontSize: 9, fontWeight: '600' },
  body: { paddingHorizontal: 12, paddingVertical: 10 },
  portRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  portTag: { width: 44, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  ledRow: { flexDirection: 'row', flex: 1, justifyContent: 'space-around' },
  ledItem: { alignItems: 'center' },
  ledOuter: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginBottom: 3 },
  ledInner: { width: 12, height: 12, borderRadius: 6 },
  ledLabel: { fontSize: 8, fontWeight: '700', letterSpacing: 0.3 },
});
