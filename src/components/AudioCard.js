import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

function FreqRow({ freq, value }) {
  // value is already in dB (backend converts via 20*log10(V/0.7746))
  const ok = value != null ? (value >= 8.1 && value <= 10.1) : null;
  const color = ok === true ? COLORS.passGreen : ok === false ? COLORS.failRed : COLORS.accentCyan;
  const display = value != null ? value.toFixed(2) : '---';
  // Scale 0-20 dB for the visual bar
  let barPct = 0;
  if (value != null) barPct = Math.min(100, Math.max(0, (value / 20) * 100));

  return (
    <View style={styles.freqItem}>
      <View style={styles.freqHeader}>
        <Text style={styles.freqLabel}>{freq} Hz</Text>
        <Text style={[styles.freqValue, { color }]}>
          {display}<Text style={styles.unit}> dB</Text>
        </Text>
      </View>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${barPct}%`,
          backgroundColor: ok === true ? COLORS.passGreen : ok === false ? COLORS.failRed : COLORS.accentCyan }]} />
      </View>
    </View>
  );
}

export default function AudioCard({ data, pass, currentStep, status }) {
  let indicatorColor = COLORS.idleGray;
  if (currentStep === 5 && status !== 'DONE') indicatorColor = COLORS.accentCyan;
  else if (pass === true) indicatorColor = COLORS.passGreen;
  else if (pass === false) indicatorColor = COLORS.failRed;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>5. AUDIO (BS2)</Text>
        <View style={[styles.indicator, { backgroundColor: indicatorColor }]} />
      </View>
      <View style={styles.body}>
        <FreqRow freq="300" value={data.trans_300} />
        <FreqRow freq="1000" value={data.trans_1000} />
        <FreqRow freq="3400" value={data.trans_3400} />
        <View style={styles.resultRow}>
          <Text style={styles.rangeText}>[8.1 - 10.1] dB</Text>
          <Text style={[styles.result, {
            color: pass === true ? COLORS.passGreen : pass === false ? COLORS.failRed : COLORS.textMuted
          }]}>{pass === true ? 'PASS' : pass === false ? 'FAIL' : '--'}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.bgCard, borderRadius: 12, borderWidth: 1, borderColor: COLORS.borderColor, marginBottom: 10, overflow: 'hidden' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.borderColor },
  title: { fontSize: 11, fontWeight: '800', color: COLORS.textSecondary, letterSpacing: 1 },
  indicator: { width: 8, height: 8, borderRadius: 4 },
  body: { padding: 14 },
  freqItem: { marginBottom: 12 },
  freqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  freqLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '700', letterSpacing: 0.5 },
  freqValue: { fontFamily: 'monospace', fontSize: 16, fontWeight: '700' },
  unit: { fontSize: 10, color: COLORS.textMuted },
  barBg: { height: 4, backgroundColor: COLORS.gaugeBg, borderRadius: 2, overflow: 'hidden', marginTop: 5 },
  barFill: { height: '100%', borderRadius: 2 },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, paddingTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.04)' },
  rangeText: { fontSize: 9, color: COLORS.textMuted, fontFamily: 'monospace' },
  result: { fontSize: 11, fontWeight: '800', letterSpacing: 1 },
});
