import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useStore } from '../store/Store';
import { CAT_LABEL } from '../data/content';
import { Screen, TitleRow, Card, Badge, Chip, Row } from '../components/ui';

export default function LearnScreen({ navigation }) {
  const { s, theme, t, isAr, L } = useStore();
  const [cat, setCat] = useState('all');
  const match = (a) => (cat === 'all' ? true : cat === 'sga' ? a.source === 'SGA' : a.cat === cat);
  const items = s.learn.filter(match);
  const cats = ['all', 'sga', 'aboutibd', 'nutrition', 'research', 'stories', 'basics', 'uc', 'cd', 'lifestyle'];
  const sugg = s.learn.filter((a) => a.cat === s.user.disease || a.cat === 'basics' || a.source === 'SGA').slice(0, 3);
  const sgaCount = s.learn.filter((a) => a.source === 'SGA').length;
  return (
    <Screen>
      <TitleRow title={t('learnT')} sub={t('learnSub')} />
      {cat === 'all' ? (
        <Card onPress={() => setCat('sga')} style={{ backgroundColor: theme.accentD, borderColor: theme.accent }}>
          <Row><Text style={{ fontSize: 30 }}>📗</Text><View style={{ flex: 1 }}><Text style={{ color: theme.txt, fontWeight: '700', fontSize: 15.5 }}>{isAr ? 'دليل IBD — الجمعية السعودية للجهاز الهضمي' : 'IBD Guide — Saudi Gastroenterology Association'}</Text><Text style={{ color: theme.muted, fontSize: 12.5 }}>{sgaCount} {isAr ? 'مقالات موثّقة' : 'expert articles'} · IBDguide.net</Text></View><Text style={{ color: theme.faint, fontSize: 18 }}>{isAr ? '‹' : '›'}</Text></Row>
        </Card>
      ) : null}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}><Row style={{ gap: 8 }}>{cats.map((c) => <Chip key={c} label={CAT_LABEL[c][isAr ? 'ar' : 'en']} on={cat === c} onPress={() => setCat(c)} />)}</Row></ScrollView>
      {cat === 'all' && sugg.length ? (<>
        <Text style={{ color: theme.muted, fontSize: 12.5, fontWeight: '700', textTransform: 'uppercase' }}>{t('forYou')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}><Row style={{ gap: 12 }}>
          {sugg.map((a) => (
            <Card key={a.id} onPress={() => navigation.navigate('Article', { id: a.id })} style={{ width: 210 }}>
              <Text style={{ fontSize: 30 }}>{a.icon}</Text>
              <Text style={{ color: theme.txt, fontWeight: '700', fontSize: 14.5, marginTop: 8 }}>{L(a[isAr ? 'ar' : 'en'])}</Text>
              <Row style={{ gap: 6, marginTop: 8 }}><Badge tone="accent" label={`${a.min} ${t('minRead')}`} />{a.source === 'SGA' ? <Badge tone="purple" label="SGA" /> : null}</Row>
            </Card>
          ))}
        </Row></ScrollView>
      </>) : null}
      <Text style={{ color: theme.muted, fontSize: 12.5, fontWeight: '700', textTransform: 'uppercase' }}>{cat === 'sga' ? (isAr ? 'دليل IBD' : 'IBD Guide') : t('allArticles')}</Text>
      <Card>
        {items.map((a) => (
          <TouchableOpacity key={a.id} onPress={() => navigation.navigate('Article', { id: a.id })} style={{ flexDirection: isAr ? 'row-reverse' : 'row', alignItems: 'center', gap: 13, paddingVertical: 13, borderBottomColor: theme.line, borderBottomWidth: 1 }}>
            <View style={{ width: 40, height: 40, borderRadius: 11, backgroundColor: theme.card2, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 18 }}>{a.icon}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.txt, fontSize: 14.5, fontWeight: '600', textAlign: isAr ? 'right' : 'left' }}>{L(a[isAr ? 'ar' : 'en'])}{a.isNew ? '  •' : ''}</Text>
              <Text style={{ color: theme.muted, fontSize: 12.5, textAlign: isAr ? 'right' : 'left' }}>{a.min} {t('minRead')}{a.source === 'SGA' ? ' · SGA' : ''}</Text>
            </View>
            <Text style={{ color: theme.faint, fontSize: 16 }}>{isAr ? '‹' : '›'}</Text>
          </TouchableOpacity>
        ))}
      </Card>
    </Screen>
  );
}
