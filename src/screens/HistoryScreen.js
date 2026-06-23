import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../constants/theme';

export default function HistoryScreen({ history }) {
  const { colors } = useTheme();
  const [filter, setFilter] = useState('ALL');

  // final = INTEGER 1/0 depuis SQLite (pas booléen JS) -> tolérer les deux.
  const isPass = (h) => h.final === true || h.final === 1;
  const isFail = (h) => h.final === false || h.final === 0;

  const filtered = history.filter(h => {
    if (filter === 'PASS') return isPass(h);
    if (filter === 'FAIL') return isFail(h);
    return true;
  });

  const totalPass = history.filter(isPass).length;
  const totalFail = history.filter(isFail).length;
  const rate = history.length > 0 ? ((totalPass / history.length) * 100).toFixed(0) : '--';

  const statConfigs = [
    { val: String(history.length), label: 'TOTAL', color: colors.accent, border: colors.accent + '30' },
    { val: String(totalPass), label: 'PASS', color: colors.passGreen, border: colors.passGreen + '30' },
    { val: String(totalFail), label: 'FAIL', color: colors.failRed, border: colors.failRed + '30' },
    { val: rate + '%', label: 'TAUX', color: colors.purple, border: colors.purple + '30' },
  ];

  const filterConfigs = [
    { key: 'ALL', label: `TOUS (${history.length})`, color: colors.accent },
    { key: 'PASS', label: `PASS (${totalPass})`, color: colors.passGreen },
    { key: 'FAIL', label: `FAIL (${totalFail})`, color: colors.failRed },
  ];

  return (
    <View style={{ flex: 1, padding: 12 }}>
      {/* STATS */}
      <View style={styles.statsRow}>
        {statConfigs.map((s, i) => (
          <View key={i} style={[styles.statBox, { backgroundColor: colors.bgCard, borderColor: s.border, marginLeft: i > 0 ? 8 : 0 }]}>
            <View style={[styles.statAccent, { backgroundColor: s.color }]} />
            <Text style={[styles.statValue, { color: s.color }]}>{s.val}</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* FILTERS - colored */}
      <View style={[styles.filterRow, { backgroundColor: colors.bgCard, borderColor: colors.borderColor }]}>
        {filterConfigs.map((f, i) => (
          <TouchableOpacity key={f.key}
            style={[styles.filterBtn, filter === f.key && { backgroundColor: f.color }, { marginLeft: i > 0 ? 3 : 0 }]}
            onPress={() => setFilter(f.key)}>
            <Text style={[styles.filterText, { color: filter === f.key ? '#fff' : colors.textMuted }]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LIST */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 60 }}>
            <Text style={{ fontSize: 30, marginBottom: 8 }}>☐</Text>
            <Text style={{ fontSize: 13, color: colors.textMuted }}>Aucun test dans l'historique</Text>
          </View>
        ) : (
          filtered.map((h, idx) => {
            const passed = isPass(h);
            const rc = passed ? colors.passGreen : colors.failRed;
            return (
              <View key={idx} style={[styles.item, { backgroundColor: colors.bgCard, borderColor: colors.borderColor }]}>
                {/* Colored left border */}
                <View style={[styles.itemLeftBar, { backgroundColor: rc }]} />
                <View style={styles.itemBody}>
                  <View style={styles.itemTop}>
                    <Text style={[styles.time, { color: colors.textPrimary }]}>{h.timestamp || 'N/A'}</Text>
                    <View style={[styles.resBadge, { backgroundColor: rc + '18', borderColor: rc }]}>
                      <Text style={[styles.resText, { color: rc }]}>{passed ? 'PASS' : 'FAIL'}</Text>
                    </View>
                  </View>
                  {/* Values with colored labels (V / mA / mW / V RMS) */}
                  <View style={styles.valRow}>
                    {h.tr != null && (
                      <View style={[styles.valChip, { backgroundColor: colors.sectionVoltage + '12' }]}>
                        <Text style={[styles.valChipLabel, { color: colors.sectionVoltage }]}>V</Text>
                        <Text style={[styles.valChipVal, { color: colors.textSecondary }]}>{h.tr.toFixed(1)}</Text>
                      </View>
                    )}
                    {h.cl != null && (
                      <View style={[styles.valChip, { backgroundColor: colors.sectionCurrent + '12', marginLeft: 4 }]}>
                        <Text style={[styles.valChipLabel, { color: colors.sectionCurrent }]}>mA</Text>
                        <Text style={[styles.valChipVal, { color: colors.textSecondary }]}>{(h.cl*1000).toFixed(1)}</Text>
                      </View>
                    )}
                    {h.power != null && (
                      <View style={[styles.valChip, { backgroundColor: colors.sectionPower + '12', marginLeft: 4 }]}>
                        <Text style={[styles.valChipLabel, { color: colors.sectionPower }]}>mW</Text>
                        <Text style={[styles.valChipVal, { color: colors.textSecondary }]}>{(h.power*1000).toFixed(0)}</Text>
                      </View>
                    )}
                    {h.alarm_rms != null && (
                      <View style={[styles.valChip, { backgroundColor: colors.sectionDial + '12', marginLeft: 4 }]}>
                        <Text style={[styles.valChipLabel, { color: colors.sectionDial }]}>RMS</Text>
                        <Text style={[styles.valChipVal, { color: colors.textSecondary }]}>{h.alarm_rms.toFixed(1)}</Text>
                      </View>
                    )}
                  </View>
                  {/* Audio row — values in dB */}
                  {(h.trans_300 != null || h.trans_1000 != null) && (
                    <View style={[styles.valRow, { marginTop: 4 }]}>
                      {h.trans_300 != null && (
                        <View style={[styles.valChip, { backgroundColor: colors.sectionAudio + '12' }]}>
                          <Text style={[styles.valChipLabel, { color: colors.sectionAudio }]}>300</Text>
                          <Text style={[styles.valChipVal, { color: colors.textSecondary }]}>{h.trans_300.toFixed(1)}dB</Text>
                        </View>
                      )}
                      {h.trans_1000 != null && (
                        <View style={[styles.valChip, { backgroundColor: colors.cyan + '12', marginLeft: 4 }]}>
                          <Text style={[styles.valChipLabel, { color: colors.cyan }]}>1k</Text>
                          <Text style={[styles.valChipVal, { color: colors.textSecondary }]}>{h.trans_1000.toFixed(1)}dB</Text>
                        </View>
                      )}
                      {h.trans_3400 != null && (
                        <View style={[styles.valChip, { backgroundColor: colors.gold + '12', marginLeft: 4 }]}>
                          <Text style={[styles.valChipLabel, { color: colors.gold }]}>3.4k</Text>
                          <Text style={[styles.valChipVal, { color: colors.textSecondary }]}>{h.trans_3400.toFixed(1)}dB</Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Verdict IA + recommandation maintenance (persistés en base) */}
                  {(h.ai_verdict || h.ai_recommendation) && (
                    <View style={[styles.aiBox, { borderTopColor: colors.borderColor }]}>
                      <Text style={[styles.aiLabel, {
                        color: (h.ai_atypical === 1 || h.ai_atypical === true) ? colors.warnOrange : colors.passGreen,
                      }]}>
                        IA · {h.ai_verdict || ((h.ai_atypical === 1 || h.ai_atypical === true) ? 'ATYPIQUE' : 'TYPIQUE')}
                      </Text>
                      {h.ai_recommendation ? (
                        <Text style={[styles.aiReco, { color: colors.textMuted }]} numberOfLines={3}>
                          {h.ai_recommendation}
                        </Text>
                      ) : null}
                    </View>
                  )}
                </View>
              </View>
            );
          })
        )}
        <View style={{ height: 16 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: { flexDirection: 'row', marginBottom: 12 },
  statBox: { flex: 1, borderRadius: 10, padding: 10, alignItems: 'center', borderWidth: 1, overflow: 'hidden' },
  statAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  statValue: { fontSize: 18, fontWeight: '900', fontFamily: 'monospace', marginTop: 2 },
  statLabel: { fontSize: 7, fontWeight: '700', letterSpacing: 1.5, marginTop: 2 },

  filterRow: { flexDirection: 'row', borderRadius: 8, padding: 3, marginBottom: 12, borderWidth: 1 },
  filterBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  filterText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },

  item: { flexDirection: 'row', borderRadius: 10, marginBottom: 8, borderWidth: 1, overflow: 'hidden' },
  itemLeftBar: { width: 4 },
  itemBody: { flex: 1, padding: 12 },
  itemTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  time: { fontSize: 12, fontWeight: '700' },
  resBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1 },
  resText: { fontSize: 9, fontWeight: '900', letterSpacing: 1 },

  valRow: { flexDirection: 'row', flexWrap: 'wrap' },
  valChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4 },
  valChipLabel: { fontSize: 8, fontWeight: '800', marginRight: 3 },
  valChipVal: { fontSize: 9, fontWeight: '700', fontFamily: 'monospace' },

  aiBox: { marginTop: 8, paddingTop: 6, borderTopWidth: 1 },
  aiLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5, marginBottom: 2 },
  aiReco: { fontSize: 9, lineHeight: 13 },
});
