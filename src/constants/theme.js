import React, { createContext, useContext, useState } from 'react';

const DARK = {
  mode: 'dark',
  // Backgrounds - layered depth
  bgPrimary:    '#080c14',
  bgSecondary:  '#0e1524',
  bgCard:       '#131d30',
  bgCardAlt:    '#182640',
  bgInput:      '#101828',

  // Borders
  borderColor:  '#1e3050',
  borderActive: '#3a8eff',

  // Text hierarchy
  textPrimary:  '#f0f4fa',
  textSecondary:'#a0b4cc',
  textMuted:    '#5a7492',
  textWhite:    '#ffffff',

  // Primary accent (blue)
  accent:       '#3a8eff',
  accentLight:  '#6aadff',
  accentDark:   '#1e6cd6',

  // Semantic colors - vibrant
  passGreen:    '#00e68a',
  failRed:      '#ff4d6a',
  warnOrange:   '#ffb020',
  idleGray:     '#556b85',

  // Extra accents for variety
  cyan:         '#00d4ff',
  purple:       '#b366ff',
  teal:         '#00cca8',
  magenta:      '#ff4da6',
  gold:         '#ffd024',

  // Gauge
  gaugeBg:      '#0c1828',

  // LEDs
  pink:         '#e060ff',

  // Tab bar
  tabBg:        '#060a12',
  tabActive:    '#3a8eff',
  tabInactive:  '#4a6480',

  // Misc
  headerBg:     '#0b1220',
  cardShadow:   '#000000',

  // Section accent colors (for left-border cards)
  sectionVoltage:  '#00d4ff',
  sectionCurrent:  '#00e68a',
  sectionPower:    '#ffb020',
  sectionDial:     '#b366ff',
  sectionAudio:    '#ff4da6',
};

const LIGHT = {
  mode: 'light',
  // Backgrounds - clean layers
  bgPrimary:    '#eef1f6',
  bgSecondary:  '#f8f9fc',
  bgCard:       '#ffffff',
  bgCardAlt:    '#f3f5f9',
  bgInput:      '#eef1f6',

  // Borders
  borderColor:  '#d4dae4',
  borderActive: '#2e7de8',

  // Text
  textPrimary:  '#1a2640',
  textSecondary:'#4a5e7a',
  textMuted:    '#8898ae',
  textWhite:    '#ffffff',

  // Primary accent
  accent:       '#2e7de8',
  accentLight:  '#5a9ef0',
  accentDark:   '#1a5cbb',

  // Semantic - slightly deeper for contrast on white
  passGreen:    '#0dae6a',
  failRed:      '#e03050',
  warnOrange:   '#d4900a',
  idleGray:     '#94a3b8',

  // Extra accents
  cyan:         '#0aadcc',
  purple:       '#8844dd',
  teal:         '#0aaa8e',
  magenta:      '#cc3088',
  gold:         '#cca000',

  // Gauge
  gaugeBg:      '#dfe4ec',

  // LEDs
  pink:         '#c040e0',

  // Tab bar
  tabBg:        '#ffffff',
  tabActive:    '#2e7de8',
  tabInactive:  '#94a3b8',

  // Misc
  headerBg:     '#ffffff',
  cardShadow:   'rgba(0,0,0,0.06)',

  // Section accents
  sectionVoltage:  '#0aadcc',
  sectionCurrent:  '#0dae6a',
  sectionPower:    '#d4900a',
  sectionDial:     '#8844dd',
  sectionAudio:    '#cc3088',
};

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);
  const colors = isDark ? DARK : LIGHT;
  const toggle = () => setIsDark(prev => !prev);
  return (
    <ThemeContext.Provider value={{ colors, isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export const STATUS_LABELS = {
  IDLE:        'En attente',
  RUNNING:     'Initialisation...',
  RING_WAIT:   'Sonnerie : envoyez la commande téléphone…',
  CONSO:       'Mesure consommation…',
  STOPPED:     'Séquence interrompue',
  DONE:        'Séquence terminée',
  ERROR:       'Erreur',
};

// fxs_real émet des statuts par port : TR_FXS1, CL_FXS2, RING_FXS1, TRANS_FXS2...
const _MEAS_FR = { TR: 'Tension de repos', CL: 'Courant de ligne',
                   RING: 'Sonnerie', TRANS: 'Transmission' };
export function statusLabel(s) {
  if (!s) return '';
  if (STATUS_LABELS[s]) return STATUS_LABELS[s];
  const m = /^(TR|CL|RING|TRANS)_(FXS\d)$/.exec(s);
  if (m) return `${_MEAS_FR[m[1]]} — ${m[2]}`;
  return s;
}
