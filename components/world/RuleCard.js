import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { categoryMeta, colors, fonts, radius, spacing } from '../../constants/theme';

function ruleTitle(rule) {
  if (rule.name?.trim()) return rule.name.trim();
  const text = rule.ruleText?.trim() || 'Untitled Rule';
  return text.length > 48 ? `${text.slice(0, 48)}…` : text;
}

export default function RuleCard({ rule, characters, onPress, onDelete }) {
  const meta = categoryMeta[rule.category] || categoryMeta.history;
  const linkedChars = (rule.characterIds || [])
    .map((id) => characters.find((c) => c.id === id))
    .filter(Boolean);
  const isWorldRule = linkedChars.length === 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      <View style={styles.topRow}>
        <Text style={styles.title} numberOfLines={1}>
          {ruleTitle(rule)}
        </Text>
        <TouchableOpacity
          onPress={onDelete}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialCommunityIcons name="delete-outline" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {rule.ruleText?.trim() ? (
        <Text style={styles.description} numberOfLines={3}>
          {rule.ruleText}
        </Text>
      ) : null}

      <View style={styles.tagRow}>
        <View style={[styles.tag, { borderColor: meta.color }]}>
          <MaterialCommunityIcons name={meta.icon} size={12} color={meta.color} />
          <Text style={[styles.tagText, { color: meta.color }]}>{meta.label}</Text>
        </View>
        {isWorldRule ? (
          <View style={styles.tag}>
            <MaterialCommunityIcons name="earth" size={12} color={colors.goldMuted} />
            <Text style={styles.tagText}>World rule</Text>
          </View>
        ) : (
          linkedChars.map((c) => (
            <View key={c.id} style={styles.tag}>
              <Text style={styles.tagText} numberOfLines={1}>
                {c.name.toUpperCase()}
              </Text>
            </View>
          ))
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  title: {
    flex: 1,
    fontFamily: fonts.serifBold,
    color: colors.text,
    fontSize: 16,
    letterSpacing: 0.3,
  },
  description: {
    fontFamily: fonts.body,
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: spacing.sm,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    maxWidth: 160,
  },
  tagText: {
    fontFamily: fonts.serif,
    fontSize: 10,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
});
