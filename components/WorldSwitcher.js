import { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Portal } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fonts, radius, spacing } from '../constants/theme';
import { selectActiveWorldName, selectWorlds } from '../store/selectors';
import { useLoreStore } from '../store/useLoreStore';

function MenuRow({ icon, label, onPress, danger }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.menuRow,
        danger && styles.menuRowDanger,
        pressed && (danger ? styles.menuRowDangerPressed : styles.menuRowPressed),
      ]}
      onPress={onPress}
    >
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color={danger ? colors.error : colors.textSecondary}
      />
      <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function WorldSwitcher() {
  const worlds = useLoreStore(selectWorlds);
  const activeName = useLoreStore(selectActiveWorldName);
  const activeWorldId = useLoreStore((s) => s.activeWorldId);
  const switchWorld = useLoreStore((s) => s.switchWorld);
  const addWorld = useLoreStore((s) => s.addWorld);
  const renameWorld = useLoreStore((s) => s.renameWorld);
  const deleteWorld = useLoreStore((s) => s.deleteWorld);

  const [menuOpen, setMenuOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [renaming, setRenaming] = useState(null);
  const [draftName, setDraftName] = useState('');

  const closeMenu = () => {
    setMenuOpen(false);
    setCreating(false);
    setRenaming(null);
    setDraftName('');
  };

  const handleCreate = () => {
    addWorld(draftName.trim() || `World ${worlds.length + 1}`);
    closeMenu();
  };

  const handleRename = () => {
    if (renaming && draftName.trim()) renameWorld(renaming, draftName.trim());
    closeMenu();
  };

  const handleDelete = () => {
    Alert.alert('Delete world', `Remove "${activeName}" and all its lore?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteWorld(activeWorldId),
      },
    ]);
  };

  const displayName = activeName.toUpperCase();

  return (
    <View style={styles.container}>
      {menuOpen ? (
        <Portal>
          <Pressable style={styles.backdrop} onPress={closeMenu} />
        </Portal>
      ) : null}

      <View style={styles.wrap}>
        <Pressable
          style={({ pressed }) => [
            styles.selector,
            menuOpen && styles.selectorOpen,
            pressed && styles.selectorPressed,
          ]}
          onPress={() => setMenuOpen((o) => !o)}
        >
          <Text style={styles.label}>{displayName}</Text>
          <MaterialCommunityIcons
            name={menuOpen ? 'chevron-up' : 'chevron-down'}
            size={22}
            color={colors.text}
          />
        </Pressable>

        {menuOpen ? (
          <View style={styles.dropdown}>
            {worlds.map((w) => (
              <MenuRow
                key={w.id}
                icon={w.id === activeWorldId ? 'check-circle' : 'circle-outline'}
                label={w.name.toUpperCase()}
                onPress={() => {
                  switchWorld(w.id);
                  closeMenu();
                }}
              />
            ))}

            <View style={styles.divider} />

            <MenuRow
              icon="pencil-outline"
              label="RENAME WORLD"
              onPress={() => {
                setRenaming(activeWorldId);
                setDraftName(activeName);
                setCreating(false);
              }}
            />
            <MenuRow
              icon="plus"
              label="NEW WORLD"
              onPress={() => {
                setCreating(true);
                setRenaming(null);
                setDraftName('');
              }}
            />
            {worlds.length > 1 ? (
              <View style={styles.dangerSection}>
                <MenuRow
                  icon="delete-outline"
                  label={`DELETE "${displayName}"`}
                  onPress={() => {
                    closeMenu();
                    handleDelete();
                  }}
                  danger
                />
              </View>
            ) : null}

            {(creating || renaming) ? (
              <View style={styles.inlineForm}>
                <TextInput
                  value={draftName}
                  onChangeText={setDraftName}
                  placeholder={creating ? 'World name' : 'Rename world'}
                  placeholderTextColor={colors.textMuted}
                  style={styles.input}
                  autoFocus
                />
                <Pressable
                  style={styles.saveBtn}
                  onPress={creating ? handleCreate : handleRename}
                >
                  <Text style={styles.saveBtnText}>
                    {creating ? 'Add' : 'Save'}
                  </Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const panelStyle = {
  backgroundColor: colors.surfaceElevated,
  borderWidth: 1,
  borderColor: colors.borderLight,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingBottom: spacing.sm,
    zIndex: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  wrap: {
    paddingHorizontal: spacing.md,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    paddingHorizontal: spacing.md,
    ...panelStyle,
    borderRadius: radius.md,
  },
  selectorOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },
  selectorPressed: {
    opacity: 0.95,
  },
  label: {
    flex: 1,
    fontFamily: fonts.serifBold,
    color: colors.text,
    fontSize: 15,
    letterSpacing: 1,
  },
  dropdown: {
    ...panelStyle,
    borderTopWidth: 0,
    borderBottomLeftRadius: radius.md,
    borderBottomRightRadius: radius.md,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 13,
  },
  menuRowPressed: {
    backgroundColor: colors.primaryDark,
  },
  dangerSection: {
    marginTop: spacing.xs,
    marginHorizontal: spacing.sm,
    marginBottom: spacing.sm,
    borderRadius: radius.sm,
    overflow: 'hidden',
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuRowDanger: {
    backgroundColor: colors.surfaceCard,
  },
  menuRowDangerPressed: {
    backgroundColor: colors.surfaceInset,
  },
  menuLabel: {
    flex: 1,
    fontFamily: fonts.serif,
    fontSize: 13,
    color: colors.text,
    letterSpacing: 0.8,
  },
  menuLabelDanger: {
    color: colors.error,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.md,
  },
  inlineForm: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.sm,
    paddingHorizontal: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.primaryDark,
  },
  input: {
    flex: 1,
    fontFamily: fonts.body,
    color: colors.text,
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    fontSize: 14,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  saveBtnText: {
    fontFamily: fonts.serif,
    color: colors.gold,
    fontSize: 13,
    letterSpacing: 0.5,
  },
});
