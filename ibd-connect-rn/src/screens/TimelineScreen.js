import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useStore, lastNDays } from '../store/Store';
import { Screen, TitleRow, Card, Chip, Row, Between } from '../components/ui';
import { logLabel, fmtDate, fmtTime } from '../utils/logs';

export default function TimelineScreen({ navigation }) {
  const { s, theme, t, isAr } = useStore();
  const [range, setRange] = useState(7);
  const [filter, setFilter] = useState('all');
  const days = lastNDays(range);
  const events = s.logs.filter((l) => days.includes(l.t.slice(0, 10)) && (filter === 'all' || l.type === filter)).sort((a, b) => new Date(b.t) - new Date(a.t));
  const types = [['all', 'allTypes'], ['symptom', 'symptoms'], ['bowel', 'bowel'], ['meal', 'meals'], ['sleep', 'sleep'], ['mood', 'mood'], ['activity', 'activity']];
  return (
    <Screen>
      <TitleRow title={t('timeline')} sub={t('tlSub')} onBack={() => navigation.goBack()} />
      <Row style={{ gap: 8 }}>{[[7, 'range7'], [14, 'range14'], [30, 'range30']].map(([v, k]) => <Chip key={v} label={t(k)} on={range === v} onPress={() => setRange(v)} />)}</Row>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}><Row style={{ gap: 8 }}>{types.map(([v, k]) => <Chip key={v} label={t(k)} on={filter === v} onPress={() => setFilter(v)} />)}</Row></ScrollView>
      {events.length ? (
        <Card>
          {events.map((l) => { const x = logLabel(l, t); return (
            <Row key={l.id} style={{ paddingVertical: 12 }}>
              <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: theme.card2, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 16 }}>{x.icon}</Text></View>
              <View style={{ flex: 1 }}><Between><Text style={{ color: theme.txt, fontWeight: '700', fontSize: 14 }}>{x.title}</Text><Text style={{ color: theme.faint, fontSize: 11 }}>{fmtDate(l.t, isAr)} · {fmtTime(l.t, isAr)}</Text></Between><Text style={{ color: theme.muted, fontSize: 12.5 }}>{x.sub}</Text></View>
            </Row>
          ); })}
        </Card>
      ) : (
        <Card style={{ alignItems: 'center', padding: 40 }}><Text style={{ fontSize: 40 }}>📅</Text><Text style={{ color: theme.muted, marginTop: 8 }}>{t('noEvents')}</Text></Card>
      )}
    </Screen>
  );
}
