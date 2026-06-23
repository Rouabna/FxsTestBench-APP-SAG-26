import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../constants/theme';

export default function MeasurementDisplay({ value, unit, color }) {
  const { colors } = useTheme();
  const isNumeric = value !== '---' && value !== null;

  return (
    <View style={styles.container}>
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color: isNumeric ? color : colors.textMuted }]}>
          {value}
        </Text>
        <Text style={[styles.unit, { color: colors.textMuted, marginLeft: 6 }]}>{unit}</Text>
      </View>
      {isNumeric && (
        <View style={[styles.glowBar, { backgroundColor: color + '30' }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 12 },
  valueRow: { flexDirection: 'row', alignItems: 'baseline' },
  value: { fontSize: 46, fontWeight: '900', fontFamily: 'monospace', letterSpacing: -1 },
  unit: { fontSize: 15, fontWeight: '700' },
  glowBar: { width: '60%', height: 3, borderRadius: 2, marginTop: 6 },
});
