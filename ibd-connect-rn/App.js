import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StoreProvider, useStore } from './src/store/Store';
import { Toast } from './src/components/Toast';
import RootNavigator from './src/navigation/RootNavigator';

function Inner() {
  const { theme } = useStore();
  return (
    <>
      <StatusBar style={theme.mode === 'light' ? 'dark' : 'light'} />
      <RootNavigator />
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <Inner />
      </StoreProvider>
    </SafeAreaProvider>
  );
}
