import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export default function StatusBadge({ status, finalResult }) {
  let color = COLORS.idleGray;
  let label = status;

  if (status === 'DONE' && finalResult === true) {
    color = COLORS.passGreen; label = 'PASS';
  } else if (status === 'DONE' && finalResult === false) {
    color = COLORS.failRed; label = 'FAIL';
  } else if (status === 'ERROR') {
    color = COLORS.warnOrange;
  } else if (status !== 'IDLE') {
    color = COLORS.accentCyan; label = 'RUNNING';
  }

  return (
    <View style={[styles.badge, { borderColor: color, backgroundColor: color + '15' }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: 12, borderWidth: 1.5,
  },
  text: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
});
