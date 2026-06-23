import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../constants/theme';

export default function FxsSelector({ selected, onSelect }) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textMuted }]}>PORT :</Text>
      <View style={[styles.group, { backgroundColor: colors.bgCard, borderColor: colors.borderColor, marginLeft: 8 }]}>
        {['FXS1', 'FXS2'].map((fxs, i) => {
          const active = selected === fxs;
          return (
            <TouchableOpacity
              key={fxs}
              style={[styles.btn, active && {
                backgroundColor: colors.accent + '20', borderWidth: 1, borderColor: colors.accent,
              }, i > 0 && { marginLeft: 3 }]}
              onPress={() => onSelect(fxs)}
              activeOpacity={0.7}
            >
              <View style={[styles.dot, { backgroundColor: active ? colors.accent : colors.textMuted }]} />
              <Text style={[styles.btnText, {
                color: active ? colors.accent : colors.textMuted, marginLeft: 6,
              }]}>{fxs.replace('FXS', 'FXS ')}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  label: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  group: { flex: 1, flexDirection: 'row', borderRadius: 8, padding: 3, borderWidth: 1 },
  btn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 8, borderRadius: 6, borderWidth: 1, borderColor: 'transparent',
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  btnText: { fontSize: 11, fontWeight: '800', letterSpacing: 1 },
});
