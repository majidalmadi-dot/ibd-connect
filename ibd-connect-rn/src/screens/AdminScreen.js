import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useStore } from '../store/Store';
import { Screen, TitleRow, Card, PrimaryButton, GhostButton, Field, Input, Chip, Row, Badge, SectionTitle } from '../components/ui';
import { BarChart } from '../components/charts';
import { lastNDays } from '../store/Store';

export default function AdminScreen({ navigation }) {
  const { s, theme, t, isAr, L } = useStore();
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [tab, setTab] = useState('dashboard');

  if (!authed) {
    return (
      <Screen>
        <TitleRow title={t('adminLogin')} sub={t('adminSub')} onBack={() => navigation.goBack()} />
        <Text style={{ fontSize: 42 }}>🛠️</Text>
        <Field label={t('email')}><Input value={email} onChangeText={setEmail} autoCapitalize="none" placeholder="admin@ibdconnect.app" /></Field>
        <Field label={t('password')}><Input value={pw} onChangeText={setPw} secureTextEntry placeholder="••••••••" /></Field>
        <PrimaryButton label={t('signIn')} onPress={() => setAuthed(true)} />
        <Text style={{ color: theme.faint, fontSize: 12, textAlign: 'center' }}>{isAr ? 'تجريبي: أي بريد/كلمة مرور' : 'Demo: any email / password'}</Text>
      </Screen>
    );
  }

  const reg = 128 + Math.floor(s.logs.length / 3);
  const week = lastNDays(7).map((d) => ({ label: new Date(d + 'T00:00').toLocaleDateString(isAr ? 'ar-SA' : 'en-GB', { weekday: 'short' }), value: 40 + Math.floor(Math.random() * 60) }));
  const tabs = [['dashboard', isAr ? 'اللوحة' : 'Dashboard'], ['learn', t('manageLearn')], ['tips', t('manageTips')]];

  return (
    <Screen>
      <TitleRow title={t('adminEntry')} sub={isAr ? 'مسؤول رئيسي · v1.0' : 'Super Admin · v1.0'} right={<GhostButton label={t('exitAdmin')} onPress={() => navigation.goBack()} style={{ paddingVertical: 8, paddingHorizontal: 12 }} />} />
      <Row style={{ gap: 8, flexWrap: 'wrap' }}>{tabs.map(([k, l]) => <Chip key={k} label={l} on={tab === k} onPress={() => setTab(k)} />)}</Row>
      {tab === 'dashboard' ? (<>
        <Row style={{ gap: 12, flexWrap: 'wrap' }}>
          {[[`${reg}`, t('regUsers')], [`${Math.round(reg * 0.62)}`, t('activeUsers')], [`${s.logs.length + 4210}`, t('totalLogs')], [`${s.learn.length + s.tips.length}`, t('contentItems')]].map(([v, l], i) => (
            <View key={i} style={{ width: '47%', backgroundColor: theme.card, borderColor: theme.line, borderWidth: 1, borderRadius: 16, padding: 16 }}><Text style={{ color: theme.txt, fontSize: 26, fontWeight: '800' }}>{v}</Text><Text style={{ color: theme.muted, fontSize: 12 }}>{l}</Text></View>
          ))}
        </Row>
        <Card><SectionTitle>{isAr ? 'النشاط الأسبوعي' : 'Weekly activity'}</SectionTitle><View style={{ marginTop: 10 }}><BarChart data={week} color={theme.accent} /></View></Card>
      </>) : (
        <Card>
          {(tab === 'learn' ? s.learn : s.tips).map((item) => (
            <Row key={item.id} style={{ paddingVertical: 13, borderBottomColor: theme.line, borderBottomWidth: 1 }}>
              <View style={{ width: 40, height: 40, borderRadius: 11, backgroundColor: theme.card2, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 18 }}>{item.icon}</Text></View>
              <View style={{ flex: 1 }}><Text style={{ color: theme.txt, fontSize: 14, fontWeight: '600' }}>{L(item[isAr ? 'ar' : 'en'])}</Text><Text style={{ color: theme.muted, fontSize: 11.5 }}>{item.cat || '—'}{item.source === 'SGA' ? ' · SGA' : ''}</Text></View>
              <Badge tone="good" label={t('published')} />
            </Row>
          ))}
        </Card>
      )}
    </Screen>
  );
}
