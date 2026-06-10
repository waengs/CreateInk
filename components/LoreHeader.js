import { StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import CreateInkLogo from './CreateInkLogo';
import { colors, fonts, spacing } from '../constants/theme';

export default function LoreHeader({
  title = 'CreateInk',
  showLogo = true,
  showSettings = true,
  right,
}) {
  const router = useRouter();

  return (
    <View style={styles.wrap}>
      <View style={styles.left}>
        {showLogo ? <CreateInkLogo size={36} /> : null}
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.right}>
        {right}
        {showSettings ? (
          <IconButton
            icon="cog-outline"
            iconColor={colors.textSecondary}
            size={22}
            onPress={() => router.push('/settings')}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  title: {
    fontFamily: fonts.serifBold,
    color: colors.text,
    fontSize: 20,
    letterSpacing: 0.5,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
