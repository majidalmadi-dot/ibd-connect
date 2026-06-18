import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useStore } from '../store/Store';

export default function LanguageScreen({ navigation }) {
  const { theme, setLang } = useStore();
  const choose = (l) => { setLang(l); navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] }); };
  const LangCard = ({ flag, title, sub, onPress }) => (
    <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18, borderRadius: 16, backgroundColor: theme.card, borderColor: theme.line, borderWidth: 1 }}>
      <Text style={{ fontSize: 30 }}>{flag}</Text>
      <View><Text style={{ color: theme.txt, fontSize: 16, fontWeight: '700' }}>{title}</Text><Text style={{ color: theme.muted, fontSize: 13 }}>{sub}</Text></View>
    </TouchableOpacity>
  );
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg, justifyContent: 'center', padding: 24, gap: 24 }}>
      <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: theme.accent, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 30 }}>🌿</Text></View>
      <View>
        <Text style={{ color: theme.txt, fontSize: 25, fontWeight: '800' }}>Choose your language</Text>
        <Text style={{ color: theme.txt, fontSize: 25, fontWeight: '800', marginTop: 4 }}>اختر لغتك</Text>
      </View>
      <View style={{ gap: 12 }}>
        <LangCard flag="🇬🇧" title="English" sub="Continue in English" onPress={() => choose('en')} />
        <LangCard flag="🇸🇦" title="العربية" sub="المتابعة بالعربية" onPress={() => choose('ar')} />
      </View>
    </View>
  );
}
