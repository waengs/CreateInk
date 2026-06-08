import { useRouter } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts, radius, spacing } from '../constants/theme';
import { useGenerateDraftStore } from '../store/useGenerateDraftStore';

export default function GenerateFab() {
  const router = useRouter();
  const requestFreshGenerate = useGenerateDraftStore((s) => s.requestFreshGenerate);

  return (
    <Pressable
      style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
      onPress={() => {
        requestFreshGenerate();
        router.push('/generate');
      }}
    >
      <Text style={styles.label}>GENERATE +</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: spacing.md,
    bottom: 80,
    backgroundColor: colors.surfaceInset,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    borderRadius: radius.lg,
    zIndex: 100,
    borderWidth: 2,
    borderColor: colors.gold,
    ...Platform.select({
      ios: {
        shadowColor: colors.gold,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
      },
      android: { elevation: 8 },
    }),
  },
  fabPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
    backgroundColor: colors.surfaceCard,
  },
  label: {
    fontFamily: fonts.serifBold,
    fontSize: 14,
    color: colors.gold,
    letterSpacing: 1,
    ...Platform.select({
      ios: {
        textShadowColor: 'rgba(0, 0, 0, 0.85)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
      },
      android: {},
    }),
  },
});
