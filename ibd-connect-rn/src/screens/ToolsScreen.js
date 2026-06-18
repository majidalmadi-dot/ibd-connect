import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useStore } from '../store/Store';
import { Screen, TitleRow, Card, Chip, Row } from '../components/ui';

const TOOLS = [
  { id: 'bmi', cat: 'core', icon: '⚖️', name: 'tBmi', sub: 'tBmiSub' },
  { id: 'cal', cat: 'core', icon: '🔥', name: 'tCal', sub: 'tCalSub' },
  { id: 'hydra', cat: 'core', icon: '💧', name: 'tHydra', sub: 'tHydraSub' },
  { id: 'steps', cat: 'core', icon: '👟', name: 'tSteps', sub: 'tStepsSub' },
  { id: 'ibw', cat: 'body', icon: '🎯', name: 'tIbw', sub: 'tIbwSub' },
  { id: 'whtr', cat: 'body', icon: '📏', name: 'tWhtr', sub: 'tWhtrSub' },
  { id: 'protein', cat: 'body', icon: '🥩', name: 'tProtein', sub: 'tProteinSub' },
  { id: 'fluid', cat: 'ibd', icon: '🚰', name: 'tFluid', sub: 'tFluidSub' },
  { id: 'weight', cat: 'ibd', icon: '📉', name: 'tWeight', sub: 'tWeightSub' },
  { id: 'hr', cat: 'activity', icon: '❤️', name: 'tHr', sub: 'tHrSub' },
];

export default function ToolsScreen({ navigation }) {
  const { theme, t, isAr } = useStore();
  const [cat, setCat] = useState('core');
  const cats = [['core', isAr ? 'يومي' : 'Everyday'], ['body', isAr ? 'قياسات' : 'Body'], ['ibd', isAr ? 'عافية المرض' : 'IBD'], ['activity', isAr ? 'النشاط' : 'Activity']];
  const list = TOOLS.filter((x) => x.cat === cat);
  const open = (x) => { if (x.id === 'steps') navigation.navigate('Steps'); else if (x.id === 'weight') navigation.navigate('Weight'); else navigation.navigate('Calc', { id: x.id }); };
  return (
    <Screen>
      <TitleRow title={t('toolsT')} sub={t('toolsSub')} onBack={() => navigation.goBack()} />
      <Row style={{ gap: 8, flexWrap: 'wrap' }}>{cats.map(([v, l]) => <Chip key={v} label={l} on={cat === v} onPress={() => setCat(v)} />)}</Row>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {list.map((x) => (
          <TouchableOpacity key={x.id} onPress={() => open(x)} style={{ width: '47%', backgroundColor: theme.card, borderColor: theme.line, borderWidth: 1, borderRadius: 16, padding: 14, gap: 6 }}>
            <View style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: theme.card2, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 21 }}>{x.icon}</Text></View>
            <Text style={{ color: theme.txt, fontSize: 14.5, fontWeight: '700' }}>{t(x.name)}</Text>
            <Text style={{ color: theme.muted, fontSize: 12 }}>{t(x.sub)}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Card style={{ backgroundColor: theme.bg2 }}><Text style={{ color: theme.muted, fontSize: 12, lineHeight: 18 }}>ℹ️ {t('toolDisc')}</Text></Card>
    </Screen>
  );
}
