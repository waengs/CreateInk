import { useMemo, useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import CharacterAvatar from '../CharacterAvatar';
import { colors, fonts, radius, spacing } from '../../constants/theme';
import { selectWorlds } from '../../store/selectors';
import { useLoreStore } from '../../store/useLoreStore';

const COLS = 3;
const GAP = spacing.sm;
const PAD = spacing.md;
const CARD_W =
  (Dimensions.get('window').width - PAD * 2 - GAP * (COLS - 1)) / COLS;

export default function ImportCharacterModal({ visible, onDismiss, onImport }) {
  const worlds = useLoreStore(selectWorlds);
  const activeWorldId = useLoreStore((s) => s.activeWorldId);
  const [sourceWorldId, setSourceWorldId] = useState(null);
  const [selected, setSelected] = useState([]);
  const [worldMenuOpen, setWorldMenuOpen] = useState(false);

  const otherWorlds = useMemo(
    () => worlds.filter((w) => w.id !== activeWorldId),
    [worlds, activeWorldId]
  );

  const sourceWorld = worlds.find((w) => w.id === sourceWorldId);
  const sourceCharacters = sourceWorld?.characters ?? [];

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleImport = () => {
    if (sourceWorldId && selected.length) {
      onImport(sourceWorldId, selected);
      setSelected([]);
      setSourceWorldId(null);
      onDismiss();
    }
  };

  const close = () => {
    setSelected([]);
    setSourceWorldId(null);
    setWorldMenuOpen(false);
    onDismiss();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={close}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.title}>Import Character</Text>
          <TouchableOpacity onPress={close}>
            <MaterialCommunityIcons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.body}>
          {otherWorlds.length === 0 ? (
            <Text style={styles.empty}>
              Create another world first to import characters from it.
            </Text>
          ) : (
            <>
              <Text style={styles.label}>FROM WORLD</Text>
              <Pressable
                style={styles.worldPicker}
                onPress={() => setWorldMenuOpen((o) => !o)}
              >
                <Text style={styles.worldPickerText}>
                  {(sourceWorld?.name || 'Select world').toUpperCase()}
                </Text>
                <MaterialCommunityIcons
                  name={worldMenuOpen ? 'chevron-up' : 'chevron-down'}
                  size={22}
                  color={colors.text}
                />
              </Pressable>

              {worldMenuOpen ? (
                <View style={styles.worldMenu}>
                  {otherWorlds.map((w) => (
                    <Pressable
                      key={w.id}
                      style={styles.worldRow}
                      onPress={() => {
                        setSourceWorldId(w.id);
                        setSelected([]);
                        setWorldMenuOpen(false);
                      }}
                    >
                      <Text style={styles.worldRowText}>{w.name.toUpperCase()}</Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}

              {sourceWorldId ? (
                <>
                  <Text style={styles.label}>SELECT CHARACTERS</Text>
                  {sourceCharacters.length === 0 ? (
                    <Text style={styles.empty}>No characters in this world.</Text>
                  ) : (
                    <View style={styles.grid}>
                      {sourceCharacters.map((c) => {
                        const picked = selected.includes(c.id);
                        return (
                          <TouchableOpacity
                            key={c.id}
                            style={[styles.card, picked && styles.cardPicked]}
                            onPress={() => toggle(c.id)}
                          >
                            {picked ? (
                              <View style={styles.check}>
                                <MaterialCommunityIcons
                                  name="check"
                                  size={14}
                                  color={colors.background}
                                />
                              </View>
                            ) : null}
                            <View style={styles.avatarWrap}>
                              <CharacterAvatar
                                name={c.name}
                                imageUri={c.imageUri}
                                size={CARD_W - 28}
                              />
                            </View>
                            <Text style={styles.name} numberOfLines={1}>
                              {c.name}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </>
              ) : null}
            </>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelBtn} onPress={close}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.importBtn,
              (!sourceWorldId || !selected.length) && styles.importBtnDisabled,
            ]}
            onPress={handleImport}
            disabled={!sourceWorldId || !selected.length}
          >
            <Text style={styles.importText}>Import</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontFamily: fonts.serifBold,
    color: colors.text,
    fontSize: 18,
  },
  body: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  label: {
    fontFamily: fonts.serif,
    color: colors.textSecondary,
    fontSize: 12,
    letterSpacing: 1.2,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  worldPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.sm,
  },
  worldPickerText: {
    fontFamily: fonts.serifBold,
    color: colors.text,
    fontSize: 14,
    letterSpacing: 0.8,
  },
  worldMenu: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  worldRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  worldRowText: {
    fontFamily: fonts.serif,
    color: colors.text,
    fontSize: 13,
    letterSpacing: 0.6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
  card: {
    width: CARD_W,
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.lg,
    padding: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cardPicked: {
    borderColor: colors.gold,
  },
  avatarWrap: {
    width: CARD_W - 28,
    height: CARD_W - 28,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  check: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontFamily: fonts.bodySemi,
    color: colors.text,
    fontSize: 12,
    marginTop: spacing.sm,
  },
  empty: {
    fontFamily: fonts.body,
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  cancelText: {
    fontFamily: fonts.body,
    color: colors.textSecondary,
    fontSize: 15,
  },
  importBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  importBtnDisabled: {
    opacity: 0.45,
  },
  importText: {
    fontFamily: fonts.serif,
    color: colors.gold,
    fontSize: 14,
    letterSpacing: 0.5,
  },
});
