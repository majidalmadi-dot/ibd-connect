import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useStore } from '../store/Store';

export default function SplashScreen({ navigation }) {
  const { s, ready, theme, t } = useStore();
  useEffect(() => {
    if (!ready) return;
    const to = setTimeout(() => {
      let route = 'Main';
      if (!s.lang) route = 'Language';
      else if (!s.onboarded) route = 'Onboarding';
      else if (!s.authed) route = 'Login';
      navigation.reset({ index: 0, routes: [{ name: route }] });
    }, 1200);
    return () => clearTimeout(to);
  }, [ready, s.lang, s.onboarded, s.authed]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center', gap: 22 }}>
      <View style={{ width: 96, height: 96, borderRadius: 28, backgroundColor: theme.accent, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 46 }}>🌿</Text>
      </View>
      <Text style={{ color: theme.txt, fontSize: 28, fontWeight: '800' }}>IBD Connect</Text>
      <Text style={{ color: theme.muted, fontSize: 15 }}>رفيق التهاب الأمعاء</Text>
      <ActivityIndicator color={theme.accent} />
    </View>
  );
}
