import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fonts, spacing } from '../../constants/theme';

export default function SectionTitle({ icon, title }) {
  return (
    <View style={styles.wrap}>
      {icon ? (
        <MaterialCommunityIcons name={icon} size={18} color={colors.goldMuted} />
      ) : null}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  title: {
    fontFamily: fonts.serifBold,
    color: colors.text,
    fontSize: 18,
    letterSpacing: 0.5,
  },
});
