import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../constants/theme';

// Consommation = mesure NIVEAU GATEWAY (valeur unique, pas par port FXS1/FXS2).
// Reçoit data.conso_w ; le verdict PASS/FAIL est recalculé à partir de [lo..hi]
// (mêmes bornes que le backend : 7-20 W).
export default function ConsoCard({ title, unit, range, value, lo, hi, accent }) {
  const { colors } = useTheme();
  const a = accent || colors.sectionPower;
  const ok = value != null ? (value >= lo && value <= hi) : null;
  const vColor = ok === true ? colors.passGreen
               : ok === false ? colors.failRed : colors.textPrimary;
  // Bande [lo..hi] centrée sur la barre (même rendu que DualPortCard).
  const span = hi - lo;
  const pct = value != null
    ? Math.min(100, Math.max(0, ((value - (lo - span)) / (span * 3)) * 100))
    : 0;

  return (
    <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: a + '40' }]}>
      <View style={[styles.accent, { backgroundColor: a }]} />
      <View style={[styles.header, { borderBottomColor: colors.borderColor }]}>
        <Text style={[styles.title, { color: a }]}>{title}</Text>
        <Text style={[styles.range, { color: colors.textMuted }]}>{range}</Text>
      </View>
      <View style={styles.body}>
        <Text style={[styles.gw, { color: colors.textMuted }]}>GATEWAY</Text>
        <Text style={[styles.val, { color: vColor }]}>
          {value != null ? value.toFixed(2) : '---'}
          <Text style={[styles.unit, { color: colors.textMuted }]}> {unit}</Text>
        </Text>
        <View style={[styles.bar, { backgroundColor: colors.gaugeBg }]}>
          <View style={[styles.barFill, {
            width: `${pct}%`,
            backgroundColor: ok === false ? colors.failRed
                           : ok === true ? colors.passGreen : colors.idleGray,
          }]} />
        </View>
        <Text style={[styles.res, { color: vColor }]}>
          {ok === true ? 'PASS' : ok === false ? 'FAIL' : '--'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 12, borderWidth: 1, marginBottom: 10, overflow: 'hidden' },
  accent: { height: 3 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 9, borderBottomWidth: 1,
  },
  title: { fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  range: { fontSize: 9, fontWeight: '600' },
  body: { alignItems: 'center', paddingVertical: 12 },
  gw: { fontSize: 9, fontWeight: '800', letterSpacing: 1, marginBottom: 2 },
  val: { fontSize: 26, fontWeight: '900', fontFamily: 'monospace' },
  unit: { fontSize: 10, fontWeight: '600' },
  bar: { height: 5, borderRadius: 3, width: '74%', overflow: 'hidden', marginTop: 8 },
  barFill: { height: '100%', borderRadius: 3 },
  res: { fontSize: 10, fontWeight: '900', letterSpacing: 1, marginTop: 6 },
});
