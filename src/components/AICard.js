import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../constants/theme';

/**
 * Verdict IA (Isolation Forest) au niveau gateway — élément MIS EN AVANT.
 * Complète les seuils Sagem : signale les cartes DANS LES LIMITES mais
 * atypiques (dérive précoce). Données : champs ai_* poussés par app.py.
 */
export default function AICard({ data }) {
  const { colors } = useTheme();

  const hasVerdict = data.ai_available === true && data.ai_score != null;
  const unavailable = data.ai_available === false;
  const atypical = data.ai_atypical === true;
  const severity = data.ai_severity;   // 'OK' | 'WATCH' | 'ALERT' | 'FAIL'

  // Couleur pilotée par la SÉVÉRITÉ (action) plutôt que par typique/atypique seul.
  const SEV_COLOR = {
    OK: colors.passGreen, WATCH: colors.gold,
    ALERT: colors.warnOrange, FAIL: colors.failRed,
  };
  const accent = !hasVerdict ? colors.idleGray
    : (SEV_COLOR[severity] || (atypical ? colors.warnOrange : colors.passGreen));

  // Badge principal = sévérité (OK/WATCH/ALERT/FAIL) ; sous-titre = profil IA.
  let verdict = 'EN ATTENTE';
  if (unavailable) verdict = 'IA INDISPONIBLE';
  else if (hasVerdict) verdict = severity || (atypical ? 'ATYPIQUE' : 'TYPIQUE');
  else if (data.status === 'DONE') verdict = '—';
  const subVerdict = hasVerdict ? (atypical ? 'profil atypique' : 'profil typique') : '';

  return (
    <View style={[styles.card, { backgroundColor: accent + '14', borderColor: accent, shadowColor: accent }]}>
      <View style={[styles.topBar, { backgroundColor: accent }]} />

      {/* En-tête */}
      <View style={styles.header}>
        <View style={[styles.row, { flex: 1 }]}>
          <View style={[styles.iconWrap, { borderColor: accent, backgroundColor: accent + '22' }]}>
            <Text style={[styles.icon, { color: accent }]}>◉</Text>
          </View>
          <View style={{ marginLeft: 8, flex: 1 }}>
            <Text style={[styles.kicker, { color: accent }]}>ANALYSE IA</Text>
            <Text style={[styles.sub, { color: colors.textMuted }]}>DÉTECTION DE DÉRIVE · GATEWAY</Text>
          </View>
        </View>
        <View style={[styles.tag, { borderColor: accent + '66', backgroundColor: accent + '1A' }]}>
          <Text style={[styles.tagText, { color: accent }]}>2ᵉ ANALYSE</Text>
        </View>
      </View>

      {/* Sévérité en grand + profil IA en sous-titre */}
      <View style={styles.heroWrap}>
        <View style={[styles.verdictBadge, { backgroundColor: accent }]}>
          <Text style={styles.verdictText}>{verdict}</Text>
        </View>
        {subVerdict ? <Text style={[styles.heroSub, { color: colors.textMuted }]}>{subVerdict}</Text> : null}
      </View>

      {hasVerdict ? (
        <>
          {/* Score + cause : l'IA n'est pertinente que sur une carte QUI PASSE
              (dérive dans les limites). Sur une carte en ÉCHEC, la cause est déjà
              donnée par les seuils -> on masque ces stats (ai_relevant === false). */}
          {data.ai_relevant !== false && (
            <View style={styles.statsRow}>
              <View style={[styles.statBox, { borderColor: colors.borderColor }]}>
                <Text style={[styles.statLabel, { color: colors.textMuted }]}>SCORE ANOMALIE</Text>
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>{data.ai_score}</Text>
                <Text style={[styles.statSub, { color: colors.textMuted }]}>
                  {data.ai_threshold != null ? `seuil ${data.ai_threshold}` : ''}
                </Text>
              </View>
              <View style={[styles.statBox, { borderColor: colors.borderColor, marginLeft: 8 }]}>
                <Text style={[styles.statLabel, { color: colors.textMuted }]}>CAUSE PROBABLE</Text>
                <Text style={[styles.statValue, { color: colors.textPrimary, fontSize: 13 }]} numberOfLines={2}>
                  {data.ai_culprit || '--'}
                </Text>
                <Text style={[styles.statSub, { color: accent }]}>
                  {data.ai_culprit_pct != null ? `${data.ai_culprit_pct}% du score` : ''}
                </Text>
              </View>
            </View>
          )}

          {/* Marge-au-seuil : mesure la plus proche de sa limite (A) */}
          {data.ai_relevant !== false && data.ai_min_margin != null && (
            <View style={[styles.marginRow, { borderColor: accent + '44', backgroundColor: accent + '10' }]}>
              <Text style={[styles.marginLabel, { color: colors.textMuted }]}>MARGE MINI AU SEUIL</Text>
              <Text style={[styles.marginVal, { color: accent }]}>
                {data.ai_min_margin}%  ·  {data.ai_min_margin_measure || '--'}
              </Text>
            </View>
          )}

          {/* Recommandation de maintenance (texte fourni par l'IA côté backend) */}
          <View style={[styles.noteBox, { backgroundColor: accent + '12', borderColor: accent + '44' }]}>
            <Text style={[styles.noteLabel, { color: accent }]}>
              {data.ai_relevant === false ? 'ÉCHEC · CAUSE PAR LES SEUILS' : 'RECOMMANDATION MAINTENANCE'}
            </Text>
            <Text style={[styles.note, { color: atypical ? colors.warnOrange : colors.textSecondary }]}>
              {data.ai_recommendation
                || (atypical && data.final === true
                  ? '⚠  Carte conforme aux seuils mais ATYPIQUE — à surveiller (dérive précoce).'
                  : atypical
                    ? '⚠  Carte atypique par rapport au profil des cartes normales.'
                    : '✓  Carte conforme au profil statistique des cartes normales.')}
            </Text>
          </View>
        </>
      ) : (
        <Text style={[styles.empty, { color: colors.textMuted }]}>
          {unavailable
            ? (data.ai_error || 'Modèle IA non chargé sur le banc.')
            : 'Le verdict IA s’affiche en fin de séquence (après FXS1 + FXS2).'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14, borderWidth: 2, marginBottom: 12, marginTop: 2, overflow: 'hidden',
    // Cadre/halo pour faire ressortir la synthèse IA
    shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 8,
  },
  topBar: { height: 4 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingTop: 12 },
  row: { flexDirection: 'row', alignItems: 'center' },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1, marginLeft: 8 },
  tagText: { fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  iconWrap: { width: 30, height: 30, borderRadius: 8, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
  icon: { fontSize: 15 },
  kicker: { fontSize: 13, fontWeight: '900', letterSpacing: 2 },
  sub: { fontSize: 8, fontWeight: '700', letterSpacing: 0.8, marginTop: 1 },

  heroWrap: { alignItems: 'center', paddingVertical: 12 },
  verdictBadge: { paddingHorizontal: 26, paddingVertical: 9, borderRadius: 10 },
  verdictText: { fontSize: 22, fontWeight: '900', letterSpacing: 2, color: '#06121f' },
  heroSub: { fontSize: 9, fontWeight: '700', letterSpacing: 1, marginTop: 5, textTransform: 'uppercase' },

  marginRow: { marginHorizontal: 12, marginTop: 10, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  marginLabel: { fontSize: 8, fontWeight: '800', letterSpacing: 1 },
  marginVal: { fontSize: 12, fontWeight: '900', fontFamily: 'monospace' },

  statsRow: { flexDirection: 'row', paddingHorizontal: 12 },
  statBox: { flex: 1, borderWidth: 1, borderRadius: 10, padding: 10, alignItems: 'center' },
  statLabel: { fontSize: 8, fontWeight: '800', letterSpacing: 1 },
  statValue: { fontSize: 20, fontWeight: '900', fontFamily: 'monospace', marginTop: 4, textAlign: 'center' },
  statSub: { fontSize: 9, fontWeight: '600', marginTop: 3 },

  noteBox: { margin: 12, padding: 10, borderRadius: 10, borderWidth: 1 },
  noteLabel: { fontSize: 8, fontWeight: '900', letterSpacing: 1, marginBottom: 4 },
  note: { fontSize: 11, lineHeight: 16, fontWeight: '600' },

  empty: { fontSize: 11, textAlign: 'center', paddingVertical: 14, paddingHorizontal: 16 },
});
