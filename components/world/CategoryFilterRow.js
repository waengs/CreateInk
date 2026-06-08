import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { categoryMeta, colors, fonts, radius, spacing } from '../../constants/theme';
import { WORLD_CATEGORIES } from '../../store/useLoreStore';

export default function CategoryFilterRow({ active, onChange }) {
  const filters = [{ key: 'all', label: 'All' }, ...WORLD_CATEGORIES.map((cat) => ({
    key: cat,
    label: categoryMeta[cat]?.label || cat,
  }))];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.content}
    >
      {filters.map((f) => {
        const selected = active === f.key;
        return (
          <TouchableOpacity
            key={f.key}
            style={[styles.pill, selected && styles.pillActive]}
            onPress={() => onChange(f.key)}
            activeOpacity={0.85}
          >
            <Text style={[styles.pillText, selected && styles.pillTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    maxHeight: 44,
    marginBottom: spacing.md,
  },
  content: {
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.xl,
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.borderLight,
  },
  pillText: {
    fontFamily: fonts.serif,
    fontSize: 12,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  pillTextActive: {
    color: colors.text,
  },
});
