import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useStore } from '../store/Store';
import { Screen, TitleRow, PrimaryButton } from '../components/ui';

export function CheckItem({ on, onPress, label }) {
  const { theme, isAr } = useStore();
  return (
    <TouchableOpacity onPress={onPress} style={{ flexDirection: isAr ? 'row-reverse' : 'row', gap: 11, alignItems: 'flex-start', padding: 13, borderRadius: 13, backgroundColor: theme.bg2, borderColor: on ? theme.accent : theme.line, borderWidth: 1 }}>
      <View style={{ width: 22, height: 22, borderRadius: 7, borderWidth: 2, borderColor: on ? theme.accent : theme.line, backgroundColor: on ? theme.accent : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
        {on ? <Text style={{ color: theme.mode === 'light' ? '#fff' : '#04221d', fontSize: 13 }}>✓</Text> : null}
      </View>
      <Text style={{ color: theme.txt, fontSize: 13.5, flex: 1, lineHeight: 20, textAlign: isAr ? 'right' : 'left' }}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function DisclaimerScreen({ navigation }) {
  const { theme, t, toast } = useStore();
  const [agree, setAgree] = useState(false);
  return (
    <Screen>
      <TitleRow title={t('disclaimerT')} onBack={() => navigation.goBack()} />
      <Text style={{ fontSize: 42 }}>⚕️</Text>
      <View style={{ backgroundColor: theme.bg2, borderColor: theme.line, borderWidth: 1, borderRadius: 14, padding: 16, maxHeight: 260 }}>
        <ScrollView><Text style={{ color: theme.muted, fontSize: 13.5, lineHeight: 22 }}>{t('disclaimerBody')}</Text></ScrollView>
      </View>
      <View style={{ marginVertical: 6 }}>
        <CheckItem on={agree} onPress={() => setAgree(!agree)} label={t('agreeDisc')} />
      </View>
      <PrimaryButton label={t('continue')} onPress={() => (agree ? navigation.navigate('Consent') : toast(t('selectOne')))} />
    </Screen>
  );
}
