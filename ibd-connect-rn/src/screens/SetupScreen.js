import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useStore } from '../store/Store';
import { COUNTRIES } from '../data/misc';
import { Screen, TitleRow, PrimaryButton, Field, Input, Chip, Row } from '../components/ui';

export default function SetupScreen({ navigation }) {
  const { s, theme, t, toast, update, isAr } = useStore();
  const u = s.user;
  const [name, setName] = useState(u.name);
  const [year, setYear] = useState(u.year);
  const [gender, setGender] = useState(u.gender);
  const [disease, setDisease] = useState(u.disease);
  const [diag, setDiag] = useState(u.diagYear);
  const dz = [['uc', 'uc'], ['cd', 'cd'], ['ibdu', 'ibdu'], ['notsure', 'notsure']];
  const sel = u.country ? COUNTRIES.find((x) => x.c === u.country) : null;

  const stashGoCountry = () => { update((st) => { st.user = { ...st.user, name, year, gender, disease, diagYear: diag }; }); navigation.navigate('Country'); };
  const next = () => {
    if (!name.trim() || !disease) return toast(t('fillFields'));
    update((st) => { st.user = { ...st.user, name: name.trim(), year, gender, disease, diagYear: diag }; st.onboarded = true; });
    navigation.reset({ index: 0, routes: [{ name: 'Signup' }] });
  };
  return (
    <Screen>
      <TitleRow title={t('setupT')} sub={t('setupSub')} onBack={() => navigation.goBack()} />
      <Field label={t('fullName')}><Input value={name} onChangeText={setName} placeholder={t('yourName')} /></Field>
      <Row style={{ gap: 12 }}>
        <View style={{ flex: 1 }}><Field label={t('yearBirth')}><Input value={year} onChangeText={setYear} keyboardType="number-pad" placeholder="1995" /></Field></View>
        <View style={{ flex: 1 }}>
          <Field label={t('gender')}>
            <Row style={{ gap: 6, flexWrap: 'wrap' }}>
              {[['male', t('male')], ['female', t('female')], ['na', t('preferNot')]].map(([v, lbl]) => (
                <Chip key={v} label={lbl} on={gender === v} onPress={() => setGender(v)} />
              ))}
            </Row>
          </Field>
        </View>
      </Row>
      <Field label={t('diseaseType')}>
        <Row style={{ flexWrap: 'wrap', gap: 8 }}>
          {dz.map(([v, k]) => <Chip key={v} label={t(k)} on={disease === v} onPress={() => setDisease(v)} />)}
        </Row>
      </Field>
      <Field label={t('yearDiag')}><Input value={diag} onChangeText={setDiag} keyboardType="number-pad" placeholder="2021" /></Field>
      <Field label={t('joinFrom')}>
        <TouchableOpacity onPress={stashGoCountry} style={{ backgroundColor: theme.bg2, borderColor: theme.line, borderWidth: 1, borderRadius: 13, padding: 13, flexDirection: isAr ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Row style={{ gap: 10 }}><Text style={{ fontSize: 22 }}>{sel ? sel.f : '🌍'}</Text><Text style={{ color: sel ? theme.txt : theme.muted }}>{sel ? (isAr ? sel.ar : sel.en) : t('selectCountry')}</Text></Row>
          <Text style={{ color: theme.faint, fontSize: 18 }}>{isAr ? '‹' : '›'}</Text>
        </TouchableOpacity>
      </Field>
      <PrimaryButton label={t('continue')} onPress={next} />
    </Screen>
  );
}
