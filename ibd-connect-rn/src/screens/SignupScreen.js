import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useStore } from '../store/Store';
import { COUNTRIES } from '../data/misc';
import { Screen, TitleRow, PrimaryButton, GhostButton, Field, Input, Row } from '../components/ui';

export default function SignupScreen({ navigation }) {
  const { s, theme, t, toast, update, isAr, cloud } = useStore();
  const [email, setEmail] = useState(s.user.email || '');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const sel = s.user.country ? COUNTRIES.find((x) => x.c === s.user.country) : null;
  const goCountry = () => { update((st) => { st.user = { ...st.user, email: email.trim() }; }); navigation.navigate('Country'); };
  const doSignup = () => {
    if (!email.trim()) return toast(t('fillFields'));
    if (pw.length < 6) return toast(t('pwShort'));
    if (pw !== pw2) return toast(t('pwMatch'));
    if (cloud.enabled) cloud.signUp(email.trim(), pw); // optional, non-blocking
    update((st) => { st.user = { ...st.user, email: email.trim() }; st.authed = true; });
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  };
  return (
    <Screen>
      <TitleRow title={t('createAccount')} onBack={() => navigation.goBack()} />
      <Field label={t('email')}><Input value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@email.com" /></Field>
      <Field label={t('password')}><Input value={pw} onChangeText={setPw} secureTextEntry placeholder={isAr ? '٦ أحرف على الأقل' : 'At least 6 characters'} /></Field>
      <Field label={t('confirmPw')}><Input value={pw2} onChangeText={setPw2} secureTextEntry placeholder="••••••••" /></Field>
      <Field label={t('joinFrom')}>
        <TouchableOpacity onPress={goCountry} style={{ backgroundColor: theme.bg2, borderColor: theme.line, borderWidth: 1, borderRadius: 13, padding: 13, flexDirection: isAr ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Row style={{ gap: 10 }}><Text style={{ fontSize: 22 }}>{sel ? sel.f : '🌍'}</Text><Text style={{ color: sel ? theme.txt : theme.muted }}>{sel ? (isAr ? sel.ar : sel.en) : t('selectCountry')}</Text></Row>
          <Text style={{ color: theme.faint, fontSize: 18 }}>{isAr ? '‹' : '›'}</Text>
        </TouchableOpacity>
      </Field>
      <PrimaryButton label={t('signUp')} onPress={doSignup} />
      <GhostButton label={t('haveAccount')} onPress={() => navigation.navigate('Login')} />
    </Screen>
  );
}
