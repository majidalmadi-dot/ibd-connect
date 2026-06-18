import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Share } from 'react-native';
import { useStore, lastNDays, todayKey } from '../store/Store';
import { DISC } from '../data/disc';
import { Screen, TitleRow, Card, PrimaryButton, Badge, Pbar, SectionTitle, Row, Between } from '../components/ui';
import { Gauge, BarChart, LineChart, Heatmap } from '../components/charts';

function Seg({ options, value, onChange }) {
  const { theme } = useStore();
  return (
    <View style={{ flexDirection: 'row', backgroundColor: theme.bg2, borderRadius: 13, padding: 4, gap: 4 }}>
      {options.map(([v, lbl]) => (
        <TouchableOpacity key={v} onPress={() => onChange(v)} style={{ flex: 1, paddingVertical: 9, borderRadius: 10, alignItems: 'center', backgroundColor: value === v ? theme.card2 : 'transparent' }}>
          <Text style={{ color: value === v ? theme.txt : theme.muted, fontWeight: '600', fontSize: 13 }}>{lbl}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function ReportsScreen() {
  const { s, theme, t, isAr, logsOn } = useStore();
  const [range, setRange] = useState(7);
  const days = lastNDays(range);
  const ls = s.logs.filter((l) => days.includes(l.t.slice(0, 10)));
  const hasData = ls.length > 0;
  const dayLogged = days.filter((d) => logsOn(d).length > 0).length;
  const avg = (a) => (a.length ? (a.reduce((x, y) => x + y, 0) / a.length).toFixed(1) : '—');
  const sleeps = ls.filter((l) => l.type === 'sleep').map((l) => l.hours);
  const moods = ls.filter((l) => l.type === 'mood').map((l) => l.mood);
  const consist = Math.round((dayLogged / range) * 100);
  const ctier = consist >= 80 ? 'excellent' : consist >= 55 ? 'steady' : consist >= 30 ? 'building' : 'gettingStarted';

  // symptom frequency
  const symCounts = {}; ls.filter((l) => l.type === 'symptom').forEach((l) => { symCounts[l.sym] = (symCounts[l.sym] || 0) + 1; });
  const symBars = Object.entries(symCounts).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, v]) => ({ label: t(k), value: v }));
  const lbl = (d) => new Date(d + 'T00:00').toLocaleDateString(isAr ? 'ar-SA' : 'en-GB', { day: 'numeric' });
  const bmBars = days.map((d) => ({ label: lbl(d), value: s.logs.filter((l) => l.type === 'bowel' && l.t.slice(0, 10) === d).reduce((a, l) => a + (l.count || 0), 0) }));
  const sevLine = days.map((d) => { const a = s.logs.filter((l) => l.type === 'symptom' && l.t.slice(0, 10) === d).map((l) => l.sev); return a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0; });
  const moodLine = days.map((d) => { const a = s.logs.filter((l) => l.type === 'mood' && l.t.slice(0, 10) === d).map((l) => l.mood); return a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0; });
  const sleepLine = days.map((d) => { const a = s.logs.filter((l) => l.type === 'sleep' && l.t.slice(0, 10) === d).map((l) => l.hours); return a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0; });

  const shareReport = async () => {
    const u = s.user;
    const dz = { uc: t('uc'), cd: t('cd'), ibdu: t('ibdu'), notsure: t('notsure') }[u.disease] || '—';
    const bmTotal = ls.filter((l) => l.type === 'bowel').reduce((a, l) => a + (l.count || 0), 0);
    let txt = `IBD Connect — ${isAr ? 'ملخّص للطبيب' : 'Clinician summary'}\n`;
    txt += `${isAr ? 'الفترة' : 'Period'}: ${range} ${isAr ? 'يوم' : 'days'} · ${new Date().toLocaleDateString()}\n`;
    txt += `${t('fullName')}: ${u.name || '—'} · ${t('diseaseType')}: ${dz}\n\n`;
    txt += `• ${t('daysLogged')}: ${dayLogged}/${range}\n• ${t('totalLogs')}: ${ls.length}\n`;
    txt += `• ${t('symFreq')}: ${ls.filter((l) => l.type === 'symptom').length}\n• ${t('bmFreq')}: ${bmTotal}\n`;
    txt += `• ${t('avgSleepH')}: ${avg(sleeps)}h\n• ${t('avgMood')}: ${avg(moods)}/5\n`;
    if (Object.keys(symCounts).length) { txt += `\n${t('symFreq')}:\n`; Object.entries(symCounts).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => { txt += `  - ${t(k)}: ${v}\n`; }); }
    if (s.disc) { const tot = Object.values(s.disc.answers).reduce((a, b) => a + b, 0); txt += `\nIBD-DISC: ${tot}/100 (${new Date(s.disc.date).toLocaleDateString()})\n`; }
    txt += `\n⚠️ ${isAr ? 'تقرير وصفي فقط — بيانات مُسجّلة ذاتيًا، وليس أداة تشخيص.' : 'Descriptive self-logged data only — not a diagnostic tool.'}`;
    try { await Share.share({ message: txt, title: 'IBD Connect Report' }); } catch (e) {}
  };

  return (
    <Screen>
      <TitleRow title={t('reportsT')} sub={t('reportsSub')} />
      <Seg options={[[7, t('weekly')], [30, t('monthly')]]} value={range} onChange={setRange} />
      {!hasData ? (
        <Card style={{ alignItems: 'center', padding: 40 }}><Text style={{ fontSize: 40 }}>📊</Text><Text style={{ color: theme.muted, marginTop: 8 }}>{t('noData')}</Text></Card>
      ) : (<>
        <Card glass>
          <View style={{ alignItems: 'center' }}>
            <Gauge pct={consist} />
            <Text style={{ color: theme.accent, fontSize: 30, fontWeight: '800', marginTop: -20 }}>{consist}%</Text>
            <Text style={{ color: theme.txt, fontSize: 13, fontWeight: '700' }}>{t('consistency')}</Text>
            <View style={{ marginTop: 6 }}><Badge tone="accent" label={t(ctier)} /></View>
          </View>
          <Text style={{ color: theme.muted, fontSize: 11.5, textAlign: 'center', marginTop: 12, lineHeight: 17 }}>ℹ️ {t('consistencyNote')}</Text>
        </Card>
        <Row style={{ gap: 12, flexWrap: 'wrap' }}>
          {[[`${dayLogged}`, t('daysLogged')], [`${ls.length}`, t('totalLogs')], [`${avg(sleeps)}h`, t('avgSleepH')], [`${avg(moods)}/5`, t('avgMood')]].map(([v, l], i) => (
            <View key={i} style={{ width: '47%', backgroundColor: theme.bg2, borderRadius: 14, padding: 13 }}><Text style={{ color: theme.txt, fontSize: 20, fontWeight: '800' }}>{v}</Text><Text style={{ color: theme.muted, fontSize: 11.5 }}>{l}</Text></View>
          ))}
        </Row>
        <Card><SectionTitle>{t('activityMap')}</SectionTitle><View style={{ marginTop: 8 }}><Heatmap days={lastNDays(range === 7 ? 14 : 30)} valueFor={(d) => logsOn(d).length} /></View></Card>
        {symBars.length ? <Card><SectionTitle>{t('symFreq')}</SectionTitle><View style={{ marginTop: 10 }}><BarChart data={symBars} color={theme.bad} /></View></Card> : null}
        <Card><SectionTitle>{t('bmFreq')}</SectionTitle><View style={{ marginTop: 10 }}><BarChart data={bmBars} color={theme.purple} height={120} /></View></Card>
        <Card><SectionTitle>{t('avgSev')}</SectionTitle><View style={{ marginTop: 10 }}><LineChart values={sevLine} color={theme.warn} maxY={3} /></View></Card>
        <Row style={{ gap: 12 }}>
          <Card style={{ flex: 1 }}><SectionTitle>{t('moodTrend')}</SectionTitle><View style={{ marginTop: 10 }}><LineChart values={moodLine} color={theme.accent} maxY={5} height={110} /></View></Card>
          <Card style={{ flex: 1 }}><SectionTitle>{t('sleepTrend')}</SectionTitle><View style={{ marginTop: 10 }}><LineChart values={sleepLine} color={theme.accent2} maxY={12} height={110} /></View></Card>
        </Row>
        <PrimaryButton label={`📤 ${t('exportPdf')}`} onPress={shareReport} />
        <Card style={{ backgroundColor: theme.bg2 }}><Text style={{ color: theme.muted, fontSize: 12.5, lineHeight: 19 }}>ℹ️ {t('reportNote')}</Text></Card>
      </>)}
    </Screen>
  );
}
