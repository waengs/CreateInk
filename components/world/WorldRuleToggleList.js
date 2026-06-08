import { StyleSheet, View } from 'react-native';
import { Switch, Text } from 'react-native-paper';
import { colors, fonts, radius, spacing } from '../../constants/theme';

export function toggleStateFromRuleIds(ruleIds = []) {
  if (!ruleIds?.length) return {};
  return Object.fromEntries(ruleIds.map((id) => [id, true]));
}

export function enabledRuleIdsFromToggle(rules, enabledRules) {
  const enabled = rules.filter((w) => enabledRules[w.id]);
  const list = enabled.length > 0 ? enabled : rules;
  return list.map((r) => r.id);
}

export default function WorldRuleToggleList({
  rules,
  enabledRules,
  onToggle,
  label = 'WORLD RULES',
}) {
  if (!rules.length) return null;

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      {rules.map((w) => (
        <View key={w.id} style={styles.ruleRow}>
          <Text style={styles.ruleLabel} numberOfLines={3}>
            {w.name?.trim() || w.ruleText}
          </Text>
          <Switch
            value={!!enabledRules[w.id]}
            onValueChange={() => onToggle(w.id)}
            color={colors.primary}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.sm,
  },
  label: {
    fontFamily: fonts.serif,
    color: colors.textSecondary,
    fontSize: 11,
    letterSpacing: 1.2,
    marginBottom: spacing.sm,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  ruleLabel: {
    flex: 1,
    fontFamily: fonts.body,
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
});
