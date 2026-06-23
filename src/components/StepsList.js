import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../constants/theme';

const STEPS = [
  { num: 1, text: 'Tension de repos', colorKey: 'sectionVoltage', key: 'TR' },
  { num: 2, text: 'Courant de ligne', colorKey: 'sectionCurrent', key: 'CL' },
  { num: 3, text: 'Sonnerie',         colorKey: 'sectionDial',    key: 'RING' },
  { num: 4, text: 'Transmission',     colorKey: 'sectionAudio',   key: 'TRANS' },
];
const ORDER = { TR: 1, CL: 2, RING: 3, TRANS: 4 };

export default function StepsList({ currentStep, status, data }) {
  const { colors } = useTheme();
  const stepPasses = [data.pass_tr, data.pass_cl, data.pass_alarm, data.pass_trans];

  // Étape active déduite du statut par-port (ex. "TR_FXS1", "TRANS_FXS2").
  const m = /^(TR|CL|RING|TRANS)_FXS\d$/.exec(status || '');
  const activeIdx = m ? ORDER[m[1]] : (status === 'DONE' ? 4 : 0);

  return (
    <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.borderColor }]}>
      <View style={[styles.cardTopBar, { backgroundColor: colors.accent }]} />
      <View style={[styles.header, { borderBottomColor: colors.borderColor }]}>
        <Text style={[styles.title, { color: colors.accent }]}>SÉQUENCE DE TEST</Text>
        <Text style={[styles.stepCount, { color: colors.cyan }]}>{Math.min(activeIdx, 4)}/4</Text>
      </View>
      <View style={styles.body}>
        {STEPS.map((s, idx) => {
          const sColor = colors[s.colorKey];
          const pass = stepPasses[idx];
          const isActive = activeIdx === s.num && status !== 'DONE';
          const isDone = (status === 'DONE') || (!isActive && pass != null) || activeIdx > s.num;
          const isFail = isDone && pass === false;

          let bgColor = 'transparent', borderColor = 'transparent';
          let indicatorColor = colors.idleGray;
          let resultText = '', resultColor = colors.textMuted;

          if (isActive) {
            bgColor = sColor + '0C'; borderColor = sColor + '50';
            indicatorColor = sColor; resultText = '...'; resultColor = sColor;
          } else if (isFail) {
            bgColor = colors.failRed + '0A'; borderColor = colors.failRed + '40';
            indicatorColor = colors.failRed; resultText = 'FAIL'; resultColor = colors.failRed;
          } else if (isDone) {
            bgColor = colors.passGreen + '0A'; borderColor = colors.passGreen + '40';
            indicatorColor = colors.passGreen; resultText = 'PASS'; resultColor = colors.passGreen;
          }

          return (
            <View key={s.num} style={[styles.step, { backgroundColor: bgColor, borderColor }]}>
              <View style={[styles.stepColorBar, { backgroundColor: sColor }]} />
              <View style={[styles.stepDot, { backgroundColor: indicatorColor, marginRight: 10, marginLeft: 8 }]}>
                <Text style={styles.stepDotText}>{isDone ? (isFail ? '✕' : '✓') : s.num}</Text>
              </View>
              <Text style={[styles.stepText, { color: colors.textSecondary, flex: 1 }]}>{s.text}</Text>
              <Text style={[styles.stepResult, { color: resultColor }]}>{resultText}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 12, borderWidth: 1, marginBottom: 10, overflow: 'hidden' },
  cardTopBar: { height: 3 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1,
  },
  title: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  stepCount: { fontSize: 11, fontWeight: '800', fontFamily: 'monospace' },
  body: { padding: 8 },
  step: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingRight: 10,
    borderRadius: 8, borderWidth: 1, marginBottom: 4, overflow: 'hidden',
  },
  stepColorBar: { width: 3, height: '100%', position: 'absolute', left: 0, top: 0, bottom: 0 },
  stepDot: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  stepDotText: { fontSize: 10, fontWeight: '800', color: '#fff' },
  stepText: { fontSize: 12, fontWeight: '600' },
  stepResult: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
});
