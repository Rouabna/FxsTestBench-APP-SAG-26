import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../constants/theme';

const FREQS = [
  { key: '300', label: '300Hz' },
  { key: '1000', label: '1000Hz' },
  { key: '3400', label: '3400Hz' },
];

export default function FrequencySelector({ selected, onSelect }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bgCard, borderColor: colors.borderColor }]}>
      <View style={styles.header}>
        <View style={[styles.headerDot, { backgroundColor: colors.accent }]} />
        <Text style={[styles.title, { color: colors.textMuted, marginLeft: 6 }]}>TEST FREQUENCY :</Text>
      </View>
      <View style={styles.freqRow}>
        {FREQS.map((f, i) => {
          const active = selected === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              style={[styles.freqBtn, {
                borderColor: active ? colors.accent : 'transparent',
                backgroundColor: active ? colors.accent + '12' : 'rgba(255,255,255,0.02)',
              }, i > 0 && { marginLeft: 8 }]}
              onPress={() => onSelect(f.key)}
              activeOpacity={0.7}
            >
              <View style={[styles.radio, { borderColor: active ? colors.accent : colors.textMuted }]}>
                {active && <View style={[styles.radioInner, { backgroundColor: colors.accent }]} />}
              </View>
              <Text style={[styles.freqLabel, {
                color: active ? colors.accent : colors.textMuted, marginLeft: 6,
              }]}>{f.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 10, padding: 10, marginBottom: 10, borderWidth: 1 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  headerDot: { width: 5, height: 5, borderRadius: 3 },
  title: { fontSize: 9, fontWeight: '800', letterSpacing: 1.5 },
  freqRow: { flexDirection: 'row' },
  freqBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 8, paddingHorizontal: 6, borderRadius: 8, borderWidth: 1,
  },
  radio: {
    width: 14, height: 14, borderRadius: 7, borderWidth: 2,
    justifyContent: 'center', alignItems: 'center',
  },
  radioInner: { width: 6, height: 6, borderRadius: 3 },
  freqLabel: { fontSize: 11, fontWeight: '700' },
});
