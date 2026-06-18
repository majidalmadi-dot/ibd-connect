import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useStore } from '../store/Store';
import { Screen, TitleRow, Card, PrimaryButton, Field, Input } from '../components/ui';
import { LineChart } from '../components/charts';

export default function WeightScreen({ navigation }) {
  const { s, theme, t, isAr, addLog, toast } = useStore();
  const [n, setN] = useState('');
  const ws = s.logs.filter((l) => l.type === 'weight').sort((a, b) => new Date(a.t) - new Date(b.t));
  const latest = ws.length ? ws[ws.length - 1].kg : null;
  const log = () => { const x = parseFloat(n) || 0; if (!x) return toast(t('fillFields')); addLog({ type: 'weight', kg: x }); setN(''); };
  return (
    <Screen>
      <TitleRow title={t('tWeight')} sub={t('tWeightSub')} onBack={() => navigation.goBack()} />
      <Card glass style={{ alignItems: 'center' }}>
        <Text style={{ color: theme.txt, fontSize: 34, fontWeight: '800' }}>{latest != null ? latest : '—'}</Text>
        <Text style={{ color: theme.muted, fontSize: 13 }}>{isAr ? 'آخر وزن مسجّل (كجم)' : 'Latest logged weight (kg)'}</Text>
      </Card>
      <Field label={t('logWeight')}><Input value={n} onChangeText={setN} keyboardType="decimal-pad" placeholder="70" /></Field>
      <PrimaryButton label={`⚖️ ${t('logWeight')}`} onPress={log} />
      {ws.length > 1 ? (
        <Card><Text style={{ color: theme.muted, fontSize: 12.5, fontWeight: '700', marginBottom: 10 }}>{t('tWeight')}</Text><LineChart values={ws.map((w) => w.kg)} color={theme.accent2} height={160} /></Card>
      ) : (
        <Card style={{ alignItems: 'center', padding: 30 }}><Text style={{ fontSize: 36 }}>📉</Text><Text style={{ color: theme.muted, fontSize: 13, textAlign: 'center', marginTop: 8 }}>{isAr ? 'سجّل وزنك مرتين على الأقل لرؤية الاتجاه.' : 'Log your weight at least twice to see a trend.'}</Text></Card>
      )}
      <Card style={{ backgroundColor: theme.bg2 }}><Text style={{ color: theme.muted, fontSize: 12, lineHeight: 18 }}>ℹ️ {t('toolDisc')}</Text></Card>
    </Screen>
  );
}
