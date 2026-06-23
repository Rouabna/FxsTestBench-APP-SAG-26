import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../constants/theme';
import { apiHistory } from '../services/socket';

export default function MiniHistory({ data }) {
  const { colors } = useTheme();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    apiHistory().then(d => setHistory(Array.isArray(d) ? d.reverse() : [])).catch(() => {});
  }, [data.status === 'DONE' ? data.timestamp : null]);

  return (
    <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.borderColor }]}>
      <View style={[styles.header, { borderBottomColor: colors.borderColor }]}>
        <Text style={[styles.title, { color: colors.textSecondary }]}>HISTORIQUE RÉCENT</Text>
        <Text style={[styles.count, { color: colors.textMuted }]}>{history.length} tests</Text>
      </View>
      <View style={styles.body}>
        {history.length === 0 ? (
          <Text style={[styles.empty, { color: colors.textMuted }]}>Aucun test effectué</Text>
        ) : (
          history.slice(0, 6).map((h, idx) => (
            <View key={idx} style={[styles.row, idx % 2 === 0 && { backgroundColor: colors.bgCardAlt + '40' }]}>
              <View style={[styles.dot, { backgroundColor: h.final ? colors.passGreen : colors.failRed, marginRight: 8 }]} />
              <Text style={[styles.time, { color: colors.textMuted, flex: 2 }]}>{h.timestamp || '-'}</Text>
              <Text style={[styles.val, { color: colors.textSecondary, flex: 1, textAlign: 'right' }]}>
                {h.trans_1000 != null ? h.trans_1000.toFixed(1) + ' dB' : '--'}
              </Text>
              <Text style={[styles.ia, {
                color: h.ai_atypical === 1 ? colors.warnOrange
                     : h.ai_atypical === 0 ? colors.passGreen : colors.textMuted,
              }]}>{h.ai_atypical === 1 ? 'IA!' : h.ai_atypical === 0 ? 'IA' : '–'}</Text>
              <Text style={[styles.result, {
                color: h.final ? colors.passGreen : colors.failRed, marginLeft: 8,
              }]}>{h.final ? 'PASS' : 'FAIL'}</Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 12, borderWidth: 1, marginBottom: 10, overflow: 'hidden' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1,
  },
  title: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  count: { fontSize: 9, fontWeight: '600' },
  body: { padding: 6 },
  empty: { textAlign: 'center', fontSize: 11, paddingVertical: 16 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 7, paddingHorizontal: 8, borderRadius: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  time: { fontSize: 9, fontFamily: 'monospace' },
  val: { fontSize: 10, fontFamily: 'monospace', fontWeight: '700' },
  ia: { fontSize: 8, fontWeight: '900', letterSpacing: 0.5, width: 26, textAlign: 'right', marginLeft: 6 },
  result: { fontSize: 9, fontWeight: '900', letterSpacing: 1, width: 32, textAlign: 'right' },
});
