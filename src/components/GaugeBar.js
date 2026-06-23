import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../constants/theme';

export default function GaugeBar({ value, min, max, greenMin, greenMax, unit }) {
  const { colors } = useTheme();
  const range = max - min;
  const pct = value != null ? Math.min(100, Math.max(0, ((value - min) / range) * 100)) : 0;
  const greenMinPct = ((greenMin - min) / range) * 100;
  const greenMaxPct = ((greenMax - min) / range) * 100;
  const isInRange = value != null && value >= greenMin && value <= greenMax;
  const fillColor = value == null ? colors.idleGray : isInRange ? colors.passGreen : colors.failRed;

  return (
    <View style={styles.container}>
      <View style={[styles.barBg, { backgroundColor: colors.gaugeBg, borderColor: colors.borderColor + '60' }]}>
        <View style={[styles.greenZone, { left: `${greenMinPct}%`, width: `${greenMaxPct - greenMinPct}%` }]} />
        <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: fillColor }]} />
        {value != null && (
          <View style={[styles.pointer, { left: `${pct}%` }]}>
            <View style={[styles.pointerTri, { borderBottomColor: fillColor }]} />
          </View>
        )}
      </View>
      <View style={styles.rangeRow}>
        <Text style={[styles.rangeText, { color: colors.textMuted }]}>{min.toFixed(2)}</Text>
        <Text style={[styles.rangeText, { color: colors.passGreen }]}>
          {greenMin.toFixed(2)} - {greenMax.toFixed(2)} {unit}
        </Text>
        <Text style={[styles.rangeText, { color: colors.textMuted }]}>{max.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 14, paddingBottom: 8 },
  barBg: { height: 10, borderRadius: 5, overflow: 'visible', position: 'relative', borderWidth: 1 },
  greenZone: { position: 'absolute', top: 0, bottom: 0, backgroundColor: 'rgba(52,211,153,0.15)', borderRadius: 5 },
  barFill: { height: '100%', borderRadius: 5, opacity: 0.8 },
  pointer: { position: 'absolute', top: -6, marginLeft: -4 },
  pointerTri: { width: 0, height: 0, borderLeftWidth: 4, borderRightWidth: 4, borderBottomWidth: 5, borderLeftColor: 'transparent', borderRightColor: 'transparent' },
  rangeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  rangeText: { fontSize: 8, fontFamily: 'monospace' },
});
