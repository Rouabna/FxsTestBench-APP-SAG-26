import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { useTheme } from '../constants/theme';
import { API_URL } from '../constants/config';

export default function SettingsScreen({ connected, data }) {
  const { colors, isDark, toggle } = useTheme();
  const [clock, setClock] = useState('--:--:--');
  const [ipAddress, setIpAddress] = useState(API_URL.replace('http://', '').replace(':5000', ''));

  useEffect(() => {
    const timer = setInterval(() => {
      setClock(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const Card = ({ title, accentColor, children }) => (
    <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.borderColor }]}>
      <View style={[styles.cardTopBar, { backgroundColor: accentColor }]} />
      <View style={[styles.cardHeader, { borderBottomColor: colors.borderColor }]}>
        <Text style={[styles.cardTitle, { color: accentColor }]}>{title}</Text>
      </View>
      <View style={styles.cardBody}>{children}</View>
    </View>
  );

  const InfoRow = ({ label, value, valueColor }) => (
    <View style={[styles.infoRow, { borderBottomColor: colors.borderColor + '40' }]}>
      <Text style={[styles.infoLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: valueColor || colors.textPrimary }]}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 12 }} showsVerticalScrollIndicator={false}>

      {/* THEME TOGGLE */}
      <View style={[styles.themeCard, { backgroundColor: colors.bgCard, borderColor: isDark ? colors.purple + '40' : colors.warnOrange + '40' }]}>
        <View style={[styles.themeTopBar, { backgroundColor: isDark ? colors.purple : colors.warnOrange }]} />
        <View style={styles.themeContent}>
          <View style={styles.themeRow}>
            <View style={[styles.themeIconBox, { backgroundColor: isDark ? colors.purple + '20' : colors.warnOrange + '20' }]}>
              <Text style={styles.themeIcon}>{isDark ? '☾' : '☀'}</Text>
            </View>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={[styles.themeTitle, { color: colors.textPrimary }]}>
                {isDark ? 'Mode Sombre' : 'Mode Clair'}
              </Text>
              <Text style={[styles.themeSub, { color: colors.textMuted }]}>
                {isDark ? 'Thème sombre pour environnement industriel' : 'Thème clair pour usage bureau'}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggle}
              trackColor={{ false: '#d1d5db', true: colors.purple + '60' }}
              thumbColor={isDark ? colors.purple : colors.warnOrange}
            />
          </View>
        </View>
      </View>

      {/* RASPBERRY PI STATUS */}
      <Card title="STATUT RASPBERRY PI" accentColor={connected ? colors.passGreen : colors.failRed}>
        <View style={[styles.statusBlock, {
          backgroundColor: (connected ? colors.passGreen : colors.failRed) + '10',
          borderColor: (connected ? colors.passGreen : colors.failRed) + '30',
        }]}>
          <View style={[styles.bigDot, { backgroundColor: connected ? colors.passGreen : colors.failRed }]} />
          <Text style={[styles.bigStatus, { color: connected ? colors.passGreen : colors.failRed, marginLeft: 10 }]}>
            {connected ? 'CONNECTÉ' : 'DÉCONNECTÉ'}
          </Text>
        </View>
        <InfoRow label="Adresse IP" value={ipAddress + ':5000'} valueColor={colors.cyan} />
        <InfoRow label="Protocole" value="REST + Socket.IO" />
        <InfoRow label="Transport" value="Polling + WebSocket" />
        <InfoRow label="Heure locale" value={clock} valueColor={colors.accent} />
        <InfoRow label="Status test" value={data.status || 'IDLE'} valueColor={
          data.status === 'DONE' ? (data.final ? colors.passGreen : colors.failRed) :
          data.status === 'IDLE' ? colors.idleGray : colors.cyan
        } />
        <InfoRow label="Étape" value={`${data.step || 0} / ${data.total_steps || 8}`} valueColor={colors.purple} />
        <InfoRow label="Slot gateway" value={String(data.slot || 1)} valueColor={colors.cyan} />
      </Card>

      {/* NETWORK CONFIG */}
      <Card title="CONFIGURATION RÉSEAU" accentColor={colors.accent}>
        <Text style={[styles.inputLabel, { color: colors.textMuted }]}>Adresse IP du Raspberry Pi</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.bgInput, borderColor: colors.borderColor, color: colors.textPrimary }]}
            value={ipAddress} onChangeText={setIpAddress}
            placeholder="192.168.1.100" placeholderTextColor={colors.textMuted}
            keyboardType="numeric" />
          <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.accent, marginLeft: 8 }]} activeOpacity={0.7}>
            <Text style={styles.saveBtnText}>SAUVER</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.inputHint, { color: colors.textMuted }]}>Modifiez src/constants/config.js et redémarrez</Text>
      </Card>

      {/* SYSTEM INFO */}
      <Card title="INFORMATIONS SYSTÈME" accentColor={colors.teal}>
        <InfoRow label="Application" value="FXS Gateway Test Bench" />
        <InfoRow label="Version" value="3.0.0" valueColor={colors.teal} />
        <InfoRow label="Plateforme" value="React Native + Expo" />
        <InfoRow label="Backend" value="Flask + Socket.IO" />
        <InfoRow label="Mesure" value="ADS1115 + raspi-gpio" valueColor={colors.passGreen} />
        <InfoRow label="Matériel" value="Raspberry Pi 4 + AD736" valueColor={colors.purple} />
        <InfoRow label="Module IA" value="Isolation Forest (dérive)" valueColor={colors.magenta} />
      </Card>

      {/* TEST PARAMS */}
      <Card title="PARAMÈTRES DE TEST (limites Sagem)" accentColor={colors.warnOrange}>
        <InfoRow label="Tension de repos" value="44 - 50 V" valueColor={colors.sectionVoltage} />
        <InfoRow label="Courant de ligne" value="33 - 39 mA" valueColor={colors.sectionCurrent} />
        <InfoRow label="Sonnerie (Ring)" value="35 - 41 Vrms" valueColor={colors.sectionDial} />
        <InfoRow label="Transmission 1000 Hz" value="8.1 - 10.1 dB" valueColor={colors.sectionAudio} />
        <InfoRow label="Fréquences transmission" value="300, 1000, 3400 Hz" valueColor={colors.cyan} />
        <InfoRow label="Ports par gateway" value="FXS1 + FXS2" valueColor={colors.passGreen} />
        <InfoRow label="Étapes (mesures)" value="8" />
      </Card>

      {/* ABOUT */}
      <Card title="À PROPOS" accentColor={colors.magenta}>
        <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
          Banc de Test FXS — Supervision industrielle pour le test de passerelles FXS Sagemcom.
        </Text>
        <View style={[styles.divider, { backgroundColor: colors.borderColor }]} />
        <Text style={[styles.aboutSub, { color: colors.textMuted }]}>PFE 2026 | Supervision Industrielle</Text>
        <Text style={[styles.aboutSub, { color: colors.magenta, marginTop: 4 }]}>Sagemcom</Text>
      </Card>

      <View style={{ height: 16 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 12, borderWidth: 1, marginBottom: 12, overflow: 'hidden' },
  cardTopBar: { height: 3 },
  cardHeader: { paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1 },
  cardTitle: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  cardBody: { padding: 14 },

  themeCard: { borderRadius: 12, borderWidth: 1, marginBottom: 12, overflow: 'hidden' },
  themeTopBar: { height: 3 },
  themeContent: { padding: 16 },
  themeRow: { flexDirection: 'row', alignItems: 'center' },
  themeIconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  themeIcon: { fontSize: 20 },
  themeTitle: { fontSize: 15, fontWeight: '700' },
  themeSub: { fontSize: 10, marginTop: 2 },

  statusBlock: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 16, marginBottom: 12, borderRadius: 10, borderWidth: 1,
  },
  bigDot: { width: 12, height: 12, borderRadius: 6 },
  bigStatus: { fontSize: 15, fontWeight: '900', letterSpacing: 3 },

  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 9, borderBottomWidth: 1 },
  infoLabel: { fontSize: 11, fontWeight: '600' },
  infoValue: { fontSize: 11, fontWeight: '700', fontFamily: 'monospace' },

  inputLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5, marginBottom: 6 },
  inputRow: { flexDirection: 'row' },
  input: { flex: 1, borderRadius: 8, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, fontFamily: 'monospace' },
  saveBtn: { paddingHorizontal: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  saveBtnText: { fontSize: 10, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  inputHint: { fontSize: 9, marginTop: 6, fontStyle: 'italic' },

  aboutText: { fontSize: 12, lineHeight: 18, marginBottom: 8 },
  divider: { height: 1, marginVertical: 10 },
  aboutSub: { fontSize: 10, textAlign: 'center' },
});
