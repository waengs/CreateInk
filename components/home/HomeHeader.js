import { StyleSheet, Text, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import CreateInkLogo from '../CreateInkLogo';
import { colors, fonts, spacing } from '../../constants/theme';
import { useSettingsStore } from '../../store/useSettingsStore';

export default function HomeHeader({
  greeting,
  showSettings = true,
  showSetupHelp = true,
  showBack = false,
}) {
  const router = useRouter();
  const setSetupGuideVisible = useSettingsStore((s) => s.setSetupGuideVisible);

  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        {showBack ? (
          <IconButton
            icon="arrow-left"
            iconColor={colors.textSecondary}
            size={24}
            onPress={() => router.back()}
            style={styles.sideBtn}
          />
        ) : null}
        <CreateInkLogo size={48} />
        <View style={styles.brandBlock}>
          <Text style={styles.brand}>CreateInk</Text>
          <Text style={styles.tagline}>CREATE WORLDS, INSPIRE STORIES</Text>
        </View>
        {showBack ? (
          <View style={styles.sideBtn} />
        ) : showSettings ? (
          <View style={styles.headerActions}>
            {showSetupHelp ? (
              <IconButton
                icon="information-outline"
                iconColor={colors.textSecondary}
                size={24}
                onPress={() => setSetupGuideVisible(true)}
                style={styles.headerIcon}
                accessibilityLabel="Ollama setup guide"
              />
            ) : null}
            <IconButton
              icon="cog-outline"
              iconColor={colors.textSecondary}
              size={24}
              onPress={() => router.push('/settings')}
              style={styles.headerIcon}
              accessibilityLabel="Settings"
            />
          </View>
        ) : (
          <View style={styles.sideBtn} />
        )}
      </View>
      {greeting ? <Text style={styles.greeting}>{greeting}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  brandBlock: {
    flex: 1,
  },
  brand: {
    fontFamily: fonts.serifBold,
    fontSize: 22,
    color: colors.text,
    letterSpacing: 0.5,
  },
  tagline: {
    fontFamily: fonts.serif,
    fontSize: 9,
    color: colors.textMuted,
    letterSpacing: 1.2,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    margin: 0,
  },
  sideBtn: {
    width: 40,
    margin: 0,
  },
  greeting: {
    fontFamily: fonts.bodyItalic,
    fontSize: 17,
    color: colors.gold,
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: 24,
  },
});
