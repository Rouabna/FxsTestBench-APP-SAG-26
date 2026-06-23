import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export default function GaugeCard({ title, value, unit, pass, range, activeStep, currentStep, status }) {
  let indicatorColor = COLORS.idleGray;
  if (currentStep === activeStep && status !== 'DONE') indicatorColor = COLORS.accentCyan;
  else if (pass === true) indicatorColor = COLORS.passGreen;
  else if (pass === false) indicatorColor = COLORS.failRed;

  let valueColor = COLORS.accentCyan;
  if (pass === true) valueColor = COLORS.passGreen;
  else if (pass === false) valueColor = COLORS.failRed;

  const displayValue = value != null ? value.toFixed(2) : '---';

  let barPct = 0;
  if (value != null && range) {
    const span = range.max * 1.5 - range.min * 0.5;
    barPct = Math.min(100, Math.max(0, ((value - range.min * 0.5) / span) * 100));
  }

  let barColor = COLORS.accentCyan;
  if (pass === true) barColor = COLORS.passGreen;
  else if (pass === false) barColor = COLORS.failRed;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.indicator, { backgroundColor: indicatorColor }]} />
      </View>
      <View style={styles.body}>
        <View style={styles.row}>
          <Text style={styles.label}>{unit}</Text>
          <Text style={[styles.value, { color: valueColor }]}>
            {displayValue}<Text style={styles.unit}> {unit}</Text>
          </Text>
        </View>
        <View style={styles.barBg}>
          <View style={[styles.barFill, { width: `${barPct}%`, backgroundColor: barColor }]} />
        </View>
        {range && (
          <View style={styles.row}>
            <Text style={styles.rangeText}>[{range.min} - {range.max}] {unit}</Text>
            <Text style={[styles.result, {
              color: pass === true ? COLORS.passGreen : pass === false ? COLORS.failRed : COLORS.textMuted
            }]}>
              {pass === true ? 'PASS' : pass === false ? 'FAIL' : '--'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.bgCard, borderRadius: 12, borderWidth: 1, borderColor: COLORS.borderColor, marginBottom: 10, overflow: 'hidden' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.borderColor },
  title: { fontSize: 11, fontWeight: '800', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 1 },
  indicator: { width: 8, height: 8, borderRadius: 4 },
  body: { padding: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 3 },
  label: { fontSize: 10, color: COLORS.textMuted, textTransform: 'uppercase' },
  value: { fontFamily: 'monospace', fontSize: 22, fontWeight: '700' },
  unit: { fontSize: 11, color: COLORS.textMuted },
  barBg: { height: 5, backgroundColor: COLORS.gaugeBg, borderRadius: 3, overflow: 'hidden', marginVertical: 6 },
  barFill: { height: '100%', borderRadius: 3 },
  rangeText: { fontSize: 9, color: COLORS.textMuted, fontFamily: 'monospace' },
  result: { fontSize: 11, fontWeight: '800', letterSpacing: 1 },
});
