import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, STATUS_LABELS } from '../constants/theme';

export default function ProgressBar({ step, totalSteps, status }) {
  const pct = status === 'DONE' ? 100 : ((step || 0) / (totalSteps || 5)) * 100;

  let barColor = COLORS.accentCyan;
  if (status === 'DONE') barColor = COLORS.passGreen;
  if (status === 'ERROR') barColor = COLORS.failRed;

  return (
    <View style={styles.container}>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: barColor }]} />
      </View>
      <Text style={styles.label}>{STATUS_LABELS[status] || status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingVertical: 8 },
  barBg: { height: 4, backgroundColor: COLORS.gaugeBg, borderRadius: 2, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 2 },
  label: { textAlign: 'center', fontSize: 9, color: COLORS.textMuted, marginTop: 4, letterSpacing: 0.8 },
});
