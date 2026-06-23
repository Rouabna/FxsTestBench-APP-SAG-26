import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  Platform, Animated, Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from './src/constants/theme';
import { connectSocket, disconnectSocket, apiStatus, apiHistory } from './src/services/socket';

import DashboardScreen from './src/screens/DashboardScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import GraphScreen from './src/screens/GraphScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const TABS = [
  { key: 'dashboard', label: 'Tests',      icon: '⬡',  activeColor: null },
  { key: 'history',   label: 'Historique',  icon: '☰',  activeColor: null },
  { key: 'graph',     label: 'Graphique',   icon: '◫',  activeColor: null },
  { key: 'settings',  label: 'Réglages',    icon: '⚙',  activeColor: null },
];

const INITIAL = {
  // Mesures par port (gateway = FXS1 + FXS2), unités modèle
  tr_fxs1: null, tr_fxs2: null, cl_fxs1: null, cl_fxs2: null,
  alarm_rms_fxs1: null, alarm_rms_fxs2: null,
  trans_300_fxs1: null, trans_1000_fxs1: null, trans_3400_fxs1: null,
  trans_300_fxs2: null, trans_1000_fxs2: null, trans_3400_fxs2: null,
  // Clés héritées (mono-ligne = FXS1) pour compat graphes/historique
  tr: null, cl: null, power: null, alarm_rms: null,
  trans_300: null, trans_1000: null, trans_3400: null,
  // Verdicts seuils (niveau gateway) + verdict IA
  pass_tr: null, pass_cl: null, pass_alarm: null, pass_trans: null,
  final: null, slot: 1,
  ai_available: null, ai_score: null, ai_atypical: null,
  ai_verdict: null, ai_culprit: null, ai_culprit_pct: null,
  status: 'IDLE', step: 0, total_steps: 10, timestamp: null,
};

function AppContent() {
  const { colors, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState(INITIAL);
  const [connected, setConnected] = useState(false);
  const [selectedFxs, setSelectedFxs] = useState('FXS1');
  const [history, setHistory] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.3, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    );
    if (!connected) pulse.start();
    else { pulse.stop(); pulseAnim.setValue(1); }
    return () => pulse.stop();
  }, [connected]);

  useEffect(() => {
    const socket = connectSocket((newData) => {
      setData(prev => {
        const merged = { ...prev, ...newData };
        if (merged.status !== 'IDLE' && merged.status !== 'DONE') {
          setTrendData(td => {
            const point = {
              time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              v_repos: merged.tr_fxs1, i_line: merged.cl_fxs1,
              dial_rms: merged.alarm_rms_fxs1, audio_1000: merged.trans_1000_fxs1,
            };
            return [...td, point].slice(-30);
          });
        }
        return merged;
      });
    });
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    apiStatus().then(d => setData(prev => ({ ...prev, ...d }))).catch(() => {});
    loadHistory();
    return () => disconnectSocket();
  }, []);

  useEffect(() => {
    if (data.status === 'DONE') loadHistory();
  }, [data.status]);

  const loadHistory = () => {
    apiHistory().then(d => setHistory(Array.isArray(d) ? d.reverse() : [])).catch(() => {});
  };
  const resetData = () => { setData(INITIAL); setTrendData([]); };

  // final vient de SQLite en INTEGER (1/0), pas en booléen JS -> comparer aux deux.
  const totalTests = history.length;
  const passedTests = history.filter(h => h.final === true || h.final === 1).length;
  const failedTests = history.filter(h => h.final === false || h.final === 0).length;

  const statusColor = data.status === 'DONE'
    ? (data.final ? colors.passGreen : colors.failRed)
    : data.status === 'IDLE' ? colors.idleGray : colors.cyan;
  const statusLabel = data.status === 'DONE'
    ? (data.final ? 'PASS' : 'FAIL')
    : data.status === 'IDLE' ? 'IDLE' : 'RUN';

  const tabColors = [colors.accent, colors.teal, colors.purple, colors.warnOrange];

  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardScreen data={data} connected={connected} selectedFxs={selectedFxs} setSelectedFxs={setSelectedFxs} resetData={resetData} totalTests={totalTests} passedTests={passedTests} failedTests={failedTests} />;
      case 'history':
        return <HistoryScreen history={history} />;
      case 'graph':
        return <GraphScreen trendData={trendData} history={history} />;
      case 'settings':
        return <SettingsScreen connected={connected} data={data} />;
      default: return null;
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgPrimary }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.accent + '40' }]}>
        <View style={styles.headerLeft}>
          <View style={[styles.logoWrap, { borderColor: colors.accent + '50' }]}>
            <Image source={require('./assets/logo-sagem.png')} style={styles.logo} resizeMode="contain" />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
              FXS GATEWAY TEST BENCH
            </Text>
            <View style={styles.headerMeta}>
              <Animated.View style={[styles.connDot, {
                backgroundColor: connected ? colors.passGreen : colors.failRed,
                opacity: connected ? 1 : pulseAnim,
              }]} />
              <Text style={[styles.headerSub, {
                color: connected ? colors.passGreen : colors.failRed, marginLeft: 5,
              }]}>
                {connected ? 'CONNECTÉ' : 'DÉCONNECTÉ'}
              </Text>
            </View>
          </View>
        </View>
        <View style={[styles.statusPill, { borderColor: statusColor, backgroundColor: statusColor + '20' }]}>
          <View style={[styles.statusDotSmall, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor, marginLeft: 5 }]}>{statusLabel}</Text>
        </View>
      </View>

      <View style={{ flex: 1 }}>{renderScreen()}</View>

      {/* TAB BAR */}
      <View style={[styles.tabBar, { backgroundColor: colors.tabBg, borderTopColor: colors.borderColor }]}>
        {TABS.map((tab, idx) => {
          const active = activeTab === tab.key;
          const tColor = active ? tabColors[idx] : colors.tabInactive;
          return (
            <TouchableOpacity key={tab.key} style={styles.tab} onPress={() => setActiveTab(tab.key)} activeOpacity={0.7}>
              {active && <View style={[styles.tabIndicator, { backgroundColor: tColor }]} />}
              <Text style={[styles.tabIcon, { color: tColor }]}>{tab.icon}</Text>
              <Text style={[styles.tabLabel, { color: tColor }]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 10,
    paddingTop: Platform.OS === 'android' ? 38 : 10,
    borderBottomWidth: 2,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logoWrap: { width: 38, height: 38, borderRadius: 10, borderWidth: 1.5, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  logo: { width: 32, height: 32 },
  headerTitle: { fontSize: 12, fontWeight: '800', letterSpacing: 1.2 },
  headerMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  connDot: { width: 6, height: 6, borderRadius: 3 },
  headerSub: { fontSize: 8, fontWeight: '700', letterSpacing: 0.5 },
  statusPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, borderWidth: 1.5 },
  statusDotSmall: { width: 5, height: 5, borderRadius: 3 },
  statusText: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  tabBar: { flexDirection: 'row', borderTopWidth: 1, paddingBottom: Platform.OS === 'ios' ? 20 : 6, paddingTop: 4 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 6 },
  tabIndicator: { position: 'absolute', top: 0, width: 20, height: 2.5, borderRadius: 1.5 },
  tabIcon: { fontSize: 16, marginBottom: 2 },
  tabLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 0.3 },
});
