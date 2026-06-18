import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useStore } from '../store/Store';

import SplashScreen from '../screens/SplashScreen';
import LanguageScreen from '../screens/LanguageScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import DisclaimerScreen from '../screens/DisclaimerScreen';
import ConsentScreen from '../screens/ConsentScreen';
import SetupScreen from '../screens/SetupScreen';
import CountryScreen from '../screens/CountryScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ResetScreen from '../screens/ResetScreen';
import MainTabs from './MainTabs';
import LoggerScreen from '../screens/LoggerScreen';
import DiscScreen from '../screens/DiscScreen';
import TimelineScreen from '../screens/TimelineScreen';
import HistoryScreen from '../screens/HistoryScreen';
import MedsScreen from '../screens/MedsScreen';
import ToolsScreen from '../screens/ToolsScreen';
import CalcScreen from '../screens/CalcScreen';
import StepsScreen from '../screens/StepsScreen';
import WeightScreen from '../screens/WeightScreen';
import MetricsScreen from '../screens/MetricsScreen';
import RewardsScreen from '../screens/RewardsScreen';
import ThemeScreen from '../screens/ThemeScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import SettingsScreens from '../screens/SettingsScreens';
import ArticleScreen from '../screens/ArticleScreen';
import LegalScreen from '../screens/LegalScreen';
import AdminScreen from '../screens/AdminScreen';
import InsightsScreen from '../screens/InsightsScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { theme, isAr } = useStore();
  const navTheme = {
    ...(theme.mode === 'light' ? DefaultTheme : DarkTheme),
    colors: { ...(theme.mode === 'light' ? DefaultTheme : DarkTheme).colors, background: theme.bg, card: theme.bg, text: theme.txt, border: theme.line, primary: theme.accent },
  };
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.bg } }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Language" component={LanguageScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Disclaimer" component={DisclaimerScreen} />
        <Stack.Screen name="Consent" component={ConsentScreen} />
        <Stack.Screen name="Setup" component={SetupScreen} />
        <Stack.Screen name="Country" component={CountryScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Reset" component={ResetScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Logger" component={LoggerScreen} options={{ presentation: 'modal' }} />
        <Stack.Screen name="Disc" component={DiscScreen} />
        <Stack.Screen name="Timeline" component={TimelineScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Meds" component={MedsScreen} />
        <Stack.Screen name="Tools" component={ToolsScreen} />
        <Stack.Screen name="Calc" component={CalcScreen} options={{ presentation: 'modal' }} />
        <Stack.Screen name="Steps" component={StepsScreen} />
        <Stack.Screen name="Weight" component={WeightScreen} />
        <Stack.Screen name="Metrics" component={MetricsScreen} />
        <Stack.Screen name="Rewards" component={RewardsScreen} />
        <Stack.Screen name="Theme" component={ThemeScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreens} />
        <Stack.Screen name="Article" component={ArticleScreen} options={{ presentation: 'modal' }} />
        <Stack.Screen name="Legal" component={LegalScreen} options={{ presentation: 'modal' }} />
        <Stack.Screen name="Admin" component={AdminScreen} />
        <Stack.Screen name="Insights" component={InsightsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
