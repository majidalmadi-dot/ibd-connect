import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useStore, todayKey } from '../store/Store';
import { Screen, TitleRow, Card, Row } from '../components/ui';
import { logLabel, fmtTime } from '../utils/logs';

export default function HistoryScreen({ navigation }) {
  const { s, theme, t, isAr, deleteLog } = useStore();
  const groups = {};
  s.logs.slice().sort((a, b) => new Date(b.t) - new Date(a.t)).forEach((l) => { const k = l.t.slice(0, 10); (groups[k] = groups[k] || []).push(l); });
  const keys = Object.keys(groups);
  const fmtDay = (k) => { const today = todayKey(); const y = todayKey(new Date(Date.now() - 864e5)); if (k === today) return isAr ? 'اليوم' : 'Today'; if (k === y) return isAr ? 'أمس' : 'Yesterday'; return new Date(k + 'T00:00').toLocaleDateString(isAr ? 'ar-SA' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' }); };
  return (
    <Screen>
      <TitleRow title={t('history')} onBack={() => navigation.goBack()} />
      {keys.length ? keys.map((k) => (
        <View key={k}>
          <Text style={{ color: theme.muted, fontSize: 12.5, fontWeight: '700', marginBottom: 6, textTransform: 'uppercase' }}>{fmtDay(k)}</Text>
          <Card>
            {groups[k].map((l) => { const x = logLabel(l, t); return (
              <TouchableOpacity key={l.id} onLongPress={() => deleteLog(l.id)} style={{ flexDirection: isAr ? 'row-reverse' : 'row', alignItems: 'center', gap: 13, paddingVertical: 12, borderBottomColor: theme.line, borderBottomWidth: 1 }}>
                <View style={{ width: 40, height: 40, borderRadius: 11, backgroundColor: theme.card2, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 18 }}>{x.icon}</Text></View>
                <View style={{ flex: 1 }}><Text style={{ color: theme.txt, fontWeight: '600', fontSize: 14.5, textAlign: isAr ? 'right' : 'left' }}>{x.title}</Text><Text style={{ color: theme.muted, fontSize: 12.5, textAlign: isAr ? 'right' : 'left' }}>{x.sub}{l.notes ? ' · ' + l.notes : ''}</Text></View>
                <Text style={{ color: theme.faint, fontSize: 12 }}>{fmtTime(l.t, isAr)}</Text>
              </TouchableOpacity>
            ); })}
          </Card>
        </View>
      )) : (
        <Card style={{ alignItems: 'center', padding: 40 }}><Text style={{ fontSize: 40 }}>🗂️</Text><Text style={{ color: theme.muted, marginTop: 8 }}>{t('nothingYet')}</Text></Card>
      )}
      <Text style={{ color: theme.faint, fontSize: 11.5, textAlign: 'center' }}>{isAr ? 'اضغط مطوّلًا لحذف سجل' : 'Long-press an item to delete'}</Text>
    </Screen>
  );
}
