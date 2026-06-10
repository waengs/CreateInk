import { useEffect, useState } from 'react';
import { Tabs, usePathname, useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GenerateFab from '../../components/GenerateFab';
import OllamaSetupModal from '../../components/onboarding/OllamaSetupModal';
import { colors, fonts } from '../../constants/theme';
import { useSettingsStore } from '../../store/useSettingsStore';
import { isEmulatorOnlyHost } from '../../utils/ollamaHost';

export default function TabLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const hasSeenOnboarding = useSettingsStore((s) => s.hasSeenOllamaOnboarding);
  const ollamaHost = useSettingsStore((s) => s.ollamaHost);
  const setHasSeenOnboarding = useSettingsStore((s) => s.setHasSeenOllamaOnboarding);
  const setupGuideVisible = useSettingsStore((s) => s.setupGuideVisible);
  const setSetupGuideVisible = useSettingsStore((s) => s.setSetupGuideVisible);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [settingsHydrated, setSettingsHydrated] = useState(
    () => useSettingsStore.persist.hasHydrated()
  );

  const showFab =
    !pathname?.includes('settings') && !pathname?.includes('generate');

  useEffect(() => {
    if (useSettingsStore.persist.hasHydrated()) {
      setSettingsHydrated(true);
      return;
    }
    return useSettingsStore.persist.onFinishHydration(() => setSettingsHydrated(true));
  }, []);

  useEffect(() => {
    if (!settingsHydrated || hasSeenOnboarding) return;

    const host = ollamaHost?.trim();
    if (host && !isEmulatorOnlyHost(host)) {
      setHasSeenOnboarding(true);
      return;
    }

    setShowOnboarding(true);
  }, [
    settingsHydrated,
    hasSeenOnboarding,
    ollamaHost,
    setHasSeenOnboarding,
  ]);

  const closeGuide = (markSeen = false) => {
    setShowOnboarding(false);
    setSetupGuideVisible(false);
    if (markSeen) setHasSeenOnboarding(true);
  };

  const openSettingsFromOnboarding = () => {
    closeGuide(true);
    router.push('/settings');
  };

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

      <OllamaSetupModal
        visible={showOnboarding || setupGuideVisible}
        onOpenSettings={openSettingsFromOnboarding}
        onDismiss={() => closeGuide(!hasSeenOnboarding)}
      />
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
