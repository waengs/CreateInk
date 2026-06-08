import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors, fonts, radius, spacing } from '../../constants/theme';

const TABS = [
  { key: 'Rules', label: 'rules' },
  { key: 'Plots', label: 'plots' },
];

export default function WorldTabBar({ active, onChange }) {
  return (
    <View style={styles.wrap}>
      {TABS.map((tab) => {
        const selected = active === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, selected && styles.tabActive]}
            onPress={() => onChange(tab.key)}
            activeOpacity={0.85}
          >
            <Text style={[styles.label, selected && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.borderLight,
  },
  label: {
    fontFamily: fonts.serif,
    fontSize: 14,
    color: colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'lowercase',
  },
  labelActive: {
    color: colors.text,
    fontFamily: fonts.serifBold,
  },
});
