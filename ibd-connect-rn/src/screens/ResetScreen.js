import React, { useState } from 'react';
import { Text } from 'react-native';
import { useStore } from '../store/Store';
import { Screen, TitleRow, PrimaryButton, Field, Input } from '../components/ui';

export default function ResetScreen({ navigation }) {
  const { t, toast } = useStore();
  const [email, setEmail] = useState('');
  const send = () => { if (!email.trim()) return toast(t('fillFields')); toast(t('resetSent')); setTimeout(() => navigation.goBack(), 800); };
  return (
    <Screen>
      <TitleRow title={t('resetT')} sub={t('resetSub')} onBack={() => navigation.goBack()} />
      <Text style={{ fontSize: 42 }}>📧</Text>
      <Field label={t('email')}><Input value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@email.com" /></Field>
      <PrimaryButton label={t('sendLink')} onPress={send} />
    </Screen>
  );
}
