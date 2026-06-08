import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import LoreForgeLogo from './LoreForgeLogo';
import { colors, fonts, spacing } from '../constants/theme';

export default function LoadingScreen() {
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fade]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fade }]}>
        <LoreForgeLogo size={72} style={styles.logoMark} />
        <Text style={styles.title}>LoreForge</Text>
        <Text style={styles.tagline}>FORGE WORLDS, INSPIRE STORIES</Text>
        <Text style={styles.subtitle}>Loading your worlds…</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  logoMark: {
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: fonts.serifBold,
    color: colors.text,
    fontSize: 28,
    letterSpacing: 1,
  },
  tagline: {
    fontFamily: fonts.serif,
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 1.5,
    marginTop: spacing.sm,
  },
  subtitle: {
    fontFamily: fonts.bodyItalic,
    color: colors.gold,
    fontSize: 15,
    marginTop: spacing.xl,
  },
});
