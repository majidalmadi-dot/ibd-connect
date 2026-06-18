import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useStore, lastNDays } from '../store/Store';
import { Screen, TitleRow, Card, PrimaryButton, GhostButton, Field, Input, Row, SectionTitle } from '../components/ui';
import { Ring, BarChart } from '../components/charts';

export default function StepsScreen({ navigation }) {
  const { s, theme, t, isAr, todaySteps, addLog, update, toast } = useStore();
  const [n, setN] = useState('');
  const [goalEdit, setGoalEdit] = useState(false);
  const [goalVal, setGoalVal] = useState(String(s.prefs.stepGoal || 8000));
  const goal = s.prefs.stepGoal || 8000;
  const cur = todaySteps();
  const week = lastNDays(7).map((d) => ({ label: new Date(d + 'T00:00').toLocaleDateString(isAr ? 'ar-SA' : 'en-GB', { weekday: 'short' }), value: s.logs.filter((l) => l.type === 'steps' && l.t.slice(0, 10) === d).reduce((a, l) => a + (l.steps || 0), 0) }));
  const log = () => { const x = parseInt(n) || 0; if (!x) return toast(t('fillFields')); addLog({ type: 'steps', steps: x }); setN(''); };
  const saveGoal = () => { update((st) => { st.prefs = { ...st.prefs, stepGoal: parseInt(goalVal) || 8000 }; }); setGoalEdit(false); toast(t('saved')); };
  return (
    <Screen>
      <TitleRow title={t('tSteps')} sub={t('tStepsSub')} onBack={() => navigation.goBack()} />
      <Card glass style={{ alignItems: 'center' }}>
        <Ring size={150} stroke={13} value={Math.min(cur / goal, 1)} max={1} color={theme.good} label="👟" />
        <Text style={{ color: theme.txt, fontSize: 34, fontWeight: '800', marginTop: 8 }}>{cur.toLocaleString()}</Text>
        <Text style={{ color: theme.muted, fontSize: 13 }}>{t('stepsToday')} · {isAr ? 'الهدف' : 'goal'} {goal.toLocaleString()}</Text>
      </Card>
      <Field label={t('logSteps')}><Input value={n} onChangeText={setN} keyboardType="number-pad" placeholder="3000" /></Field>
      <Row style={{ gap: 12 }}>
        <View style={{ flex: 1 }}><PrimaryButton label={`👟 ${t('logSteps')}`} onPress={log} /></View>
        <View style={{ flex: 1 }}><GhostButton label={`🎯 ${t('setGoal')}`} onPress={() => setGoalEdit(!goalEdit)} /></View>
      </Row>
      {goalEdit ? (<Row style={{ gap: 12 }}><View style={{ flex: 1 }}><Input value={goalVal} onChangeText={setGoalVal} keyboardType="number-pad" /></View><View style={{ flex: 1 }}><PrimaryButton label={t('save')} onPress={saveGoal} /></View></Row>) : null}
      <Card><SectionTitle>{t('weeklySteps')}</SectionTitle><View style={{ marginTop: 10 }}><BarChart data={week} color={theme.good} /></View></Card>
      <Card style={{ backgroundColor: theme.bg2 }}><Text style={{ color: theme.muted, fontSize: 12, lineHeight: 18 }}>ℹ️ {isAr ? '٧٬٠٠٠–١٠٬٠٠٠ خطوة يوميًا هدف عام شائع.' : '7,000–10,000 steps/day is a common general goal.'}</Text></Card>
    </Screen>
  );
}
