import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';
import { apiHistory } from '../services/socket';

export default function HistoryTable({ refreshKey }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    apiHistory().then(data => setHistory(Array.isArray(data) ? data.reverse() : [])).catch(() => {});
  }, [refreshKey]);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>HISTORIQUE ({history.length})</Text>
      </View>
      <View style={styles.body}>
        {history.length === 0 ? (
          <Text style={styles.empty}>Aucun test effectué</Text>
        ) : (
          <>
            <View style={styles.row}>
              <Text style={[styles.cell, styles.cellHeader, { flex: 2 }]}>Date</Text>
              <Text style={[styles.cell, styles.cellHeader]}>V</Text>
              <Text style={[styles.cell, styles.cellHeader]}>mA</Text>
              <Text style={[styles.cell, styles.cellHeader]}>mW</Text>
              <Text style={[styles.cell, styles.cellHeader, { flex: 0.8 }]}>Res.</Text>
            </View>
            {history.slice(0, 10).map((h, idx) => (
              <View key={idx} style={[styles.row, idx % 2 === 0 && styles.rowAlt]}>
                <Text style={[styles.cell, { flex: 2, fontSize: 8 }]}>{h.timestamp || '-'}</Text>
                <Text style={styles.cell}>{h.tr != null ? h.tr.toFixed(1) : '-'}</Text>
                <Text style={styles.cell}>{h.cl != null ? (h.cl * 1000).toFixed(1) : '-'}</Text>
                <Text style={styles.cell}>{h.power != null ? (h.power * 1000).toFixed(0) : '-'}</Text>
                <Text style={[styles.cell, { flex: 0.8, color: h.final ? COLORS.passGreen : COLORS.failRed, fontWeight: '800' }]}>
                  {h.final ? 'PASS' : 'FAIL'}
                </Text>
              </View>
            ))}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.bgCard, borderRadius: 12, borderWidth: 1, borderColor: COLORS.borderColor, marginBottom: 10, overflow: 'hidden' },
  header: { paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.borderColor },
  title: { fontSize: 10, fontWeight: '800', color: COLORS.textSecondary, letterSpacing: 1.5 },
  body: { padding: 8 },
  empty: { textAlign: 'center', color: COLORS.textMuted, fontSize: 11, paddingVertical: 18 },
  row: { flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.03)' },
  rowAlt: { backgroundColor: 'rgba(255,255,255,0.015)' },
  cell: { flex: 1, fontSize: 9, fontFamily: 'monospace', color: COLORS.textSecondary },
  cellHeader: { fontWeight: '700', color: COLORS.textMuted, fontSize: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
});
