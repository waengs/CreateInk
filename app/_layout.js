import { Stack } from 'expo-router';

import { StatusBar } from 'expo-status-bar';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { PaperProvider } from 'react-native-paper';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { paperTheme } from '../constants/theme';

import { colors } from '../constants/theme';



export default function RootLayout() {

  return (

    <GestureHandlerRootView style={{ flex: 1 }}>

      <SafeAreaProvider>

        <PaperProvider theme={paperTheme}>

          <StatusBar style="light" />

          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>

            <Stack.Screen name="index" options={{ animation: 'none' }} />

            <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />

          </Stack>

        </PaperProvider>

      </SafeAreaProvider>

    </GestureHandlerRootView>

  );

}

