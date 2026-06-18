import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useStore } from '../store/Store';
import { DISC } from '../data/disc';
import { Screen, TitleRow, Card, PrimaryButton, GhostButton, Badge, Pbar, Between } from '../components/ui';
import { Radar } from '../components/charts';

export default function DiscScreen({ navigation }) {
  const { theme, t, isAr, toast, update } = useStore();
  const [idx, setIdx] = useState(0);
  const [ans, setAns] = useState({});
  const [done, setDone] = useState(false);

  if (done) {
    const items = DISC.map((q) => ({ q, v: ans[q.k] || 0 })).sort((a, b) => b.v - a.v);
    const total = items.reduce((s, i) => s + i.v, 0);
    const radarData = DISC.map((q) => ans[q.k] || 0);
    const labels = DISC.map((q) => (isAr ? q.short.ar : q.short.en));
    return (
      <Screen>
        <TitleRow title={t('discResult')} onBack={() => navigation.goBack()} />
        <Card glass style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 40 }}>🧭</Text>
          <Text style={{ color: theme.purple, fontSize: 34, fontWeight: '800' }}>{total}/100</Text>
          <Text style={{ color: theme.muted, fontSize: 13 }}>{isAr ? 'مجموع الأثر المُبلّغ عنه' : 'Total self-reported impact'}</Text>
        </Card>
        <Card>
          <Text style={{ color: theme.muted, fontSize: 12.5, fontWeight: '700', marginBottom: 6 }}>{t('theIbdDisk')}</Text>
          <View style={{ alignItems: 'center' }}><Radar data={radarData} labels={labels} size={300} /></View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginTop: 4 }}>
            {labels.map((l, i) => <Text key={i} style={{ color: theme.faint, fontSize: 10 }}>{l}{i < labels.length - 1 ? ' ·' : ''}</Text>)}
          </View>
        </Card>
        <Card>
          {items.map((i) => (
            <View key={i.q.k} style={{ marginBottom: 13 }}>
              <Between style={{ marginBottom: 5 }}><Text style={{ color: theme.txt, fontSize: 13.5, fontWeight: '600' }}>{isAr ? i.q.ar[0] : i.q.en[0]}</Text><Text style={{ color: theme.muted, fontSize: 13 }}>{i.v}/10</Text></Between>
              <Pbar pct={i.v * 10} color={i.v >= 7 ? theme.bad : i.v >= 4 ? theme.warn : theme.good} />
            </View>
          ))}
        </Card>
        <Card style={{ backgroundColor: theme.bg2 }}><Text style={{ color: theme.muted, fontSize: 13, lineHeight: 21 }}>ℹ️ {t('discNote')}</Text></Card>
        <GhostButton label={t('retake')} onPress={() => { setAns({}); setIdx(0); setDone(false); }} />
      </Screen>
    );
  }

  const q = DISC[idx];
  const labels = isAr ? q.ar : q.en;
  const answer = () => {
    if (!ans[q.k]) return toast(t('selectOne'));
    if (idx < DISC.length - 1) setIdx(idx + 1);
    else { update((st) => { st.disc = { date: new Date().toISOString(), answers: { ...ans } }; if (!st.badges.includes('disc')) st.badges = [...st.badges, 'disc']; }); setDone(true); }
  };
  return (
    <Screen>
      <TitleRow title={t('ibddisc')} onBack={() => navigation.goBack()} />
      <Between><Text style={{ color: theme.muted, fontSize: 13 }}>{t('question')} {idx + 1} {t('of')} {DISC.length}</Text><Badge tone="accent" label="IBD-DISC" /></Between>
      <Pbar pct={(idx / DISC.length) * 100} />
      <Card>
        <Text style={{ fontSize: 30, marginBottom: 8 }}>🧭</Text>
        <Text style={{ color: theme.txt, fontSize: 17, fontWeight: '700' }}>{labels[0]}</Text>
        <Text style={{ color: theme.muted, fontSize: 14, lineHeight: 21, marginTop: 8 }}>"{labels[1]}"</Text>
      </Card>
      <Between><Text style={{ color: theme.faint, fontSize: 12 }}>{t('notAtAll')}</Text><Text style={{ color: theme.faint, fontSize: 12 }}>{t('extremely')}</Text></Between>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        {Array.from({ length: 10 }).map((_, k) => { const val = k + 1; const on = ans[q.k] === val; return (
          <TouchableOpacity key={val} onPress={() => setAns((p) => ({ ...p, [q.k]: val }))} style={{ flex: 1, aspectRatio: 1, borderRadius: 10, backgroundColor: on ? theme.purple : theme.bg2, borderColor: on ? theme.purple : theme.line, borderWidth: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: on ? '#fff' : theme.muted, fontWeight: '700', fontSize: 13 }}>{val}</Text>
          </TouchableOpacity>
        ); })}
      </View>
      <PrimaryButton label={idx < DISC.length - 1 ? t('next') : t('viewSummary')} onPress={answer} />
    </Screen>
  );
}
