import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import CharacterAvatar from '../CharacterAvatar';
import { colors, fonts, radius, spacing } from '../../constants/theme';
import { timeAgo } from '../../utils/timeAgo';
import { normalizeStoryTags } from '../../utils/storyTags';

export default function StoryGenerationCard({ story, characters, plot, onPress, compact }) {
  const cast = (story.characterIds || [])
    .map((id) => characters.find((c) => c.id === id))
    .filter(Boolean)
    .slice(0, 4);

  const tags = normalizeStoryTags(story.tags);
  const preview = story.content?.slice(0, compact ? 200 : 280) || '';
  const hasMeta = plot?.title || tags.length > 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      <View style={styles.topRow}>
        <Text style={styles.title} numberOfLines={1}>
          {story.title || 'Story Title'}
        </Text>
        <Text style={styles.time}>{timeAgo(story.createdAt)}</Text>
      </View>

      {cast.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.castRow}
        >
          {cast.map((c) => (
            <View key={c.id} style={styles.castBox}>
              <CharacterAvatar name={c.name} imageUri={c.imageUri} size={40} />
            </View>
          ))}
        </ScrollView>
      ) : null}

      {hasMeta ? (
        <View style={styles.tagRow}>
          {plot?.title ? (
            <View style={styles.plotPill}>
              <Text style={styles.plotPillText} numberOfLines={1}>
                {plot.title}
              </Text>
            </View>
          ) : null}
          {tags.map((t) => (
            <View key={t} style={styles.tagPill}>
              <Text style={styles.tagPillText} numberOfLines={1}>
                {t}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      <Text style={styles.preview} numberOfLines={compact ? 4 : 6}>
        {preview}
        {story.content?.length > preview.length ? '…' : ''}
      </Text>

      <LinearGradient
        colors={['transparent', colors.surfaceCard]}
        style={styles.fade}
        pointerEvents="none"
      />
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
    overflow: 'hidden',
    minHeight: 160,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  title: {
    flex: 1,
    fontFamily: fonts.serifBold,
    color: colors.text,
    fontSize: 17,
    letterSpacing: 0.3,
  },
  time: {
    fontFamily: fonts.body,
    color: colors.textMuted,
    fontSize: 12,
  },
  castRow: {
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  castBox: {
    borderRadius: radius.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  plotPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.xl,
    backgroundColor: colors.primaryDark,
    borderWidth: 1,
    borderColor: colors.primary,
    maxWidth: 160,
  },
  plotPillText: {
    fontFamily: fonts.serif,
    fontSize: 10,
    color: colors.gold,
    letterSpacing: 0.4,
  },
  tagPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    maxWidth: 140,
  },
  tagPillText: {
    fontFamily: fonts.serif,
    fontSize: 10,
    color: colors.textSecondary,
    letterSpacing: 0.4,
  },
  preview: {
    fontFamily: fonts.body,
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    paddingBottom: spacing.xl,
  },
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 56,
  },
});
