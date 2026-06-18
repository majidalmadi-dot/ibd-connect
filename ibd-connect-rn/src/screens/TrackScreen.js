import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useStore } from '../store/Store';
import { Screen, TitleRow, Card, Badge, Row } from '../components/ui';

const MODS = [['symptom', '🩺', 'symptoms', null], ['bowel', '🚽', 'bowel', 'Bristol'], ['meal', '🍽️', 'meals', null], ['sleep', '😴', 'sleep', null], ['mood', '🌤️', 'mood', null], ['activity', '🏃', 'activity', null]];

export default function TrackScreen({ navigation }) {
  const { s, theme, t, isAr } = useStore();
  const countType = (ty) => s.logs.filter((l) => l.type === ty).length;
  const tile = (label, sub, icon, onPress) => (
    <Card onPress={onPress} style={{ flex: 1 }}>
      <Text style={{ fontSize: 26 }}>{icon}</Text>
      <Text style={{ color: theme.txt, fontSize: 14.5, fontWeight: '700', marginTop: 8 }}>{label}</Text>
      <Text style={{ color: theme.muted, fontSize: 12 }}>{sub}</Text>
    </Card>
  );
  return (
    <Screen>
      <TitleRow title={t('trackTitle')} sub={t('trackSub')} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {MODS.map(([ty, ic, k, tag]) => (
          <TouchableOpacity key={ty} onPress={() => navigation.navigate('Logger', { type: ty })} style={{ width: '47%', backgroundColor: theme.card, borderColor: theme.line, borderWidth: 1, borderRadius: 16, padding: 15, minHeight: 120, justifyContent: 'center' }}>
            <Text style={{ fontSize: 30 }}>{ic}</Text>
            <Text style={{ color: theme.txt, fontSize: 15, fontWeight: '700', marginTop: 6 }}>{t(k)}</Text>
            {tag ? <View style={{ marginTop: 4 }}><Badge tone="accent" label={tag} /></View> : null}
            <Text style={{ color: theme.muted, fontSize: 12, marginTop: 4 }}>{countType(ty)} {isAr ? 'سجل' : 'logs'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Card onPress={() => navigation.navigate('Disc')}>
        <Row><Text style={{ fontSize: 28 }}>🧭</Text><View style={{ flex: 1 }}><Text style={{ color: theme.txt, fontWeight: '700', fontSize: 15.5 }}>{t('ibddisc')}</Text><Text style={{ color: theme.muted, fontSize: 12.5 }}>{t('ibddiscSub')}</Text></View><Text style={{ color: theme.faint, fontSize: 18 }}>{isAr ? '‹' : '›'}</Text></Row>
      </Card>
      <Card onPress={() => navigation.navigate('Tools')}>
        <Row><Text style={{ fontSize: 28 }}>🧮</Text><View style={{ flex: 1 }}><Text style={{ color: theme.txt, fontWeight: '700', fontSize: 15.5 }}>{t('toolsT')}</Text><Text style={{ color: theme.muted, fontSize: 12.5 }}>{t('toolsSub')}</Text></View><Text style={{ color: theme.faint, fontSize: 18 }}>{isAr ? '‹' : '›'}</Text></Row>
      </Card>
      <Row style={{ gap: 12 }}>
        {tile(t('tSteps'), `${countType('steps')} ${isAr ? 'سجل' : 'logs'}`, '👟', () => navigation.navigate('Steps'))}
        {tile(t('tWeight'), `${countType('weight')} ${isAr ? 'سجل' : 'logs'}`, '⚖️', () => navigation.navigate('Weight'))}
      </Row>
      <Card onPress={() => navigation.navigate('Meds')}>
        <Row><Text style={{ fontSize: 28 }}>⏰</Text><View style={{ flex: 1 }}><Text style={{ color: theme.txt, fontWeight: '700', fontSize: 15.5 }}>{t('meds')}</Text><Text style={{ color: theme.muted, fontSize: 12.5 }}>{s.reminders.length} {isAr ? 'تذكير' : 'reminders'}</Text></View><Text style={{ color: theme.faint, fontSize: 18 }}>{isAr ? '‹' : '›'}</Text></Row>
      </Card>
      <Card onPress={() => navigation.navigate('Metrics')}>
        <Row><Text style={{ fontSize: 28 }}>📋</Text><View style={{ flex: 1 }}><Text style={{ color: theme.txt, fontWeight: '700', fontSize: 15.5 }}>{t('metricsT')}</Text><Text style={{ color: theme.muted, fontSize: 12.5 }}>{t('metricsSub')}</Text></View><Text style={{ color: theme.faint, fontSize: 18 }}>{isAr ? '‹' : '›'}</Text></Row>
      </Card>
      <Row style={{ gap: 12 }}>
        {tile(t('timeline'), t('tlSub'), '📅', () => navigation.navigate('Timeline'))}
        {tile(t('history'), `${s.logs.length} ${isAr ? 'إجمالًا' : 'total'}`, '🗂️', () => navigation.navigate('History'))}
      </Row>
    </Screen>
  );
}
