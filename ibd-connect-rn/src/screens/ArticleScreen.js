import React, { useEffect } from 'react';
import { View, Text, Linking } from 'react-native';
import { useStore } from '../store/Store';
import { Screen, TitleRow, Card, GhostButton, Badge, Row } from '../components/ui';

export default function ArticleScreen({ route, navigation }) {
  const { id } = route.params;
  const { s, theme, t, isAr, update } = useStore();
  const a = s.learn.find((x) => x.id === id);
  useEffect(() => { update((st) => { st.game = { ...st.game, readCount: (st.game.readCount || 0) + 1 }; }); }, []);
  if (!a) return null;
  const c = a[isAr ? 'ar' : 'en'];
  const auth = a.author ? (isAr ? a.author.ar : a.author.en) : '';
  return (
    <Screen>
      <TitleRow title="" onBack={() => navigation.goBack()} />
      <Text style={{ fontSize: 42 }}>{a.icon}</Text>
      <Text style={{ color: theme.txt, fontSize: 21, fontWeight: '800', lineHeight: 28 }}>{c[0]}</Text>
      <Row style={{ gap: 6 }}><Badge tone="accent" label={`${a.min} ${t('minRead')}`} />{a.source === 'SGA' ? <Badge tone="purple" label="SGA · IBDguide.net" /> : null}</Row>
      {auth ? (
        <Row style={{ gap: 10, padding: 10, backgroundColor: theme.bg2, borderRadius: 12 }}>
          <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: theme.card2, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 16 }}>✍️</Text></View>
          <View><Text style={{ color: theme.txt, fontSize: 13, fontWeight: '600' }}>{auth}</Text><Text style={{ color: theme.faint, fontSize: 11.5 }}>{t('articleAuthor')}</Text></View>
        </Row>
      ) : null}
      <View style={{ height: 140, borderRadius: 14, backgroundColor: theme.card2, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 50 }}>{a.icon}</Text></View>
      <Text style={{ color: theme.txt, fontSize: 15, lineHeight: 25, textAlign: isAr ? 'right' : 'left' }}>{c[1]}</Text>
      {a.link ? <GhostButton label={`🔗 ${t('readSource')}`} onPress={() => Linking.openURL(a.link)} /> : null}
      <Card style={{ backgroundColor: theme.bg2 }}><Text style={{ color: theme.muted, fontSize: 12, lineHeight: 18 }}>{a.source === 'SGA' ? (isAr ? '✓ من مبادرة IBDguide.net التابعة للجمعية السعودية للجهاز الهضمي.' : '✓ From the IBDguide.net initiative of the Saudi Gastroenterology Association.') : (isAr ? '✓ محتوى مُراجَع من خبراء سريريين' : '✓ Content validated by clinical experts')}</Text></Card>
    </Screen>
  );
}
