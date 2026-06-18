import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useStore } from '../store/Store';
import { THEMES } from '../theme/themes';
import { Screen, TitleRow, SectionTitle } from '../components/ui';

function ThemeCard({ th, on, onPress }) {
  const { isAr } = useStore();
  return (
    <TouchableOpacity onPress={onPress} style={{ width: '31%', borderRadius: 16, overflow: 'hidden', borderWidth: 2, borderColor: on ? th.accent : th.line, aspectRatio: 0.62 }}>
      <View style={{ flex: 1, backgroundColor: th.bg, padding: 8 }}>
        <View style={{ flex: 1, backgroundColor: th.card, borderColor: th.line, borderWidth: 1, borderRadius: 8, padding: 6, gap: 5 }}>
          <View style={{ height: 6, borderRadius: 3, width: '60%', backgroundColor: th.accent }} />
          <View style={{ height: 6, borderRadius: 3, width: '90%', backgroundColor: th.line }} />
          <View style={{ height: 6, borderRadius: 3, width: '75%', backgroundColor: th.line }} />
          <View style={{ flex: 1 }} />
          <View style={{ flexDirection: 'row', gap: 4 }}><View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: th.accent }} /><View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: th.accent2 }} /></View>
        </View>
      </View>
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 6, backgroundColor: 'rgba(0,0,0,0.45)' }}><Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{isAr ? th.ar : th.en}</Text></View>
      {on ? <View style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: 11, backgroundColor: th.accent, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#04221d', fontWeight: '800', fontSize: 13 }}>✓</Text></View> : null}
    </TouchableOpacity>
  );
}

export default function ThemeScreen({ navigation }) {
  const { s, t, setTheme, toast } = useStore();
  const dark = THEMES.filter((x) => x.mode === 'dark');
  const light = THEMES.filter((x) => x.mode === 'light');
  const pick = (id) => { setTheme(id); toast(t('saved')); };
  const grid = (arr) => <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>{arr.map((th) => <ThemeCard key={th.id} th={th} on={s.prefs.theme === th.id} onPress={() => pick(th.id)} />)}</View>;
  return (
    <Screen>
      <TitleRow title={t('themeT')} sub={t('themeSub')} onBack={() => navigation.goBack()} />
      <SectionTitle>🌙 {t('darkThemes')}</SectionTitle>
      {grid(dark)}
      <SectionTitle>☀️ {t('lightThemes')}</SectionTitle>
      {grid(light)}
    </Screen>
  );
}
