import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useStore } from '../store/Store';
import { Screen, TitleRow, Card, PrimaryButton, GhostButton, Field, Input, Row } from '../components/ui';

export default function MedsScreen({ navigation }) {
  const { s, theme, t, isAr, update, toast } = useStore();
  const [time, setTime] = React.useState(s.prefs.medTime);
  const add = () => { update((st) => { st.prefs = { ...st.prefs, medTime: time }; st.reminders = [...st.reminders, { time, taken: false }]; }); toast(t('saved')); };
  const toggle = (i) => update((st) => { const r = [...st.reminders]; r[i] = { ...r[i], taken: !r[i].taken }; st.reminders = r; });
  return (
    <Screen>
      <TitleRow title={t('meds')} onBack={() => navigation.goBack()} />
      <Card style={{ backgroundColor: theme.bg2 }}><Text style={{ color: theme.muted, fontSize: 13, lineHeight: 20 }}>🔒 {t('medNote')}</Text></Card>
      <Field label={t('reminderTime')}><Input value={time} onChangeText={setTime} placeholder="20:00" /></Field>
      <PrimaryButton label={t('addReminder')} onPress={add} />
      {s.reminders.length ? (
        <Card>
          {s.reminders.map((r, i) => (
            <Row key={i} style={{ paddingVertical: 12, borderBottomColor: theme.line, borderBottomWidth: 1 }}>
              <View style={{ width: 40, height: 40, borderRadius: 11, backgroundColor: theme.card2, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 18 }}>⏰</Text></View>
              <View style={{ flex: 1 }}><Text style={{ color: theme.txt, fontWeight: '700' }}>{r.time}</Text><Text style={{ color: theme.muted, fontSize: 12.5 }}>{r.taken ? t('taken') : t('reminderTime')}</Text></View>
              <TouchableOpacity onPress={() => toggle(i)} style={{ paddingVertical: 8, paddingHorizontal: 14, borderRadius: 11, backgroundColor: r.taken ? theme.card2 : theme.accent }}><Text style={{ color: r.taken ? theme.muted : (theme.mode === 'light' ? '#fff' : '#04221d'), fontWeight: '700', fontSize: 12.5 }}>{r.taken ? t('taken') : t('markTaken')}</Text></TouchableOpacity>
            </Row>
          ))}
        </Card>
      ) : null}
    </Screen>
  );
}
