import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../constants/theme';

export default function StatsBar({ total, passed, failed }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bgCard, borderColor: colors.borderColor }]}>
      <View style={styles.stat}>
        <View style={[styles.statIconBox, { backgroundColor: colors.accent + '18' }]}>
          <Text style={[styles.statIcon, { color: colors.accent }]}>Σ</Text>
        </View>
        <Text style={[styles.value, { color: colors.accent }]}>{total}</Text>
        <Text style={[styles.label, { color: colors.textMuted }]}>TOTAL</Text>
      </View>
      <View style={[styles.divider, { backgroundColor: colors.borderColor }]} />
      <View style={styles.stat}>
        <View style={[styles.statIconBox, { backgroundColor: colors.passGreen + '18' }]}>
          <Text style={[styles.statIcon, { color: colors.passGreen }]}>✓</Text>
        </View>
        <Text style={[styles.value, { color: colors.passGreen }]}>{passed}</Text>
        <Text style={[styles.label, { color: colors.textMuted }]}>PASSED</Text>
      </View>
      <View style={[styles.divider, { backgroundColor: colors.borderColor }]} />
      <View style={styles.stat}>
        <View style={[styles.statIconBox, { backgroundColor: colors.failRed + '18' }]}>
          <Text style={[styles.statIcon, { color: colors.failRed }]}>✕</Text>
        </View>
        <Text style={[styles.value, { color: colors.failRed }]}>{failed}</Text>
        <Text style={[styles.label, { color: colors.textMuted }]}>FAILED</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, alignItems: 'center' },
  stat: { flex: 1, alignItems: 'center' },
  statIconBox: { width: 24, height: 24, borderRadius: 6, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  statIcon: { fontSize: 12, fontWeight: '900' },
  label: { fontSize: 7, fontWeight: '700', letterSpacing: 1, marginTop: 2 },
  value: { fontSize: 20, fontWeight: '900', fontFamily: 'monospace' },
  divider: { width: 1, height: 40 },
});
