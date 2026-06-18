import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useStore } from '../store/Store';
import { Screen, PrimaryButton, GhostButton, Field, Input } from '../components/ui';

export default function LoginScreen({ navigation }) {
  const { s, theme, t, toast, update, isAr, setLang, cloud } = useStore();
  const [email, setEmail] = useState(s.user.email || '');
  const [pw, setPw] = useState('');
  const doLogin = () => {
    if (!email.trim() || pw.length < 6) return toast(t('fillFields'));
    if (cloud.enabled) cloud.signIn(email.trim(), pw); // optional, non-blocking
    update((st) => { st.user = { ...st.user, email: email.trim() }; st.authed = true; });
    navigation.reset({ index: 0, routes: [{ name: s.user.name ? 'Main' : 'Setup' }] });
  };
  return (
    <Screen>
      <View style={{ width: 60, height: 60, borderRadius: 18, backgroundColor: theme.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}><Text style={{ fontSize: 28 }}>🌿</Text></View>
      <Text style={{ color: theme.txt, fontSize: 26, fontWeight: '800' }}>{t('welcome')}</Text>
      <Text style={{ color: theme.muted, marginBottom: 14 }}>{t('appName')} · {t('tagline')}</Text>
      <Field label={t('email')}><Input value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@email.com" /></Field>
      <Field label={t('password')}><Input value={pw} onChangeText={setPw} secureTextEntry placeholder="••••••••" /></Field>
      <TouchableOpacity onPress={() => navigation.navigate('Reset')} style={{ alignSelf: isAr ? 'flex-start' : 'flex-end' }}><Text style={{ color: theme.muted, fontSize: 13, fontWeight: '600' }}>{t('forgotPw')}</Text></TouchableOpacity>
      <PrimaryButton label={t('signIn')} onPress={doLogin} />
      <GhostButton label={t('noAccount')} onPress={() => navigation.navigate('Signup')} />
      <TouchableOpacity onPress={() => setLang(isAr ? 'en' : 'ar')} style={{ alignItems: 'center', padding: 12 }}><Text style={{ color: theme.muted, fontSize: 13 }}>🌐 {isAr ? 'English' : 'العربية'}</Text></TouchableOpacity>
    </Screen>
  );
}
