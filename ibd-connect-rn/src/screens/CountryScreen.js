import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import { useStore } from '../store/Store';
import { COUNTRIES } from '../data/misc';
import { Screen, TitleRow, Input, Chip, Row, Badge } from '../components/ui';

function WorldMap({ color }) {
  return (
    <Svg width="100%" height={120} viewBox="0 0 800 360">
      <G fill={color} opacity={0.32} stroke={color} strokeWidth={1}>
        <Path d="M120 70 L210 60 L250 95 L235 140 L180 160 L140 130 L110 100 Z" />
        <Path d="M250 160 L300 150 L330 210 L300 300 L260 290 L240 220 Z" />
        <Path d="M370 70 L430 60 L470 80 L460 120 L400 130 L370 100 Z" />
        <Path d="M410 135 L470 130 L500 175 L470 250 L430 270 L405 200 Z" />
        <Path d="M470 95 L540 80 L640 90 L700 120 L660 175 L560 175 L500 150 Z" />
        <Path d="M640 200 L690 195 L710 230 L680 260 L645 245 Z" />
      </G>
    </Svg>
  );
}

export default function CountryScreen({ navigation }) {
  const { s, theme, t, update, isAr } = useStore();
  const [q, setQ] = useState('');
  const [region, setRegion] = useState('all');
  const regions = [['all', 'allRegions'], ['gcc', 'gcc'], ['mena', 'mena'], ['world', 'world']];
  const list = COUNTRIES.filter((c) => (region === 'all' || c.r === region) && (!q || c.en.toLowerCase().includes(q.toLowerCase()) || c.ar.includes(q)));
  const pick = (c) => { update((st) => { st.user = { ...st.user, country: c.c, countryFlag: c.f }; }); navigation.goBack(); };
  const cur = s.user.country ? COUNTRIES.find((x) => x.c === s.user.country) : null;
  return (
    <Screen>
      <TitleRow title={t('countryT')} sub={t('countrySub')} onBack={() => navigation.goBack()} />
      <View style={{ borderRadius: 16, overflow: 'hidden', backgroundColor: theme.bg2 }}>
        <WorldMap color={theme.accent} />
        <View style={{ alignItems: 'center', padding: 8 }}><Badge tone="accent" label={`${cur ? cur.f : '🌍'} ${cur ? (isAr ? cur.ar : cur.en) : t('selectCountry')}`} /></View>
      </View>
      <Input value={q} onChangeText={setQ} placeholder={`🔍 ${t('searchCountry')}`} />
      <Row style={{ gap: 8, flexWrap: 'wrap' }}>{regions.map(([v, k]) => <Chip key={v} label={t(k)} on={region === v} onPress={() => setRegion(v)} />)}</Row>
      <View style={{ backgroundColor: theme.card, borderColor: theme.line, borderWidth: 1, borderRadius: 18, paddingHorizontal: 6 }}>
        {list.map((c) => (
          <TouchableOpacity key={c.c} onPress={() => pick(c)} style={{ flexDirection: isAr ? 'row-reverse' : 'row', alignItems: 'center', gap: 12, paddingVertical: 13, paddingHorizontal: 6, borderBottomColor: theme.line, borderBottomWidth: 1 }}>
            <Text style={{ fontSize: 26 }}>{c.f}</Text>
            <Text style={{ color: theme.txt, fontSize: 14.5, flex: 1, fontWeight: '600', textAlign: isAr ? 'right' : 'left' }}>{isAr ? c.ar : c.en}</Text>
            {s.user.country === c.c ? <Text style={{ color: theme.accent, fontWeight: '800' }}>✓</Text> : null}
          </TouchableOpacity>
        ))}
      </View>
    </Screen>
  );
}
