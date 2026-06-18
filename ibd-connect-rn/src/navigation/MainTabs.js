import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useStore } from '../store/Store';
import TodayScreen from '../screens/TodayScreen';
import TrackScreen from '../screens/TrackScreen';
import ReportsScreen from '../screens/ReportsScreen';
import LearnScreen from '../screens/LearnScreen';
import MoreScreen from '../screens/MoreScreen';

const Tab = createBottomTabNavigator();

const ICON = { Today: '🏠', Track: '➕', Reports: '📊', Learn: '📖', More: '⋯' };

export default function MainTabs() {
  const { theme, t } = useStore();
  const label = { Today: t('tabToday'), Track: t('tabTrack'), Reports: t('tabReports'), Learn: t('tabLearn'), More: t('tabMore') };
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: theme.bg2, borderTopColor: theme.line, height: 78, paddingTop: 8, paddingBottom: 14 },
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.faint,
        tabBarLabel: ({ color }) => <Text style={{ color, fontSize: 10.5, fontWeight: '600' }}>{label[route.name]}</Text>,
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 21, color }}>{ICON[route.name]}</Text>,
      })}
    >
      <Tab.Screen name="Today" component={TodayScreen} />
      <Tab.Screen name="Track" component={TrackScreen} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
      <Tab.Screen name="Learn" component={LearnScreen} />
      <Tab.Screen name="More" component={MoreScreen} />
    </Tab.Navigator>
  );
}
