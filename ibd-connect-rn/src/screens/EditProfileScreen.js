import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useStore } from '../store/Store';
import { COUNTRIES, AVATARS } from '../data/misc';
import { Screen, TitleRow, PrimaryButton, Field, Input, Chip, Row } from '../components/ui';

export default function EditProfileScreen({ navigation }) {
  const { s, theme, t, isAr, update, toast } = useStore();
  const u = s.user;
  const [f, setF] = useState({ name: u.name, year: u.year, gender: u.gender, disease: u.disease, email: u.email, avatar: u.avatar });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const sel = u.country ? COUNTRIES.find((x) => x.c === u.country) : null;
  const dz = [['uc', 'uc'], ['cd', 'cd'], ['ibdu', 'ibdu'], ['notsure', 'notsure']];
  const goCountry = () => { update((st) => { st.user = { ...st.user, ...f }; }); navigation.navigate('Country'); };
  const save = () => { update((st) => { st.user = { ...st.user, ...f, name: f.name.trim() || st.user.name }; }); toast(t('saved')); navigation.goBack(); };
  return (
    <Screen>
      <TitleRow title={t('editProfile')} onBack={() => navigation.goBack()} />
      <View style={{ alignItems: 'center' }}>
        <Text style={{ color: theme.muted, fontSize: 13, marginBottom: 10 }}>{isAr ? 'الصورة الرمزية' : 'Avatar'}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}><Row style={{ gap: 8 }}>{AVATARS.map((a) => (
          <TouchableOpacity key={a} onPress={() => set('avatar', a)} style={{ padding: 8, borderRadius: 11, backgroundColor: f.avatar === a ? theme.accentD : theme.bg2, borderColor: f.avatar === a ? theme.accent : theme.line, borderWidth: 1 }}><Text style={{ fontSize: 24 }}>{a}</Text></TouchableOpacity>
        ))}</Row></ScrollView>
      </View>
      <Field label={t('fullName')}><Input value={f.name} onChangeText={(x) => set('name', x)} /></Field>
      <Row style={{ gap: 12 }}>
        <View style={{ flex: 1 }}><Field label={t('yearBirth')}><Input value={f.year} onChangeText={(x) => set('year', x)} keyboardType="number-pad" /></Field></View>
        <View style={{ flex: 1 }}><Field label={t('gender')}><Row style={{ gap: 6, flexWrap: 'wrap' }}>{[['male', t('male')], ['female', t('female')]].map(([v, l]) => <Chip key={v} label={l} on={f.gender === v} onPress={() => set('gender', v)} />)}</Row></Field></View>
      </Row>
      <Field label={t('diseaseType')}><Row style={{ flexWrap: 'wrap', gap: 8 }}>{dz.map(([v, k]) => <Chip key={v} label={t(k)} on={f.disease === v} onPress={() => set('disease', v)} />)}</Row></Field>
      <Field label={t('joinFrom')}>
        <TouchableOpacity onPress={goCountry} style={{ backgroundColor: theme.bg2, borderColor: theme.line, borderWidth: 1, borderRadius: 13, padding: 13, flexDirection: isAr ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Row style={{ gap: 10 }}><Text style={{ fontSize: 22 }}>{sel ? sel.f : '🌍'}</Text><Text style={{ color: sel ? theme.txt : theme.muted }}>{sel ? (isAr ? sel.ar : sel.en) : t('selectCountry')}</Text></Row>
          <Text style={{ color: theme.faint, fontSize: 18 }}>{isAr ? '‹' : '›'}</Text>
        </TouchableOpacity>
      </Field>
      <Field label={t('email')}><Input value={f.email} onChangeText={(x) => set('email', x)} autoCapitalize="none" keyboardType="email-address" /></Field>
      <PrimaryButton label={t('save')} onPress={save} />
    </Screen>
  );
}
