import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useStore } from '../store/Store';
import { PrimaryButton, GhostButton } from '../components/ui';

export default function OnboardingScreen({ navigation }) {
  const { theme, t } = useStore();
  const [i, setI] = useState(0);
  const slides = [['📝', 'ob1t', 'ob1d'], ['📈', 'ob2t', 'ob2d'], ['🤝', 'ob3t', 'ob3d']];
  const [emoji, tk, dk] = slides[i];
  const next = () => { if (i < 2) setI(i + 1); else navigation.navigate('Disclaimer'); };
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg, padding: 22, paddingTop: 60 }}>
      <View style={{ alignItems: 'flex-end' }}>
        <GhostButton label={t('skip')} onPress={() => navigation.navigate('Disclaimer')} style={{ paddingVertical: 8, paddingHorizontal: 16 }} />
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 22 }}>
        <View style={{ width: 160, height: 160, borderRadius: 40, backgroundColor: theme.accentD, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 74 }}>{emoji}</Text></View>
        <Text style={{ color: theme.txt, fontSize: 24, fontWeight: '800', textAlign: 'center' }}>{t(tk)}</Text>
        <Text style={{ color: theme.muted, fontSize: 15, textAlign: 'center', lineHeight: 23, maxWidth: 340 }}>{t(dk)}</Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 7, justifyContent: 'center', marginBottom: 22 }}>
        {[0, 1, 2].map((k) => <View key={k} style={{ width: k === i ? 22 : 8, height: 8, borderRadius: 5, backgroundColor: k === i ? theme.accent : theme.line }} />)}
      </View>
      <PrimaryButton label={i < 2 ? t('next') : t('getStarted')} onPress={next} />
    </View>
  );
}
