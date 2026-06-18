import React from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../store/Store';

export function Screen({ children, scroll = true, pad = true, topInset = true }) {
  const { theme } = useStore();
  const insets = useSafeAreaInsets();
  const top = topInset ? insets.top + 6 : 0;
  if (!scroll) return <View style={{ flex: 1, backgroundColor: theme.bg, paddingTop: top }}>{children}</View>;
  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={{ padding: pad ? 18 : 0, paddingTop: top + (pad ? 8 : 0), paddingBottom: 48, gap: 14 }} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  );
}

export function Card({ children, style, onPress, glass }) {
  const { theme } = useStore();
  const base = {
    backgroundColor: glass ? theme.accentD : theme.card,
    borderColor: glass ? theme.accent : theme.line,
    borderWidth: 1, borderRadius: 18, padding: 16,
  };
  if (onPress) return <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={[base, style]}>{children}</TouchableOpacity>;
  return <View style={[base, style]}>{children}</View>;
}

export function TitleRow({ title, sub, right, onBack }) {
  const { theme, isAr } = useStore();
  return (
    <View style={{ flexDirection: isAr ? 'row-reverse' : 'row', alignItems: 'center', gap: 12, marginBottom: 6 }}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: theme.card, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: theme.txt, fontSize: 22 }}>{isAr ? '›' : '‹'}</Text>
        </TouchableOpacity>
      ) : null}
      <View style={{ flex: 1 }}>
        <Text style={{ color: theme.txt, fontSize: 22, fontWeight: '800', textAlign: isAr ? 'right' : 'left' }}>{title}</Text>
        {sub ? <Text style={{ color: theme.muted, fontSize: 13, marginTop: 2, textAlign: isAr ? 'right' : 'left' }}>{sub}</Text> : null}
      </View>
      {right || null}
    </View>
  );
}

export function PrimaryButton({ label, onPress, style }) {
  const { theme } = useStore();
  return (
    <TouchableOpacity activeOpacity={0.88} onPress={onPress} style={[{ backgroundColor: theme.accent, borderRadius: 14, padding: 15, alignItems: 'center' }, style]}>
      <Text style={{ color: theme.mode === 'light' ? '#fff' : '#04221d', fontWeight: '800', fontSize: 15.5 }}>{label}</Text>
    </TouchableOpacity>
  );
}

export function GhostButton({ label, onPress, danger, style }) {
  const { theme } = useStore();
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={[{ backgroundColor: danger ? 'rgba(255,92,114,0.14)' : theme.card, borderColor: danger ? theme.bad : theme.line, borderWidth: 1, borderRadius: 14, padding: 15, alignItems: 'center' }, style]}>
      <Text style={{ color: danger ? theme.bad : theme.txt, fontWeight: '700', fontSize: 15 }}>{label}</Text>
    </TouchableOpacity>
  );
}

export function Chip({ label, on, onPress }) {
  const { theme } = useStore();
  return (
    <TouchableOpacity onPress={onPress} style={{ paddingVertical: 9, paddingHorizontal: 14, borderRadius: 11, backgroundColor: on ? theme.accentD : theme.bg2, borderColor: on ? theme.accent : theme.line, borderWidth: 1 }}>
      <Text style={{ color: on ? theme.accent : theme.muted, fontWeight: '600', fontSize: 13.5 }}>{label}</Text>
    </TouchableOpacity>
  );
}

export function Field({ label, children }) {
  const { theme, isAr } = useStore();
  return (
    <View style={{ gap: 7, marginBottom: 4 }}>
      {label ? <Text style={{ color: theme.muted, fontSize: 13, fontWeight: '600', textAlign: isAr ? 'right' : 'left' }}>{label}</Text> : null}
      {children}
    </View>
  );
}

export function Input(props) {
  const { theme, isAr } = useStore();
  return (
    <TextInput
      placeholderTextColor={theme.faint}
      {...props}
      style={[{ backgroundColor: theme.bg2, borderColor: theme.line, borderWidth: 1, borderRadius: 13, paddingHorizontal: 15, paddingVertical: 13, color: theme.txt, fontSize: 15, textAlign: isAr ? 'right' : 'left' }, props.style]}
    />
  );
}

export function Badge({ label, tone }) {
  const { theme } = useStore();
  const map = { accent: theme.accent, good: theme.good, warn: theme.warn, bad: theme.bad, purple: theme.purple };
  const c = map[tone] || theme.muted;
  return (
    <View style={{ paddingVertical: 4, paddingHorizontal: 10, borderRadius: 20, backgroundColor: c + '26', alignSelf: 'flex-start' }}>
      <Text style={{ color: c, fontSize: 11.5, fontWeight: '700' }}>{label}</Text>
    </View>
  );
}

export function Pbar({ pct, color }) {
  const { theme } = useStore();
  return (
    <View style={{ height: 7, borderRadius: 6, backgroundColor: theme.bg2, overflow: 'hidden' }}>
      <View style={{ height: '100%', width: `${Math.max(0, Math.min(100, pct))}%`, backgroundColor: color || theme.accent, borderRadius: 6 }} />
    </View>
  );
}

export function SectionTitle({ children }) {
  const { theme, isAr } = useStore();
  return <Text style={{ color: theme.muted, fontSize: 12.5, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase', marginTop: 4, textAlign: isAr ? 'right' : 'left' }}>{children}</Text>;
}

export function Row({ children, style }) {
  const { isAr } = useStore();
  return <View style={[{ flexDirection: isAr ? 'row-reverse' : 'row', alignItems: 'center', gap: 12 }, style]}>{children}</View>;
}

export function Between({ children, style }) {
  const { isAr } = useStore();
  return <View style={[{ flexDirection: isAr ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }, style]}>{children}</View>;
}
