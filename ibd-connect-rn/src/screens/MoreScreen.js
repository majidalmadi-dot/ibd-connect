import React from 'react';
import { View, Text, TouchableOpacity, Share, Alert } from 'react-native';
import { useStore } from '../store/Store';
import { COUNTRIES, LEVELS } from '../data/misc';
import { THEMES } from '../theme/themes';
import { Screen, TitleRow, Card, GhostButton, Badge, Row, Between, SectionTitle } from '../components/ui';

function Li({ icon, title, value, onPress }) {
  const { theme, isAr } = useStore();
  return (
    <TouchableOpacity onPress={onPress} style={{ flexDirection: isAr ? 'row-reverse' : 'row', alignItems: 'center', gap: 13, paddingVertical: 14, borderBottomColor: theme.line, borderBottomWidth: 1 }}>
      <View style={{ width: 40, height: 40, borderRadius: 11, backgroundColor: theme.card2, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 18 }}>{icon}</Text></View>
      <Text style={{ flex: 1, color: theme.txt, fontSize: 14.5, fontWeight: '600', textAlign: isAr ? 'right' : 'left' }}>{title}</Text>
      {value ? <Text style={{ color: theme.muted, fontSize: 13 }}>{value}</Text> : null}
      <Text style={{ color: theme.faint, fontSize: 16 }}>{isAr ? '‹' : '›'}</Text>
    </TouchableOpacity>
  );
}

export default function MoreScreen({ navigation }) {
  const { s, theme, t, isAr, setLang, levelInfo, streak, reset, todaySteps } = useStore();
  const u = s.user;
  const dz = { uc: t('uc'), cd: t('cd'), ibdu: t('ibdu'), notsure: t('notsure') }[u.disease] || '—';
  const lv = levelInfo();
  const ctry = u.country ? COUNTRIES.find((x) => x.c === u.country) : null;
  const themeName = (THEMES.find((x) => x.id === s.prefs.theme) || {})[isAr ? 'ar' : 'en'];
  const exportData = async () => { try { await Share.share({ message: JSON.stringify({ user: u, logs: s.logs, disc: s.disc }, null, 2), title: 'IBD Connect data' }); } catch (e) {} };
  const confirmDelete = (title, onYes) => Alert.alert(title, t('deleteWarn'), [{ text: t('cancel'), style: 'cancel' }, { text: t('confirmDelete'), style: 'destructive', onPress: onYes }]);
  const signOut = () => { /* keep data, just go to login */ navigation.reset({ index: 0, routes: [{ name: 'Login' }] }); };

  return (
    <Screen>
      <TitleRow title={t('moreT')} />
      <Card onPress={() => navigation.navigate('EditProfile')}>
        <Row>
          <View style={{ width: 60, height: 60, borderRadius: 20, backgroundColor: theme.card2, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 32 }}>{u.avatar}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: theme.txt, fontSize: 18, fontWeight: '800' }}>{u.name || t('member')}</Text>
            <Text style={{ color: theme.muted, fontSize: 13 }}>{u.email || ''}</Text>
            <Row style={{ gap: 6, marginTop: 6 }}><Badge tone="accent" label={dz} />{ctry ? <Badge label={`${ctry.f} ${isAr ? ctry.ar : ctry.en}`} /> : null}</Row>
          </View>
          <Text style={{ color: theme.faint, fontSize: 16 }}>{isAr ? '‹' : '›'}</Text>
        </Row>
      </Card>

      <Card onPress={() => navigation.navigate('Rewards')} style={{ backgroundColor: theme.accentD, borderColor: theme.accent }}>
        <Row><View style={{ width: 46, height: 46, borderRadius: 14, backgroundColor: theme.card2, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 22 }}>{lv.icon}</Text></View><View style={{ flex: 1 }}><Text style={{ color: theme.txt, fontWeight: '700', fontSize: 15 }}>{t('rewardsT')}</Text><Text style={{ color: theme.muted, fontSize: 12.5 }}>{t('levelLbl')} {lv.level} · {lv.xp} XP · 🔥 {streak()}</Text></View><Text style={{ color: theme.faint, fontSize: 16 }}>{isAr ? '‹' : '›'}</Text></Row>
      </Card>

      <Card>
        <Li icon="🧮" title={t('toolsT')} onPress={() => navigation.navigate('Tools')} />
        <Li icon="👟" title={t('tSteps')} value={todaySteps().toLocaleString()} onPress={() => navigation.navigate('Steps')} />
      </Card>

      <SectionTitle>{t('settings')}</SectionTitle>
      <Card>
        <Li icon="🎨" title={t('appearance')} value={themeName} onPress={() => navigation.navigate('Theme')} />
        <Li icon="🌐" title={t('language')} value={isAr ? 'العربية' : 'English'} onPress={() => setLang(isAr ? 'en' : 'ar')} />
        <Li icon="🔔" title={t('notifications')} onPress={() => navigation.navigate('Settings', { kind: 'notifs' })} />
        <Li icon="🔒" title={t('privacy')} onPress={() => navigation.navigate('Settings', { kind: 'privacy' })} />
        <Li icon="🧭" title={t('insightsWellness')} onPress={() => navigation.navigate('Insights')} />
        <Li icon="🔑" title={t('changePw')} onPress={() => navigation.navigate('Settings', { kind: 'changePw' })} />
      </Card>

      <SectionTitle>{t('legal')}</SectionTitle>
      <Card>
        <Li icon="📄" title={t('terms')} onPress={() => navigation.navigate('Legal', { kind: 'terms' })} />
        <Li icon="🛡️" title={t('privacyPolicy')} onPress={() => navigation.navigate('Legal', { kind: 'privacy' })} />
        <Li icon="❓" title={t('faq')} onPress={() => navigation.navigate('Legal', { kind: 'faq' })} />
        <Li icon="ℹ️" title={t('about')} onPress={() => navigation.navigate('Legal', { kind: 'about' })} />
      </Card>

      <SectionTitle>{isAr ? 'البيانات' : 'Data'}</SectionTitle>
      <Card>
        <Li icon="📤" title={t('dataExport')} onPress={exportData} />
        <Li icon="🗑️" title={t('dataDelete')} onPress={() => confirmDelete(t('dataDelete'), () => { reset(); navigation.navigate('Today'); })} />
      </Card>

      <Card onPress={() => navigation.navigate('Admin')}>
        <Row><View style={{ width: 40, height: 40, borderRadius: 11, backgroundColor: theme.card2, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 18 }}>🛠️</Text></View><View style={{ flex: 1 }}><Text style={{ color: theme.txt, fontWeight: '700', fontSize: 14.5 }}>{t('adminEntry')}</Text><Text style={{ color: theme.muted, fontSize: 12 }}>{isAr ? 'للمسؤولين' : 'For administrators'}</Text></View><Text style={{ color: theme.faint, fontSize: 16 }}>{isAr ? '‹' : '›'}</Text></Row>
      </Card>

      <GhostButton label={t('signOut')} onPress={signOut} />
      <GhostButton danger label={t('deleteAccount')} onPress={() => confirmDelete(t('deleteAccount'), () => { reset(); navigation.reset({ index: 0, routes: [{ name: 'Language' }] }); })} />
      <Text style={{ color: theme.faint, fontSize: 12, textAlign: 'center', paddingVertical: 6 }}>IBD Connect v1.0 · {isAr ? 'تطبيق غير طبي' : 'Non-medical app'}</Text>
    </Screen>
  );
}
