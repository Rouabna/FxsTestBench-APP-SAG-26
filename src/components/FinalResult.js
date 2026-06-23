import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export default function FinalResult({ status, final: finalResult, timestamp }) {
  let text = 'EN ATTENTE';
  let textColor = COLORS.idleGray;
  let borderColor = COLORS.borderColor;
  let sub = 'Appuyez sur START pour lancer';

  if (status === 'DONE') {
    text = finalResult ? 'PASS' : 'FAIL';
    textColor = finalResult ? COLORS.passGreen : COLORS.failRed;
    borderColor = textColor;
    sub = timestamp || '';
  } else if (status === 'ERROR') {
    text = 'ERREUR'; textColor = COLORS.failRed;
    borderColor = COLORS.failRed; sub = 'Erreur durant le test';
  } else if (status !== 'IDLE') {
    text = 'TEST EN COURS'; textColor = COLORS.accentCyan;
    borderColor = COLORS.accentCyan; sub = '';
  }

  return (
    <View style={[styles.container, { borderColor }]}>
      <Text style={[styles.text, { color: textColor }]}>{text}</Text>
      {sub ? <Text style={styles.sub}>{sub}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12, backgroundColor: COLORS.bgCard,
    borderWidth: 2, padding: 24, alignItems: 'center', marginBottom: 10,
  },
  text: { fontSize: 36, fontWeight: '900', letterSpacing: 4 },
  sub: { fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
});
