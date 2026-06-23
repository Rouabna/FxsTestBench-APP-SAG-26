import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert,
} from 'react-native';
import { useTheme, statusLabel } from '../constants/theme';
import { apiStart, apiStop, apiReset } from '../services/socket';

import LEDPanel from '../components/LEDPanel';
import GatewayStatus from '../components/GatewayStatus';
import StepsList from '../components/StepsList';
import MiniHistory from '../components/MiniHistory';
import StatsBar from '../components/StatsBar';
import AICard from '../components/AICard';
import DualPortCard from '../components/DualPortCard';
import TransCard from '../components/TransCard';
import ConsoCard from '../components/ConsoCard';

export default function DashboardScreen({
  data, connected, resetData, totalTests, passedTests, failedTests,
}) {
  const { colors } = useTheme();

  const isRunning = data.status !== 'IDLE' && data.status !== 'DONE'
                 && data.status !== 'ERROR' && data.status !== 'STOPPED';

  const handleStart = async () => {
    if (!connected) { Alert.alert('Erreur', 'Non connecté au Raspberry Pi'); return; }
    try { const res = await apiStart(); if (res.error) Alert.alert('Erreur', res.error); }
    catch (e) { Alert.alert('Erreur', 'Impossible de contacter le Raspberry Pi'); }
  };
  const handleStop = async () => {
    try { await apiStop(); } catch (e) { Alert.alert('Erreur', 'Connexion impossible'); }
  };
  const handleReset = async () => {
    try { await apiReset(); resetData(); } catch (e) { Alert.alert('Erreur', 'Connexion impossible'); }
  };

  let globalStatus = 'IDLE', globalColor = colors.idleGray;
  if (data.status === 'DONE') {
    globalStatus = data.final ? 'PASS' : 'FAIL';
    globalColor = data.final ? colors.passGreen : colors.failRed;
  } else if (data.status === 'ERROR') {
    globalStatus = 'ERROR'; globalColor = colors.failRed;
  } else if (data.status === 'STOPPED') {
    globalStatus = 'STOPPED'; globalColor = colors.warnOrange;
  } else if (data.status !== 'IDLE') {
    globalStatus = 'RUNNING'; globalColor = colors.cyan;
  }

  const pct = data.status === 'DONE' ? 100 : ((data.step || 0) / (data.total_steps || 10)) * 100;

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 12, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>

      {/* ── BARRE DE CONTRÔLE (superviseur) — compacte, en haut ── */}
      <View style={styles.ctrlBar}>
        <TouchableOpacity
          style={[styles.ctrlBtn, { backgroundColor: colors.passGreen + '18', borderColor: colors.passGreen }]}
          onPress={handleStart} activeOpacity={0.7}>
          <Text style={[styles.ctrlIcon, { color: colors.passGreen }]}>▶</Text>
          <Text style={[styles.ctrlLabel, { color: colors.passGreen }]}>{isRunning ? 'RESTART' : 'START'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.ctrlBtn, { backgroundColor: colors.failRed + '18', borderColor: colors.failRed, marginHorizontal: 6 }]}
          onPress={handleStop} activeOpacity={0.7}>
          <Text style={[styles.ctrlIcon, { color: colors.failRed }]}>■</Text>
          <Text style={[styles.ctrlLabel, { color: colors.failRed }]}>STOP</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.ctrlBtn, { backgroundColor: colors.warnOrange + '18', borderColor: colors.warnOrange }]}
          onPress={handleReset} activeOpacity={0.7}>
          <Text style={[styles.ctrlIcon, { color: colors.warnOrange }]}>↺</Text>
          <Text style={[styles.ctrlLabel, { color: colors.warnOrange }]}>RESET</Text>
        </TouchableOpacity>
      </View>

      {/* ── STATUT SERVEUR SONNERIE (PC déporté / Telnet local) ── */}
      <GatewayStatus />

      {/* ── STATUT GATEWAY + PROGRESSION ── */}
      <View style={[styles.statusCard, { backgroundColor: colors.bgCard, borderColor: colors.borderColor }]}>
        <View style={{ height: 3, backgroundColor: globalColor }} />
        <View style={styles.statusInner}>
          <View>
            <Text style={[styles.gwLabel, { color: colors.textMuted }]}>GATEWAY · SLOT {data.slot || 1}</Text>
            <Text style={[styles.gwSub, { color: colors.textSecondary }]}>FXS1 + FXS2 testés ensemble</Text>
          </View>
          <View style={[styles.globalBadge, { borderColor: globalColor, backgroundColor: globalColor + '20' }]}>
            <View style={[styles.statusDot, { backgroundColor: globalColor }]} />
            <Text style={[styles.globalText, { color: globalColor, marginLeft: 5 }]}>{globalStatus}</Text>
          </View>
        </View>
        <View style={styles.progressWrap}>
          <View style={[styles.progressBg, { backgroundColor: colors.gaugeBg }]}>
            <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: globalColor }]} />
          </View>
          <Text style={[styles.progressLabel, { color: colors.textMuted }]}>{statusLabel(data.status)}</Text>
        </View>
      </View>

      {/* ── MESURES PAR PORT (FXS1 & FXS2) ── */}
      <DualPortCard
        title="1 · TENSION DE REPOS" unit="V" range="[44 - 50] V"
        fxs1={data.tr_fxs1} fxs2={data.tr_fxs2} lo={44} hi={50}
        accent={colors.sectionVoltage} />
      <DualPortCard
        title="2 · COURANT DE LIGNE" unit="mA" range="[33 - 39] mA"
        fxs1={data.cl_fxs1} fxs2={data.cl_fxs2} lo={33} hi={39}
        accent={colors.sectionCurrent} />
      <DualPortCard
        title="3 · SONNERIE (Ring)" unit="Vrms" range="[35 - 41] Vrms"
        fxs1={data.alarm_rms_fxs1} fxs2={data.alarm_rms_fxs2} lo={35} hi={41}
        accent={colors.sectionDial} />
      <TransCard data={data} />
      <ConsoCard
        title="5 · CONSOMMATION" unit="W" range="[7 - 20] W"
        value={data.conso_w} lo={7} hi={20}
        accent={colors.sectionPower} />

      {/* ── SÉPARATEUR : 2e niveau d'analyse ── */}
      <View style={styles.divider}>
        <View style={[styles.dividerLine, { backgroundColor: colors.borderColor }]} />
        <Text style={[styles.dividerText, { color: colors.textMuted }]}>AU-DELÀ DES SEUILS</Text>
        <View style={[styles.dividerLine, { backgroundColor: colors.borderColor }]} />
      </View>

      {/* ── VERDICT IA (synthèse 2e niveau, après les mesures) ── */}
      <AICard data={data} />

      {/* ── LED + ÉTAPES ── */}
      <LEDPanel data={data} />
      <StepsList currentStep={data.step} status={data.status} data={data} />

      {/* ── STATS + HISTORIQUE ── */}
      <StatsBar total={totalTests} passed={passedTests} failed={failedTests} />
      <MiniHistory data={data} />

      <View style={{ height: 16 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  statusCard: { borderRadius: 12, borderWidth: 1, marginBottom: 10, overflow: 'hidden' },
  statusInner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingTop: 10 },
  gwLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  gwSub: { fontSize: 9, marginTop: 2 },
  globalBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1 },
  statusDot: { width: 5, height: 5, borderRadius: 3 },
  globalText: { fontSize: 11, fontWeight: '900', letterSpacing: 1.5 },
  progressWrap: { paddingHorizontal: 14, paddingVertical: 12 },
  progressBg: { height: 4, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  progressLabel: { textAlign: 'center', fontSize: 9, marginTop: 4, letterSpacing: 0.8 },

  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 4, marginBottom: 8 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 9, fontWeight: '800', letterSpacing: 2, marginHorizontal: 10 },

  // Barre de contrôle compacte (en haut)
  ctrlBar: { flexDirection: 'row', marginBottom: 10 },
  ctrlBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 9, borderRadius: 8, borderWidth: 1 },
  ctrlIcon: { fontSize: 11, marginRight: 5 },
  ctrlLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 1 },
});
