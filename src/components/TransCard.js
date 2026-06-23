import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../constants/theme';

// Transmission : FXS1 & FXS2 × 300/1000/3400 Hz. PASS/FAIL sur le 1000 Hz (spec Sagem).
const TRANS_LO = 8.1, TRANS_HI = 10.1;

function Row({ port, data, colors }) {
  const p = port.toLowerCase();
  const cell = (f) => {
    const v = data[`trans_${f}_${p}`];
    const ok = f === '1000' && v != null ? (v >= TRANS_LO && v <= TRANS_HI) : null;
    const color = ok === true ? colors.passGreen : ok === false ? colors.failRed : colors.textSecondary;
    return (
      <Text key={f} style={[styles.cell, { color }]}>
        {v != null ? v.toFixed(2) : '---'}
      </Text>
    );
  };
  const v1k = data[`trans_1000_${p}`];
  const ok = v1k != null ? (v1k >= TRANS_LO && v1k <= TRANS_HI) : null;
  return (
    <View style={styles.row}>
      <Text style={[styles.port, { color: colors.textMuted }]}>{port}</Text>
      {cell('300')}{cell('1000')}{cell('3400')}
      <Text style={[styles.res, {
        color: ok === true ? colors.passGreen : ok === false ? colors.failRed : colors.textMuted,
      }]}>{ok === true ? 'PASS' : ok === false ? 'FAIL' : '--'}</Text>
    </View>
  );
}

export default function TransCard({ data }) {
  const { colors } = useTheme();
  const a = colors.sectionAudio;
  return (
    <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: a + '40' }]}>
      <View style={[styles.accent, { backgroundColor: a }]} />
      <View style={[styles.header, { borderBottomColor: colors.borderColor }]}>
        <Text style={[styles.title, { color: a }]}>TRANSMISSION (atténuation, dB)</Text>
        <Text style={[styles.range, { color: colors.textMuted }]}>1000 Hz : [8.1 - 10.1]</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.head}>
          <Text style={[styles.hPort, { color: colors.textMuted }]}>PORT</Text>
          <Text style={[styles.hCell, { color: colors.textMuted }]}>300</Text>
          <Text style={[styles.hCell, { color: colors.textMuted }]}>1000</Text>
          <Text style={[styles.hCell, { color: colors.textMuted }]}>3400</Text>
          <Text style={[styles.hRes, { color: colors.textMuted }]}></Text>
        </View>
        <Row port="FXS1" data={data} colors={colors} />
        <Row port="FXS2" data={data} colors={colors} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 12, borderWidth: 1, marginBottom: 10, overflow: 'hidden' },
  accent: { height: 3 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 9, borderBottomWidth: 1,
  },
  title: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  range: { fontSize: 9, fontWeight: '600' },
  body: { paddingHorizontal: 10, paddingVertical: 8 },
  head: { flexDirection: 'row', alignItems: 'center', paddingBottom: 6 },
  hPort: { width: 44, fontSize: 8, fontWeight: '800', letterSpacing: 0.5 },
  hCell: { flex: 1, fontSize: 8, fontWeight: '800', textAlign: 'center' },
  hRes: { width: 38 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 7 },
  port: { width: 44, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  cell: { flex: 1, fontSize: 13, fontWeight: '700', fontFamily: 'monospace', textAlign: 'center' },
  res: { width: 38, fontSize: 9, fontWeight: '900', textAlign: 'right' },
});
