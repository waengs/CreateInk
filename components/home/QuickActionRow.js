import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fonts, radius, spacing } from '../../constants/theme';

const ACTIONS = [
  { key: 'chara', label: 'ADD\nCHARACTER', icon: 'account-plus' },
  { key: 'rule', label: 'ADD\nWORLD RULE', icon: 'book-plus' },
  { key: 'plot', label: 'ADD\nPLOT SEED', icon: 'sprout' },
];

export default function QuickActionRow({ onAction }) {
  return (
    <View style={styles.row}>
      {ACTIONS.map((a) => (
        <TouchableOpacity
          key={a.key}
          style={styles.cardOuter}
          onPress={() => onAction(a.key)}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[colors.cardGradientStart, colors.cardGradientEnd]}
            style={styles.card}
          >
            <MaterialCommunityIcons
              name={a.icon}
              size={28}
              color={colors.text}
              style={styles.icon}
            />
            <Text style={styles.label}>{a.label}</Text>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  cardOuter: {
    flex: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  card: {
    minHeight: 120,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  icon: {
    marginTop: spacing.sm,
    opacity: 0.95,
  },
  label: {
    fontFamily: fonts.serif,
    color: colors.text,
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 14,
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
  },
});
