import { Tabs, usePathname } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GenerateFab from '../../components/GenerateFab';
import { colors, fonts } from '../../constants/theme';

export default function TabLayout() {
  const pathname = usePathname();
  const showFab =
    !pathname?.includes('settings') && !pathname?.includes('generate');

  return (
    <View style={styles.root}>
      <View style={styles.tabs}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: colors.tabBar,
              borderTopColor: colors.border,
              borderTopWidth: 1,
              height: 64,
              paddingBottom: 8,
              paddingTop: 6,
            },
            tabBarActiveTintColor: colors.gold,
            tabBarInactiveTintColor: colors.textMuted,
            tabBarLabelStyle: {
              fontFamily: fonts.serif,
              fontSize: 10,
              letterSpacing: 0.5,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home-outline" color={color} size={size} />
              ),
            }}
          />
          <Tabs.Screen
            name="characters"
            options={{
              title: 'Characters',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="account-group-outline" color={color} size={size} />
              ),
            }}
          />
          <Tabs.Screen
            name="world"
            options={{
              title: 'World',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="earth" color={color} size={size} />
              ),
            }}
          />
          <Tabs.Screen
            name="library"
            options={{
              title: 'Library',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="bookshelf" color={color} size={size} />
              ),
            }}
          />
          <Tabs.Screen name="generate" options={{ href: null }} />
          <Tabs.Screen name="settings" options={{ href: null }} />
        </Tabs>
      </View>
      {showFab ? <GenerateFab /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabs: {
    flex: 1,
  },
});
