import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { useStore } from '../store/Store';
import { Screen, TitleRow, Card, GhostButton } from '../components/ui';

export default function InsightsScreen({ navigation }) {
  const { s, theme, t, isAr, L } = useStore();
  const [open, setOpen] = useState(null);
  const tip = open != null ? s.tips.find((x) => x.id === open) : null;
  return (
    <Screen>
      <TitleRow title={t('insightsT')} sub={t('insightsSub')} onBack={() => navigation.goBack()} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {s.tips.map((tp) => (
          <TouchableOpacity key={tp.id} onPress={() => setOpen(tp.id)} style={{ width: '47%', minHeight: 120, backgroundColor: theme.card, borderColor: theme.line, borderWidth: 1, borderRadius: 16, padding: 15, gap: 8 }}>
            <Text style={{ fontSize: 28 }}>{tp.icon}</Text>
            <Text style={{ color: theme.txt, fontSize: 14, fontWeight: '600', lineHeight: 19 }}>{L(tp[isAr ? 'ar' : 'en'])}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Modal visible={!!tip} animationType="slide" transparent onRequestClose={() => setOpen(null)}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <View style={{ backgroundColor: theme.bg2, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 22, maxHeight: '85%' }}>
            {tip ? (<>
              <Text style={{ fontSize: 46 }}>{tip.icon}</Text>
              <Text style={{ color: theme.txt, fontSize: 21, fontWeight: '800', marginVertical: 12 }}>{tip[isAr ? 'ar' : 'en'][0]}</Text>
              <Text style={{ color: theme.txt, fontSize: 15, lineHeight: 25 }}>{tip[isAr ? 'ar' : 'en'][1]}</Text>
              <View style={{ height: 16 }} />
              <GhostButton label={t('cancel')} onPress={() => setOpen(null)} />
            </>) : null}
          </View>
        </View>
      </Modal>
    </Screen>
  );
}
