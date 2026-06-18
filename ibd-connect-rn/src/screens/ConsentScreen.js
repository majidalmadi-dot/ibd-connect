import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useStore } from '../store/Store';
import { Screen, TitleRow, PrimaryButton } from '../components/ui';
import { CheckItem } from './DisclaimerScreen';

export default function ConsentScreen({ navigation }) {
  const { theme, t, toast, update, isAr } = useStore();
  const [c, setC] = useState({ c1: false, c2: false, c3: false });
  const toggle = (k) => setC((p) => ({ ...p, [k]: !p[k] }));
  const next = () => {
    if (!c.c1 || !c.c2) return toast(t('selectOne'));
    update((st) => { st.prefs = { ...st.prefs, remindContent: c.c3 }; });
    navigation.navigate('Setup');
  };
  return (
    <Screen>
      <TitleRow title={t('consentT')} onBack={() => navigation.goBack()} />
      <Text style={{ fontSize: 42 }}>🔒</Text>
      <View style={{ gap: 10 }}>
        <CheckItem on={c.c1} onPress={() => toggle('c1')} label={t('consent1')} />
        <CheckItem on={c.c2} onPress={() => toggle('c2')} label={t('consent2')} />
        <CheckItem on={c.c3} onPress={() => toggle('c3')} label={t('consent3')} />
      </View>
      <Text style={{ color: theme.faint, fontSize: 12, textAlign: isAr ? 'right' : 'left' }}>{isAr ? 'الأول والثاني مطلوبان. الثالث اختياري.' : 'First two are required. The third is optional.'}</Text>
      <PrimaryButton label={t('continue')} onPress={next} />
    </Screen>
  );
}
