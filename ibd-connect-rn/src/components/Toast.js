import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { useStore } from '../store/Store';

export function Toast() {
  const { registerToast, theme } = useStore();
  const [msg, setMsg] = useState('');
  const op = useRef(new Animated.Value(0)).current;
  const timer = useRef(null);

  useEffect(() => {
    registerToast((m) => {
      setMsg(m);
      Animated.timing(op, { toValue: 1, duration: 180, useNativeDriver: true }).start();
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        Animated.timing(op, { toValue: 0, duration: 250, useNativeDriver: true }).start();
      }, 1900);
    });
  }, [registerToast, op]);

  return (
    <Animated.View pointerEvents="none" style={{ position: 'absolute', bottom: 110, alignSelf: 'center', opacity: op }}>
      <View style={{ backgroundColor: theme.card2, borderColor: theme.accent, borderWidth: 1, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 20 }}>
        <Text style={{ color: theme.txt, fontWeight: '600', fontSize: 14 }}>{msg}</Text>
      </View>
    </Animated.View>
  );
}
