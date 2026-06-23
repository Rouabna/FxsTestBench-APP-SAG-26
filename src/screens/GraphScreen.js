import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../constants/theme';

const CHART_H = 180;
// Y-axis scaled to fit TR (~47 V), Sonnerie (~38 V RMS); CL (mA) and dB will sit low.
const Y_MAX = 50;

export default function GraphScreen({ trendData, history }) {
  const { colors } = useTheme();
  const [activeLine, setActiveLine] = useState(null);

  const GRAPH_LINES = [
    { key: 'trans_1000', label: 'TR1000',   color: colors.cyan },
    { key: 'alarm_rms',  label: 'Sonnerie', color: colors.warnOrange },
    { key: 'tr',         label: 'TR (V)',   color: colors.passGreen },
    { key: 'cl',         label: 'CL (A)',   color: colors.purple },
  ];

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 12 }} showsVerticalScrollIndicator={false}>

      {/* TREND GRAPH */}
      <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.borderColor }]}>
        <View style={[styles.cardTopBar, { backgroundColor: colors.cyan }]} />
        <View style={[styles.cardHeader, { borderBottomColor: colors.borderColor }]}>
          <Text style={[styles.cardTitle, { color: colors.cyan }]}>TREND GRAPH</Text>
          <Text style={[styles.cardSub, { color: colors.textMuted }]}>Mesures vs Temps (échelle 0-{Y_MAX})</Text>
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          {GRAPH_LINES.map((line, i) => (
            <TouchableOpacity key={line.key}
              style={[styles.legendItem, {
                borderColor: activeLine === line.key ? line.color : 'transparent',
                backgroundColor: activeLine === line.key ? line.color + '18' : 'transparent',
                marginLeft: i > 0 ? 6 : 0,
              }]}
              onPress={() => setActiveLine(activeLine === line.key ? null : line.key)}>
              <View style={[styles.legendDot, { backgroundColor: line.color }]} />
              <Text style={[styles.legendText, { color: activeLine === line.key ? line.color : colors.textMuted }]}>{line.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chart */}
        <View style={styles.chartWrap}>
          <View style={styles.yAxis}>
            {[Y_MAX, Y_MAX*0.75, Y_MAX*0.5, Y_MAX*0.25, 0].map(l => (
              <Text key={l} style={[styles.yLabel, { color: colors.textMuted }]}>{l.toFixed(0)}</Text>
            ))}
          </View>
          <View style={[styles.chartArea, { borderColor: colors.borderColor }]}>
            {[0,1,2,3,4].map(i => (
              <View key={i} style={[styles.gridLine, { top: (i/4)*CHART_H, backgroundColor: colors.borderColor + '40' }]} />
            ))}

            {trendData.length > 1 && GRAPH_LINES.map(line => {
              if (activeLine && activeLine !== line.key) return null;
              return (
                <View key={line.key} style={StyleSheet.absoluteFill}>
                  {trendData.map((point, idx) => {
                    const val = point[line.key];
                    if (val == null) return null;
                    const x = (idx / (trendData.length - 1)) * 100;
                    const y = (1 - Math.min(val, Y_MAX) / Y_MAX) * CHART_H;
                    return <View key={idx} style={{ position: 'absolute', left: `${x}%`, top: y, width: 5, height: 5, borderRadius: 3, backgroundColor: line.color, marginLeft: -2.5, marginTop: -2.5 }} />;
                  })}
                </View>
              );
            })}

            {trendData.length === 0 && (
              <View style={styles.noData}>
                <Text style={{ fontSize: 11, color: colors.textMuted }}>Lancez un test pour voir le graphique</Text>
              </View>
            )}
          </View>
        </View>
        {trendData.length > 0 && (
          <View style={styles.xAxis}>
            <Text style={[styles.xLabel, { color: colors.textMuted }]}>{trendData[0]?.time || ''}</Text>
            <Text style={[styles.xLabel, { color: colors.textMuted }]}>{trendData[trendData.length-1]?.time || ''}</Text>
          </View>
        )}
      </View>

      {/* PASS RATE CHART */}
      <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.borderColor }]}>
        <View style={[styles.cardTopBar, { backgroundColor: colors.passGreen }]} />
        <View style={[styles.cardHeader, { borderBottomColor: colors.borderColor }]}>
          <Text style={[styles.cardTitle, { color: colors.passGreen }]}>TAUX DE RÉUSSITE</Text>
        </View>
        <View style={{ padding: 12, minHeight: 120 }}>
          {history.length === 0 ? (
            <View style={styles.noData}><Text style={{ fontSize: 11, color: colors.textMuted }}>Aucune donnée</Text></View>
          ) : (
            <>
              <View style={styles.barChart}>
                {history.slice(-20).map((h, idx) => (
                  <View key={idx} style={styles.barCol}>
                    <View style={[styles.bar, {
                      height: h.final ? '80%' : '30%',
                      backgroundColor: h.final ? colors.passGreen : colors.failRed,
                    }]} />
                  </View>
                ))}
              </View>
              <View style={styles.rateCenter}>
                <Text style={[styles.rateLabel, { color: colors.textSecondary }]}>Taux global :</Text>
                <Text style={[styles.rateValue, {
                  color: (history.filter(h=>h.final).length/history.length)*100 >= 80 ? colors.passGreen : colors.warnOrange,
                  marginLeft: 6,
                }]}>
                  {((history.filter(h=>h.final).length/history.length)*100).toFixed(1)}%
                </Text>
              </View>
            </>
          )}
        </View>
      </View>

      {/* RECENT MEASURES */}
      <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.borderColor }]}>
        <View style={[styles.cardTopBar, { backgroundColor: colors.purple }]} />
        <View style={[styles.cardHeader, { borderBottomColor: colors.borderColor }]}>
          <Text style={[styles.cardTitle, { color: colors.purple }]}>DERNIÈRES MESURES</Text>
        </View>
        <View style={{ padding: 10 }}>
          {history.length === 0 ? (
            <View style={styles.noData}><Text style={{ fontSize: 11, color: colors.textMuted }}>Aucune mesure</Text></View>
          ) : (
            history.slice(-5).reverse().map((h, idx) => (
              <View key={idx} style={[styles.mRow, { borderBottomColor: colors.borderColor + '50' }]}>
                <Text style={[styles.mTime, { color: colors.textMuted }]}>
                  {h.timestamp ? h.timestamp.substring(0, 16) : `#${idx+1}`}
                </Text>
                <View style={styles.mChips}>
                  <View style={[styles.mChip, { backgroundColor: colors.sectionVoltage + '12' }]}>
                    <Text style={[styles.mChipLabel, { color: colors.sectionVoltage }]}>V</Text>
                    <Text style={[styles.mChipVal, { color: colors.textSecondary }]}>{h.tr != null ? h.tr.toFixed(1) : '--'}</Text>
                  </View>
                  <View style={[styles.mChip, { backgroundColor: colors.sectionCurrent + '12', marginLeft: 4 }]}>
                    <Text style={[styles.mChipLabel, { color: colors.sectionCurrent }]}>mA</Text>
                    <Text style={[styles.mChipVal, { color: colors.textSecondary }]}>{h.cl != null ? (h.cl*1000).toFixed(1) : '--'}</Text>
                  </View>
                  <View style={[styles.mChip, { backgroundColor: colors.sectionPower + '12', marginLeft: 4 }]}>
                    <Text style={[styles.mChipLabel, { color: colors.sectionPower }]}>mW</Text>
                    <Text style={[styles.mChipVal, { color: colors.textSecondary }]}>{h.power != null ? (h.power*1000).toFixed(0) : '--'}</Text>
                  </View>
                </View>
                <View style={[styles.mResult, { backgroundColor: (h.final ? colors.passGreen : colors.failRed) + '18' }]}>
                  <Text style={{ fontSize: 9, fontWeight: '800', color: h.final ? colors.passGreen : colors.failRed }}>
                    {h.final ? 'PASS' : 'FAIL'}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </View>

      <View style={{ height: 16 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 12, borderWidth: 1, marginBottom: 12, overflow: 'hidden' },
  cardTopBar: { height: 3 },
  cardHeader: { paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1 },
  cardTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  cardSub: { fontSize: 8, marginTop: 1 },

  legendRow: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 8, paddingHorizontal: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1 },
  legendDot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
  legendText: { fontSize: 9, fontWeight: '700' },

  chartWrap: { flexDirection: 'row', paddingRight: 10 },
  yAxis: { width: 30, justifyContent: 'space-between', alignItems: 'flex-end', paddingRight: 4, height: CHART_H },
  yLabel: { fontSize: 8, fontFamily: 'monospace' },
  chartArea: { flex: 1, height: CHART_H, position: 'relative', overflow: 'hidden', borderLeftWidth: 1, borderBottomWidth: 1 },
  gridLine: { position: 'absolute', left: 0, right: 0, height: 1 },
  noData: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 30 },
  xAxis: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 34, paddingBottom: 8 },
  xLabel: { fontSize: 8, fontFamily: 'monospace' },

  barChart: { flexDirection: 'row', alignItems: 'flex-end', height: 80 },
  barCol: { flex: 1, height: '100%', justifyContent: 'flex-end', paddingHorizontal: 1 },
  bar: { width: '100%', borderRadius: 2, minHeight: 4 },
  rateCenter: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 8 },
  rateLabel: { fontSize: 11, fontWeight: '600' },
  rateValue: { fontSize: 18, fontWeight: '900', fontFamily: 'monospace' },

  mRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1 },
  mTime: { fontSize: 8, fontFamily: 'monospace', width: 55 },
  mChips: { flex: 1, flexDirection: 'row' },
  mChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  mChipLabel: { fontSize: 8, fontWeight: '800', marginRight: 3 },
  mChipVal: { fontSize: 9, fontWeight: '700', fontFamily: 'monospace' },
  mResult: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, marginLeft: 6 },
});
