import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useStore } from '../store/Store';
import { Screen, TitleRow, PrimaryButton, GhostButton, Field, Input, Chip, Row } from '../components/ui';

// Simple stepper used instead of a native slider to avoid extra deps
function Stepper({ value, setValue, min, max, step = 1, suffix }) {
  const { theme } = useStore();
  const btn = (lbl, d) => (
    <TouchableOpacity onPress={() => setValue(Math.max(min, Math.min(max, +(value + d).toFixed(1))))} style={{ width: 46, height: 46, borderRadius: 12, backgroundColor: theme.bg2, borderColor: theme.line, borderWidth: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: theme.txt, fontSize: 22, fontWeight: '700' }}>{lbl}</Text>
    </TouchableOpacity>
  );
  return (
    <Row style={{ justifyContent: 'center', gap: 18 }}>
      {btn('−', -step)}
      <Text style={{ color: theme.accent, fontSize: 30, fontWeight: '800', minWidth: 80, textAlign: 'center' }}>{value}{suffix || ''}</Text>
      {btn('+', step)}
    </Row>
  );
}

const SYMPTOMS = ['abdPain', 'diarrhea', 'blood', 'urgency', 'bloating', 'fatigue', 'nausea', 'jointPain', 'fever', 'cramping'];
const BRISTOL = [['b1', 1], ['b2', 2], ['b3', 3], ['b4', 4], ['b5', 5], ['b6', 6], ['b7', 7]];

export default function LoggerScreen({ route, navigation }) {
  const { type } = route.params;
  const { theme, t, toast, addLog, isAr } = useStore();
  const [v, setV] = useState({});
  const [num, setNum] = useState(type === 'sleep' ? 7 : type === 'bowel' ? 1 : 0);
  const set = (k, val) => setV((p) => ({ ...p, [k]: val }));
  const titleKey = { symptom: 'symptoms', meal: 'meals', sleep: 'sleep', mood: 'mood', activity: 'activity', bowel: 'bowel' }[type];
  const icon = { symptom: '🩺', meal: '🍽️', sleep: '😴', mood: '🌤️', activity: '🏃', bowel: '🚽' }[type];

  const save = () => {
    if (type === 'symptom') { if (!v.sym || !v.sev) return toast(t('fillFields')); addLog({ type, sym: v.sym, sev: v.sev, notes: v.notes || '' }); }
    else if (type === 'meal') { if (!v.mealType || !v.desc) return toast(t('fillFields')); addLog({ type, mealType: v.mealType, desc: v.desc, photo: !!v.photo }); }
    else if (type === 'sleep') { if (!v.qual) return toast(t('selectOne')); addLog({ type, hours: num, qual: v.qual }); }
    else if (type === 'mood') { if (!v.mood) return toast(t('selectOne')); addLog({ type, mood: v.mood }); }
    else if (type === 'activity') { if (!v.act || !v.mins) return toast(t('fillFields')); addLog({ type, act: v.act, mins: +v.mins, intensity: v.intensity || 1 }); }
    else if (type === 'bowel') { if (!v.bristol) return toast(t('selectOne')); addLog({ type, count: num, bristol: v.bristol }); }
    navigation.goBack();
  };

  return (
    <Screen>
      <TitleRow title={t(titleKey)} right={<Text style={{ fontSize: 26 }}>{icon}</Text>} onBack={() => navigation.goBack()} />

      {type === 'symptom' && (<>
        <Field label={t('symType')}><Row style={{ flexWrap: 'wrap', gap: 8 }}>{SYMPTOMS.map((k) => <Chip key={k} label={t(k)} on={v.sym === k} onPress={() => set('sym', k)} />)}</Row></Field>
        <Field label={t('severity')}><Row style={{ gap: 8 }}>{[['mild', 1], ['moderate', 2], ['severe', 3]].map(([k, val]) => <Chip key={k} label={t(k)} on={v.sev === val} onPress={() => set('sev', val)} />)}</Row></Field>
        <Field label={t('notes')}><Input value={v.notes} onChangeText={(x) => set('notes', x)} placeholder={t('notesPh')} multiline style={{ minHeight: 80 }} /></Field>
      </>)}

      {type === 'meal' && (<>
        <Field label={t('mealType')}><Row style={{ gap: 8 }}>{['breakfast', 'lunch', 'dinner', 'snack'].map((k) => <Chip key={k} label={t(k)} on={v.mealType === k} onPress={() => set('mealType', k)} />)}</Row></Field>
        <Field label={t('mealDesc')}><Input value={v.desc} onChangeText={(x) => set('desc', x)} placeholder={t('mealPh')} multiline style={{ minHeight: 80 }} /></Field>
        <GhostButton label={v.photo ? `📸 ${t('photoAdded')} ✓` : `📷 ${t('addPhoto')}`} onPress={() => set('photo', true)} />
      </>)}

      {type === 'sleep' && (<>
        <Field label={t('sleepHours')}><Stepper value={num} setValue={setNum} min={0} max={14} step={0.5} suffix="h" /></Field>
        <Field label={t('sleepQual')}><Row style={{ gap: 8 }}>{[['poor', 1], ['fair', 2], ['good', 3], ['great', 4]].map(([k, val]) => <Chip key={k} label={t(k)} on={v.qual === val} onPress={() => set('qual', val)} />)}</Row></Field>
      </>)}

      {type === 'mood' && (
        <Field label={t('moodToday')}>
          <Row style={{ justifyContent: 'space-between' }}>
            {[['😞', 'veryLow', 1], ['🙁', 'low', 2], ['😐', 'okay', 3], ['🙂', 'happy', 4], ['😄', 'great2', 5]].map(([e, k, val]) => (
              <TouchableOpacity key={val} onPress={() => set('mood', val)} style={{ alignItems: 'center', padding: 8, borderRadius: 12, backgroundColor: v.mood === val ? theme.accentD : 'transparent', borderColor: v.mood === val ? theme.accent : 'transparent', borderWidth: 1 }}>
                <Text style={{ fontSize: 30 }}>{e}</Text><Text style={{ color: theme.muted, fontSize: 10.5 }}>{t(k)}</Text>
              </TouchableOpacity>
            ))}
          </Row>
        </Field>
      )}

      {type === 'activity' && (<>
        <Field label={t('actType')}><Row style={{ flexWrap: 'wrap', gap: 8 }}>{['walking', 'running', 'gym', 'yoga', 'cycling', 'other'].map((k) => <Chip key={k} label={t(k)} on={v.act === k} onPress={() => set('act', k)} />)}</Row></Field>
        <Field label={t('duration')}><Input value={v.mins} onChangeText={(x) => set('mins', x)} keyboardType="number-pad" placeholder="30" /></Field>
        <Field label={t('intensity')}><Row style={{ gap: 8 }}>{[['mild', 1], ['moderate', 2], ['severe', 3]].map(([k, val]) => <Chip key={k} label={t(k)} on={v.intensity === val} onPress={() => set('intensity', val)} />)}</Row></Field>
      </>)}

      {type === 'bowel' && (<>
        <Field label={t('bowelFreq')}><Stepper value={num} setValue={setNum} min={0} max={15} step={1} suffix="×" /></Field>
        <Field label={`${t('bristol')} · ${t('bristolSub')}`}>
          <View style={{ gap: 8 }}>
            {BRISTOL.map(([k, val]) => (
              <TouchableOpacity key={k} onPress={() => set('bristol', val)} style={{ flexDirection: isAr ? 'row-reverse' : 'row', alignItems: 'center', gap: 12, padding: 11, borderRadius: 13, backgroundColor: theme.bg2, borderColor: v.bristol === val ? theme.accent : theme.line, borderWidth: 1 }}>
                <View style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: theme.card2, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: theme.txt, fontWeight: '800' }}>{val}</Text></View>
                <Text style={{ color: theme.txt, fontSize: 13.5 }}>{t(k)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Field>
      </>)}

      <PrimaryButton label={t('logNow')} onPress={save} style={{ marginTop: 8 }} />
    </Screen>
  );
}
