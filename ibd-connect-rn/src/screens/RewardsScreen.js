import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useStore } from '../store/Store';
import { QUESTS, BADGES } from '../data/misc';
import { Screen, TitleRow, Card, Pbar, Badge, Row, Between, SectionTitle } from '../components/ui';
import { TriRings } from '../components/charts';

export default function RewardsScreen({ navigation }) {
  const { s, theme, t, isAr, levelInfo, streak, goals, questProg, claimQuest } = useStore();
  const lv = levelInfo();
  const claimed = QUESTS.filter((q) => s.game.quests[q.id] === 'claimed').length;
  const g = goals();
  return (
    <Screen>
      <TitleRow title={t('rewardsT')} sub={t('rewardsSub')} onBack={() => navigation.goBack()} />
      <Card glass style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 48 }}>{lv.icon}</Text>
        <Text style={{ color: theme.txt, fontSize: 20, fontWeight: '800', marginTop: 4 }}>{t('levelLbl')} {lv.level} · {isAr ? lv.ar : lv.en}</Text>
        <View style={{ width: '100%', marginVertical: 10 }}><Pbar pct={lv.pct} /></View>
        <Text style={{ color: theme.muted, fontSize: 12.5 }}>{lv.xpIn} / {lv.xpFor} XP</Text>
      </Card>
      <Row style={{ gap: 12 }}>
        {[[`${lv.xp}`, t('totalXp')], [`🔥 ${streak()}`, t('streak')], [`${claimed}`, t('questsDone')]].map(([v, l], i) => (
          <View key={i} style={{ flex: 1, backgroundColor: theme.bg2, borderRadius: 14, padding: 13 }}><Text style={{ color: theme.txt, fontSize: 20, fontWeight: '800' }}>{v}</Text><Text style={{ color: theme.muted, fontSize: 11.5 }}>{l}</Text></View>
        ))}
      </Row>
      <SectionTitle>{t('dailyGoals')}</SectionTitle>
      <Card>
        <Row style={{ gap: 18 }}>
          <TriRings goals={g} />
          <View style={{ flex: 1 }}>{g.map((x) => (
            <View key={x.key} style={{ marginBottom: 10 }}>
              <Between style={{ marginBottom: 4 }}><Text style={{ color: theme.txt, fontSize: 13, fontWeight: '600' }}>{x.label}</Text><Text style={{ color: x.color, fontSize: 12.5, fontWeight: '700' }}>{x.val}/{x.goal}</Text></Between>
              <Pbar pct={Math.min((x.val / x.goal) * 100, 100)} color={x.color} />
            </View>
          ))}</View>
        </Row>
      </Card>
      <SectionTitle>{t('quests')}</SectionTitle>
      <Card>
        {QUESTS.map((q) => { const p = Math.min(questProg(q.id), q.goal); const st = s.game.quests[q.id]; const ready = st === 'ready'; const done = st === 'claimed'; return (
          <Row key={q.id} style={{ paddingVertical: 13, borderBottomColor: theme.line, borderBottomWidth: 1 }}>
            <View style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: theme.card2, alignItems: 'center', justifyContent: 'center', opacity: done ? 0.5 : 1 }}><Text style={{ fontSize: 20 }}>{q.icon}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.txt, fontSize: 13.5, fontWeight: '600', opacity: done ? 0.6 : 1 }}>{isAr ? q.ar : q.en}</Text>
              <Row style={{ gap: 10, marginTop: 6 }}><View style={{ flex: 1 }}><Pbar pct={(p / q.goal) * 100} /></View><Text style={{ color: theme.muted, fontSize: 11.5 }}>{p}/{q.goal} · +{q.xp}XP</Text></Row>
            </View>
            {ready ? <TouchableOpacity onPress={() => claimQuest(q.id)} style={{ backgroundColor: theme.accent, borderRadius: 11, paddingVertical: 8, paddingHorizontal: 14 }}><Text style={{ color: theme.mode === 'light' ? '#fff' : '#04221d', fontWeight: '700', fontSize: 12.5 }}>{t('claim')}</Text></TouchableOpacity> : done ? <Badge tone="good" label="✓" /> : null}
          </Row>
        ); })}
      </Card>
      <SectionTitle>{t('achievements')}</SectionTitle>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {BADGES.map((b) => { const got = s.badges.includes(b.id); return (
          <View key={b.id} style={{ width: '31%', alignItems: 'center', backgroundColor: theme.card, borderColor: theme.line, borderWidth: 1, borderRadius: 16, padding: 14, opacity: got ? 1 : 0.4 }}>
            <Text style={{ fontSize: 30 }}>{b.icon}</Text><Text style={{ color: theme.txt, fontSize: 11.5, textAlign: 'center', marginTop: 4 }}>{isAr ? b.ar : b.en}</Text>
          </View>
        ); })}
      </View>
    </Screen>
  );
}
