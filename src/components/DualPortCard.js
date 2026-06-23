import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../constants/theme';

// Une mesure affichée pour FXS1 ET FXS2 côte à côte (même gateway).
function PortCol({ label, value, unit, lo, hi, colors }) {
  const ok = value != null ? (value >= lo && value <= hi) : null;
  const vColor = ok === true ? colors.passGreen
               : ok === false ? colors.failRed : colors.textPrimary;
  // Bande [lo..hi] centrée sur la barre (même rendu que le dashboard web).
  const span = hi - lo;
  const pct = value != null
    ? Math.min(100, Math.max(0, ((value - (lo - span)) / (span * 3)) * 100))
    : 0;
  return (
    <View style={styles.col}>
      <Text style={[styles.port, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.val, { color: vColor }]}>
        {value != null ? value.toFixed(2) : '---'}
      </Text>
      <Text style={[styles.unit, { color: colors.textMuted }]}>{unit}</Text>
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
  );
}

export default function DualPortCard({ title, unit, range, fxs1, fxs2, lo, hi, accent }) {
  const { colors } = useTheme();
  const a = accent || colors.cyan;
  return (
    <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: a + '40' }]}>
      <View style={[styles.accent, { backgroundColor: a }]} />
      <View style={[styles.header, { borderBottomColor: colors.borderColor }]}>
        <Text style={[styles.title, { color: a }]}>{title}</Text>
        <Text style={[styles.range, { color: colors.textMuted }]}>{range}</Text>
      </View>
      <View style={styles.row}>
        <PortCol label="FXS1" value={fxs1} unit={unit} lo={lo} hi={hi} colors={colors} />
        <View style={[styles.divider, { backgroundColor: colors.borderColor }]} />
        <PortCol label="FXS2" value={fxs2} unit={unit} lo={lo} hi={hi} colors={colors} />
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
  row: { flexDirection: 'row', alignItems: 'stretch', paddingVertical: 10 },
  col: { flex: 1, alignItems: 'center' },
  divider: { width: 1, marginVertical: 4 },
  port: { fontSize: 9, fontWeight: '800', letterSpacing: 1, marginBottom: 2 },
  val: { fontSize: 24, fontWeight: '900', fontFamily: 'monospace' },
  unit: { fontSize: 9, fontWeight: '600', marginTop: 1 },
  bar: { height: 5, borderRadius: 3, width: '74%', overflow: 'hidden', marginTop: 7 },
  barFill: { height: '100%', borderRadius: 3 },
  res: { fontSize: 10, fontWeight: '900', letterSpacing: 1, marginTop: 5 },
});
