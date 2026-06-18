import React from 'react';
import { View, Text } from 'react-native';
import { useStore, lastNDays, todayKey } from '../store/Store';
import { Screen, TitleRow, Card, Pbar, Row, Between } from '../components/ui';
import { Sparkline } from '../components/charts';

export default function MetricsScreen({ navigation }) {
  const { s, theme, t, isAr, logsOn, todaySteps } = useStore();
  const lastLog = (ty) => { const a = s.logs.filter((l) => l.type === ty); return a.length ? a.sort((x, y) => new Date(y.t) - new Date(x.t))[0] : null; };
  const agg = (ty, mode) => lastNDays(14).map((d) => {
    const ls = s.logs.filter((l) => l.type === ty && l.t.slice(0, 10) === d);
    if (!ls.length) return 0;
    if (mode === 'count') return ls.length;
    if (mode === 'sumSteps') return ls.reduce((a, l) => a + (l.steps || 0), 0);
    if (mode === 'sumCount') return ls.reduce((a, l) => a + (l.count || 0), 0);
    if (mode === 'sumMins') return ls.reduce((a, l) => a + (l.mins || 0), 0);
    if (mode === 'avgHours') return ls.reduce((a, l) => a + (l.hours || 0), 0) / ls.length;
    if (mode === 'avgMood') return ls.reduce((a, l) => a + (l.mood || 0), 0) / ls.length;
    if (mode === 'lastWeight') return ls[ls.length - 1].kg;
    return ls.length;
  });
  const sg = s.prefs.stepGoal || 8000;
  const lw = lastLog('weight');
  const M = [
    { icon: '🩺', label: t('symptoms'), color: theme.bad, today: logsOn(todayKey()).filter((l) => l.type === 'symptom').length, latest: (() => { const l = lastLog('symptom'); return l ? t(l.sym || 'symptoms') : t('noneYet'); })(), series: agg('symptom', 'count') },
    { icon: '🚽', label: t('bowel'), color: theme.purple, today: logsOn(todayKey()).filter((l) => l.type === 'bowel').reduce((a, l) => a + (l.count || 0), 0) + '×', latest: (() => { const l = lastLog('bowel'); return l ? `${l.count || 0}× · Bristol ${l.bristol || '-'}` : t('noneYet'); })(), series: agg('bowel', 'sumCount') },
    { icon: '👟', label: t('tSteps'), color: theme.good, today: todaySteps().toLocaleString(), latest: `${todaySteps().toLocaleString()} / ${sg.toLocaleString()}`, series: agg('steps', 'sumSteps') },
    { icon: '😴', label: t('sleep'), color: theme.accent2, today: (() => { const l = logsOn(todayKey()).find((x) => x.type === 'sleep'); return l ? l.hours + 'h' : '—'; })(), latest: (() => { const l = lastLog('sleep'); return l ? `${l.hours || 0}h` : t('noneYet'); })(), series: agg('sleep', 'avgHours') },
    { icon: '🌤️', label: t('mood'), color: theme.warn, today: (() => { const l = logsOn(todayKey()).find((x) => x.type === 'mood'); return l ? l.mood + '/5' : '—'; })(), latest: (() => { const l = lastLog('mood'); return l ? t(['veryLow', 'low', 'okay', 'happy', 'great2'][(l.mood || 1) - 1]) : t('noneYet'); })(), series: agg('mood', 'avgMood') },
    { icon: '🏃', label: t('activity'), color: theme.good, today: logsOn(todayKey()).filter((l) => l.type === 'activity').reduce((a, l) => a + (l.mins || 0), 0) + 'm', latest: (() => { const l = lastLog('activity'); return l ? `${t(l.act || 'activity')} · ${l.mins || 0}m` : t('noneYet'); })(), series: agg('activity', 'sumMins') },
    { icon: '⚖️', label: t('tWeight'), color: theme.accent2, today: lw ? lw.kg + ' kg' : '—', latest: lw ? lw.kg + ' kg' : t('noneYet'), series: agg('weight', 'lastWeight') },
    { icon: '🍽️', label: t('meals'), color: theme.coral, today: logsOn(todayKey()).filter((l) => l.type === 'meal').length, latest: (() => { const l = lastLog('meal'); return l ? t(l.mealType || 'meals') : t('noneYet'); })(), series: agg('meal', 'count') },
  ];
  const completeness = Math.round((lastNDays(14).filter((d) => logsOn(d).length > 0).length / 14) * 100);
  return (
    <Screen>
      <TitleRow title={t('metricsT')} sub={t('metricsSub')} onBack={() => navigation.goBack()} />
      <Card glass>
        <Between><View><Text style={{ color: theme.txt, fontSize: 14, fontWeight: '700' }}>{t('dataCompleteness')}</Text><Text style={{ color: theme.muted, fontSize: 12 }}>{isAr ? 'آخر ١٤ يومًا' : 'Last 14 days'}</Text></View><Text style={{ color: theme.accent, fontSize: 26, fontWeight: '800' }}>{completeness}%</Text></Between>
        <View style={{ marginTop: 10 }}><Pbar pct={completeness} /></View>
      </Card>
      {s.disc ? (
        <Card onPress={() => navigation.navigate('Disc')} style={{ backgroundColor: theme.purple + '22', borderColor: theme.purple }}>
          <Between><Row style={{ gap: 11 }}><Text style={{ fontSize: 24 }}>🧭</Text><View><Text style={{ color: theme.txt, fontWeight: '700', fontSize: 14 }}>IBD-DISC</Text><Text style={{ color: theme.muted, fontSize: 12 }}>{new Date(s.disc.date).toLocaleDateString()}</Text></View></Row><Text style={{ color: theme.purple, fontSize: 20, fontWeight: '800' }}>{Object.values(s.disc.answers).reduce((a, b) => a + b, 0)}/100</Text></Between>
        </Card>
      ) : null}
      {M.map((m, i) => (
        <Card key={i}>
          <Between style={{ marginBottom: 8 }}>
            <Row style={{ gap: 11 }}><View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: theme.card2, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 20 }}>{m.icon}</Text></View><View><Text style={{ color: theme.txt, fontWeight: '700', fontSize: 14.5 }}>{m.label}</Text><Text style={{ color: theme.muted, fontSize: 12 }}>{m.latest}</Text></View></Row>
            <View style={{ alignItems: 'flex-end' }}><Text style={{ color: m.color, fontSize: 18, fontWeight: '800' }}>{m.today}</Text><Text style={{ color: theme.faint, fontSize: 10.5 }}>{t('today2')}</Text></View>
          </Between>
          {m.series.some((x) => x > 0) ? <Sparkline values={m.series} color={m.color} /> : <Text style={{ color: theme.faint, fontSize: 11.5, textAlign: 'center', padding: 6 }}>{t('noneYet')}</Text>}
        </Card>
      ))}
    </Screen>
  );
}
