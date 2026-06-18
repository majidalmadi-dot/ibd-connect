import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore, todayKey, lastNDays } from '../store/Store';
import { BADGES } from '../data/misc';
import { Card, PrimaryButton, Badge, Pbar, SectionTitle, Row, Between } from '../components/ui';
import { TriRings, Ring, Heatmap } from '../components/charts';
import { logLabel, fmtTime } from '../utils/logs';

const QUICK = [['symptom', '🩺', 'symptoms'], ['bowel', '🚽', 'bowel'], ['meal', '🍽️', 'meals'], ['sleep', '😴', 'sleep'], ['mood', '🌤️', 'mood'], ['activity', '🏃', 'activity']];

function greeting(t) { const h = new Date().getHours(); return h < 12 ? t('goodMorning') : h < 18 ? t('goodAfternoon') : t('goodEvening'); }

function getNudge(store) {
  const { s, t, logsOn, streak, todaySteps } = store;
  if (!s.prefs.nudges) return null;
  const tk = todayKey(); const dz = s.nudgeDismiss || {};
  const fresh = (id) => dz[id] !== tk;
  if (s.prefs.nudgeDaily && logsOn(tk).length === 0 && fresh('daily')) return { id: 'daily', icon: '📝', text: t('nudgeLogToday') };
  if (s.prefs.nudgeSteps && todaySteps() < (s.prefs.stepGoal || 8000) && new Date().getHours() >= 14 && fresh('steps')) return { id: 'steps', icon: '🚶', text: t('nudgeSteps') };
  if (s.prefs.nudgeHydra && fresh('hydra')) return { id: 'hydra', icon: '💧', text: t('nudgeHydra') };
  return null;
}

export default function TodayScreen({ navigation }) {
  const store = useStore();
  const { s, theme, t, isAr, logsOn, streak, weekActiveDays, todaySteps, levelInfo, goals, update } = store;
  const insets = useSafeAreaInsets();
  const today = logsOn(todayKey());
  const lv = levelInfo();
  const g = goals();
  const stepGoal = s.prefs.stepGoal || 8000;
  const stepsNow = todaySteps();
  const nudge = getNudge(store);
  const u = s.user;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={{ padding: 18, paddingTop: insets.top + 12, paddingBottom: 30, gap: 14 }} showsVerticalScrollIndicator={false}>
      <Between>
        <View>
          <Text style={{ color: theme.txt, fontSize: 22, fontWeight: '800', textAlign: isAr ? 'right' : 'left' }}>{greeting(t)}{u.name ? ', ' + u.name.split(' ')[0] : ''}</Text>
          <Text style={{ color: theme.muted, fontSize: 13, textAlign: isAr ? 'right' : 'left' }}>{new Date().toLocaleDateString(isAr ? 'ar-SA' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('More')} style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: theme.card, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 18 }}>{u.avatar}</Text></TouchableOpacity>
      </Between>

      {nudge ? (
        <Card style={{ backgroundColor: theme.accentD, borderColor: theme.accent }}>
          <Row>
            <Text style={{ fontSize: 24 }}>{nudge.icon}</Text>
            <Text style={{ flex: 1, color: theme.txt, fontSize: 13.5, fontWeight: '600' }}>{nudge.text}</Text>
            <TouchableOpacity onPress={() => update((st) => { st.nudgeDismiss = { ...st.nudgeDismiss, [nudge.id]: todayKey() }; })}><Text style={{ color: theme.muted, fontSize: 16 }}>✕</Text></TouchableOpacity>
          </Row>
        </Card>
      ) : null}

      <Card onPress={() => navigation.navigate('Rewards')}>
        <Between>
          <Row style={{ gap: 11 }}>
            <View style={{ width: 42, height: 42, borderRadius: 13, backgroundColor: theme.accentD, borderColor: theme.accent, borderWidth: 1, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 21 }}>{lv.icon}</Text></View>
            <View><Text style={{ color: theme.txt, fontWeight: '700', fontSize: 15 }}>{t('levelLbl')} {lv.level} · {isAr ? lv.ar : lv.en}</Text><Text style={{ color: theme.muted, fontSize: 12 }}>{lv.xpIn} / {lv.xpFor} XP</Text></View>
          </Row>
          <Badge tone="accent" label={`🔥 ${streak()}`} />
        </Between>
        <View style={{ marginTop: 11 }}><Pbar pct={lv.pct} /></View>
      </Card>

      <Card glass>
        <Row style={{ gap: 18 }}>
          <TriRings goals={g} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: theme.accent, fontSize: 13, fontWeight: '700' }}>{t('todayCheckin')}</Text>
            <Text style={{ color: theme.muted, fontSize: 12.5, marginVertical: 6 }}>{today.length ? t('greatJob') : t('checkinSub')}</Text>
            {g.map((x) => (
              <Row key={x.key} style={{ gap: 7, marginBottom: 4 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: x.color }} />
                <Text style={{ flex: 1, color: theme.txt, fontSize: 12 }}>{x.label}</Text>
                <Text style={{ color: x.color, fontWeight: '700', fontSize: 12 }}>{x.val}/{x.goal}</Text>
              </Row>
            ))}
          </View>
        </Row>
        <PrimaryButton label={today.length ? t('quickLog') : t('startCheckin')} onPress={() => navigation.navigate('Track')} style={{ marginTop: 14 }} />
      </Card>

      <Row style={{ gap: 12 }}>
        {[[`🔥 ${streak()}`, t('streak')], [`${today.length}`, t('logsToday')], [`${weekActiveDays()}/7`, t('thisWeek')]].map(([v, l], i) => (
          <View key={i} style={{ flex: 1, backgroundColor: theme.bg2, borderRadius: 14, padding: 13 }}>
            <Text style={{ color: theme.txt, fontSize: 20, fontWeight: '800' }}>{v}</Text>
            <Text style={{ color: theme.muted, fontSize: 11.5, marginTop: 2 }}>{l}</Text>
          </View>
        ))}
      </Row>

      <Row style={{ gap: 12 }}>
        <Card onPress={() => navigation.navigate('Steps')} style={{ flex: 1 }}>
          <Row style={{ gap: 12 }}>
            <Ring size={56} stroke={6} value={Math.min(stepsNow / stepGoal, 1)} max={1} color={theme.good} label="👟" />
            <View><Text style={{ color: theme.txt, fontWeight: '700', fontSize: 14 }}>👟 {t('tSteps')}</Text><Text style={{ color: theme.muted, fontSize: 12 }}>{stepsNow.toLocaleString()} / {stepGoal.toLocaleString()}</Text></View>
          </Row>
        </Card>
        <Card onPress={() => navigation.navigate('Tools')} style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={{ fontSize: 26 }}>🧮</Text>
          <Text style={{ color: theme.txt, fontWeight: '700', fontSize: 14, marginTop: 6 }}>{t('toolsT')}</Text>
        </Card>
      </Row>

      <Card onPress={() => navigation.navigate('Metrics')}>
        <Row><Text style={{ fontSize: 26 }}>📋</Text><View style={{ flex: 1 }}><Text style={{ color: theme.txt, fontWeight: '700', fontSize: 15 }}>{t('metricsT')}</Text><Text style={{ color: theme.muted, fontSize: 12.5 }}>{t('metricsSub')}</Text></View><Text style={{ color: theme.faint, fontSize: 18 }}>{isAr ? '‹' : '›'}</Text></Row>
      </Card>

      <SectionTitle>{t('quickLog')}</SectionTitle>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {QUICK.map(([ty, ic, k]) => (
          <TouchableOpacity key={ty} onPress={() => navigation.navigate('Logger', { type: ty })} style={{ width: '31%', backgroundColor: theme.card, borderColor: theme.line, borderWidth: 1, borderRadius: 16, padding: 15, gap: 8 }}>
            <Text style={{ fontSize: 24 }}>{ic}</Text>
            <Text style={{ color: theme.txt, fontSize: 13.5, fontWeight: '600' }}>{t(k)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <SectionTitle>{t('activityMap')}</SectionTitle>
      <Card><Heatmap days={lastNDays(30)} valueFor={(d) => logsOn(d).length} /></Card>

      <SectionTitle>{t('todaySummary')}</SectionTitle>
      {today.length ? (
        <Card>
          {today.slice().reverse().map((l) => { const x = logLabel(l, t); return (
            <Row key={l.id} style={{ paddingVertical: 12, borderBottomColor: theme.line, borderBottomWidth: 1 }}>
              <View style={{ width: 40, height: 40, borderRadius: 11, backgroundColor: theme.card2, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 18 }}>{x.icon}</Text></View>
              <View style={{ flex: 1 }}><Text style={{ color: theme.txt, fontSize: 14.5, fontWeight: '600' }}>{x.title}</Text><Text style={{ color: theme.muted, fontSize: 12.5 }}>{x.sub}</Text></View>
              <Text style={{ color: theme.faint, fontSize: 12 }}>{fmtTime(l.t, isAr)}</Text>
            </Row>
          ); })}
        </Card>
      ) : (
        <Card style={{ alignItems: 'center', padding: 30 }}><Text style={{ fontSize: 40 }}>📭</Text><Text style={{ color: theme.txt, fontWeight: '700', marginTop: 10 }}>{t('nothingYet')}</Text><Text style={{ color: theme.muted, fontSize: 13.5, textAlign: 'center', marginTop: 8 }}>{t('emptyDash')}</Text></Card>
      )}

      <Between><SectionTitle>{t('achievements')}</SectionTitle><TouchableOpacity onPress={() => navigation.navigate('Rewards')}><Text style={{ color: theme.muted, fontSize: 12.5, fontWeight: '600' }}>{t('viewAll')}</Text></TouchableOpacity></Between>
      <Card>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}><Row style={{ gap: 14 }}>
          {BADGES.map((b) => { const got = s.badges.includes(b.id); return (
            <View key={b.id} style={{ alignItems: 'center', width: 64, opacity: got ? 1 : 0.35 }}>
              <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: got ? theme.accentD : theme.bg2, borderColor: got ? theme.accent : theme.line, borderWidth: 1, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 24 }}>{b.icon}</Text></View>
              <Text style={{ color: theme.muted, fontSize: 10.5, marginTop: 6, textAlign: 'center' }}>{isAr ? b.ar : b.en}</Text>
            </View>
          ); })}
        </Row></ScrollView>
      </Card>

      <Card onPress={() => navigation.navigate('Disc')} style={{ backgroundColor: theme.purple + '22', borderColor: theme.purple }}>
        <Row><Text style={{ fontSize: 26 }}>🧭</Text><View style={{ flex: 1 }}><Text style={{ color: theme.txt, fontWeight: '700', fontSize: 15 }}>{t('ibddisc')}</Text><Text style={{ color: theme.muted, fontSize: 12.5 }}>{t('ibddiscSub')}</Text></View><Text style={{ color: theme.faint, fontSize: 18 }}>{isAr ? '‹' : '›'}</Text></Row>
      </Card>
    </ScrollView>
  );
}
