import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useStore } from '../store/Store';
import { Screen, TitleRow, Card, PrimaryButton, Field, Input, Between } from '../components/ui';

function Toggle({ on, onPress }) {
  const { theme } = useStore();
  return (
    <TouchableOpacity onPress={onPress} style={{ width: 48, height: 28, borderRadius: 16, backgroundColor: on ? theme.accent : theme.line, justifyContent: 'center' }}>
      <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff', marginHorizontal: 3, alignSelf: on ? 'flex-end' : 'flex-start' }} />
    </TouchableOpacity>
  );
}

function ToggleRow({ label, k }) {
  const { s, theme, update } = useStore();
  return (
    <Between style={{ paddingVertical: 14, borderBottomColor: theme.line, borderBottomWidth: 1 }}>
      <Text style={{ flex: 1, color: theme.txt, fontSize: 14.5, fontWeight: '600' }}>{label}</Text>
      <Toggle on={!!s.prefs[k]} onPress={() => update((st) => { st.prefs = { ...st.prefs, [k]: !st.prefs[k] }; })} />
    </Between>
  );
}

export default function SettingsScreens({ route, navigation }) {
  const { theme, t, isAr, toast } = useStore();
  const kind = route.params?.kind || 'notifs';
  const [pw, setPw] = useState({ a: '', b: '', c: '' });
  if (kind === 'changePw') {
    const change = () => { if (pw.b.length < 6) return toast(t('pwShort')); if (pw.b !== pw.c) return toast(t('pwMatch')); toast(t('saved')); navigation.goBack(); };
    return (
      <Screen>
        <TitleRow title={t('changePw')} onBack={() => navigation.goBack()} />
        <Field label={isAr ? 'كلمة المرور الحالية' : 'Current password'}><Input secureTextEntry value={pw.a} onChangeText={(x) => setPw((p) => ({ ...p, a: x }))} /></Field>
        <Field label={isAr ? 'كلمة المرور الجديدة' : 'New password'}><Input secureTextEntry value={pw.b} onChangeText={(x) => setPw((p) => ({ ...p, b: x }))} /></Field>
        <Field label={t('confirmPw')}><Input secureTextEntry value={pw.c} onChangeText={(x) => setPw((p) => ({ ...p, c: x }))} /></Field>
        <PrimaryButton label={t('save')} onPress={change} />
      </Screen>
    );
  }
  if (kind === 'privacy') {
    return (
      <Screen>
        <TitleRow title={t('privacy')} onBack={() => navigation.goBack()} />
        <Card><ToggleRow label={t('analyticsOptin')} k="analytics" /></Card>
        <Card style={{ backgroundColor: theme.bg2 }}><Text style={{ color: theme.muted, fontSize: 13, lineHeight: 20 }}>🔒 {isAr ? 'تُخزَّن جميع بياناتك الصحية محليًا على هذا الجهاز فقط. لا تُرسَل أسماء أدوية أو جرعات.' : 'All your health data is stored locally on this device only. No medication names or doses are ever transmitted.'}</Text></Card>
      </Screen>
    );
  }
  // notifs
  return (
    <Screen>
      <TitleRow title={t('notifications')} onBack={() => navigation.goBack()} />
      <Card>
        <ToggleRow label={t('remindDaily')} k="remindDaily" />
        <ToggleRow label={t('remindMed')} k="remindMed" />
        <ToggleRow label={t('remindContent')} k="remindContent" />
      </Card>
      <Text style={{ color: theme.muted, fontSize: 12.5, fontWeight: '700', textTransform: 'uppercase' }}>{t('nudgesLbl')}</Text>
      <Card>
        <ToggleRow label={t('nudgesLbl')} k="nudges" />
        <ToggleRow label={t('remindDaily')} k="nudgeDaily" />
        <ToggleRow label={t('tSteps')} k="nudgeSteps" />
        <ToggleRow label={t('tHydra')} k="nudgeHydra" />
      </Card>
    </Screen>
  );
}
