import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useStore, todayKey } from '../store/Store';
import { Screen, TitleRow, PrimaryButton, Field, Input, Badge, Card } from '../components/ui';

export default function CalcScreen({ route, navigation }) {
  const { id } = route.params;
  const { s, theme, t, toast, isAr, logsOn } = useStore();
  const age = (() => { const y = +s.user.year; const cy = new Date().getFullYear(); return y && y > 1900 && y < cy ? cy - y : 30; })();
  const isMale = s.user.gender === 'male';
  const [v, setV] = useState({ age: String(age) });
  const set = (k, x) => setV((p) => ({ ...p, [k]: x }));
  const num = (k) => parseFloat(v[k]) || 0;
  const [res, setRes] = useState(null);

  const META = {
    bmi: { icon: '⚖️', name: 'tBmi', fields: [['w', 'weightKg', '70'], ['h', 'heightCm', '170']] },
    cal: { icon: '🔥', name: 'tCal', fields: [['w', 'weightKg', '70'], ['h', 'heightCm', '170'], ['age', 'ageY', '']] },
    hydra: { icon: '💧', name: 'tHydra', fields: [['w', 'weightKg', '70']] },
    ibw: { icon: '🎯', name: 'tIbw', fields: [['h', 'heightCm', '170']] },
    whtr: { icon: '📏', name: 'tWhtr', fields: [['waist', 'waistCm', '85'], ['h', 'heightCm', '170']] },
    protein: { icon: '🥩', name: 'tProtein', fields: [['w', 'weightKg', '70']] },
    fluid: { icon: '🚰', name: 'tFluid', fields: [['w', 'weightKg', '70']] },
    hr: { icon: '❤️', name: 'tHr', fields: [['age', 'ageY', '']] },
  };
  const m = META[id];

  const compute = () => {
    if (id === 'bmi') { const w = num('w'), h = num('h') / 100; if (!w || !h) return toast(t('fillFields')); const bmi = w / (h * h); const c = bmi < 18.5 ? ['underweight', theme.accent2] : bmi < 25 ? ['normalW', theme.good] : bmi < 30 ? ['overweight', theme.warn] : ['obese', theme.coral]; setRes({ v: bmi.toFixed(1), u: 'kg/m²', cat: t(c[0]), color: c[1] }); }
    else if (id === 'cal') { const w = num('w'), h = num('h'), a = num('age'); if (!w || !h) return toast(t('fillFields')); const bmr = 10 * w + 6.25 * h - 5 * a + (isMale ? 5 : -161); setRes({ v: Math.round(bmr * 1.375).toLocaleString(), u: 'kcal · ' + t('perDay'), cat: isAr ? 'تقدير' : 'estimate', color: theme.accent }); }
    else if (id === 'hydra') { const w = num('w'); if (!w) return toast(t('fillFields')); const ml = Math.round(w * 35); setRes({ v: (ml / 1000).toFixed(1), u: 'L · ' + t('perDay'), cat: `≈ ${Math.round(ml / 250)} ${t('glasses')}`, color: theme.accent2 }); }
    else if (id === 'ibw') { const h = num('h'); if (!h) return toast(t('fillFields')); const over = Math.max(0, h / 2.54 - 60); const base = isMale ? 50 : 45.5; const dev = base + 2.3 * over; setRes({ v: `${(dev * 0.9).toFixed(0)}–${(dev * 1.1).toFixed(0)}`, u: 'kg', cat: t('healthyRef'), color: theme.good }); }
    else if (id === 'whtr') { const wa = num('waist'), h = num('h'); if (!wa || !h) return toast(t('fillFields')); const r = wa / h; const c = r < 0.5 ? ['normalW', theme.good] : r < 0.6 ? ['overweight', theme.warn] : ['obese', theme.coral]; setRes({ v: r.toFixed(2), u: '', cat: t(c[0]) + ' · <0.5', color: c[1] }); }
    else if (id === 'protein') { const w = num('w'); if (!w) return toast(t('fillFields')); setRes({ v: `${(w * 1.0).toFixed(0)}–${(w * 1.5).toFixed(0)}`, u: 'g · ' + t('perDay'), cat: isAr ? 'نطاق عام' : 'general range', color: theme.coral }); }
    else if (id === 'fluid') { const w = num('w'); if (!w) return toast(t('fillFields')); const loose = logsOn(todayKey()).filter((l) => l.type === 'bowel' && l.bristol >= 6).reduce((a, l) => a + (l.count || 1), 0); const ml = Math.round(w * 35) + loose * 250; setRes({ v: (ml / 1000).toFixed(1), u: 'L · ' + t('perDay'), cat: isAr ? `مُعدّل (${loose} لين)` : `adjusted (${loose} loose)`, color: theme.accent2 }); }
    else if (id === 'hr') { const a = num('age'); if (!a) return toast(t('fillFields')); setRes({ v: String(220 - a), u: 'bpm', cat: isAr ? 'أقصى نبض تقديري' : 'estimated max HR', color: theme.bad }); }
  };

  return (
    <Screen>
      <TitleRow title={t(m.name)} right={<Text style={{ fontSize: 26 }}>{m.icon}</Text>} onBack={() => navigation.goBack()} />
      {m.fields.map(([k, lbl, ph]) => (
        <Field key={k} label={t(lbl)}><Input value={v[k]} onChangeText={(x) => set(k, x)} keyboardType="decimal-pad" placeholder={ph} /></Field>
      ))}
      <PrimaryButton label={t('calculate')} onPress={compute} />
      {res ? (
        <View style={{ backgroundColor: theme.accentD, borderColor: theme.accent, borderWidth: 1, borderRadius: 16, padding: 18, alignItems: 'center' }}>
          <Text style={{ color: theme.muted, fontSize: 14 }}>{t('yourResult')}</Text>
          <Text style={{ color: theme.accent, fontSize: 38, fontWeight: '800' }}>{res.v}</Text>
          <Text style={{ color: theme.muted, fontSize: 14, fontWeight: '600' }}>{res.u}</Text>
          {res.cat ? <View style={{ marginTop: 8 }}><Badge label={res.cat} /></View> : null}
        </View>
      ) : null}
      <Card style={{ backgroundColor: theme.bg2 }}><Text style={{ color: theme.muted, fontSize: 11.5, lineHeight: 17 }}>ℹ️ {t('toolDisc')}</Text></Card>
    </Screen>
  );
}
