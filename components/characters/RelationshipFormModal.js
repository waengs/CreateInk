import { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import {
  RELATIONSHIP_TYPES,
  parseRelationshipValue,
  serializeRelationshipValue,
} from '../../constants/relationships';
import { colors, fonts, radius, spacing } from '../../constants/theme';

const emptyForm = () => ({
  charAId: '',
  charBId: '',
  dynamicAToB: 'friends',
  dynamicBToA: 'friends',
  customAToB: '',
  customBToA: '',
});

function CharacterPicker({ label, value, characters, onSelect, disabled }) {
  const [open, setOpen] = useState(false);
  const selected = characters.find((c) => c.id === value);

  return (
    <View style={styles.pickerBlock}>
      <Text style={styles.pickerLabel}>{label}</Text>
      <Pressable
        style={[styles.picker, disabled && styles.pickerDisabled]}
        onPress={() => !disabled && setOpen((o) => !o)}
      >
        <MaterialCommunityIcons name="account" size={20} color={colors.textSecondary} />
        <Text style={styles.pickerText}>
          {selected?.name || 'Click + pick character'}
        </Text>
        {!disabled ? (
          <MaterialCommunityIcons
            name={open ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={colors.text}
          />
        ) : null}
      </Pressable>
      {open && !disabled ? (
        <View style={styles.pickerMenu}>
          {characters.map((c) => (
            <Pressable
              key={c.id}
              style={styles.pickerRow}
              onPress={() => {
                onSelect(c.id);
                setOpen(false);
              }}
            >
              <Text style={styles.pickerRowText}>{c.name}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function TypeSelector({ title, type, custom, onChangeType, onChangeCustom }) {
  return (
    <View style={styles.typeBlock}>
      <Text style={styles.typeTitle}>{title}</Text>
      {RELATIONSHIP_TYPES.map((t) => {
        const active = type === t.key;
        return (
          <Pressable
            key={t.key}
            style={styles.typeRow}
            onPress={() => onChangeType(t.key)}
          >
            <View style={[styles.radio, active && { borderColor: t.color }]}>
              {active ? (
                <View style={[styles.radioDot, { backgroundColor: t.color }]} />
              ) : null}
            </View>
            <View style={[styles.typeDot, { backgroundColor: t.color }]} />
            <Text style={styles.typeLabel}>{t.label}</Text>
          </Pressable>
        );
      })}
      {type === 'other' ? (
        <TextInput
          value={custom}
          onChangeText={onChangeCustom}
          placeholder="Describe the relationship..."
          placeholderTextColor={colors.textMuted}
          style={styles.customInput}
          multiline
          cursorColor={colors.gold}
          selectionColor={colors.primary}
          selectionHandleColor={colors.gold}
          underlineColorAndroid="transparent"
        />
      ) : null}
    </View>
  );
}

function formFromRelationship(rel) {
  if (!rel) return emptyForm();
  const a = parseRelationshipValue(rel.dynamicAToB);
  const b = parseRelationshipValue(rel.dynamicBToA);
  return {
    charAId: rel.charAId,
    charBId: rel.charBId,
    dynamicAToB: a.type,
    dynamicBToA: b.type,
    customAToB: a.custom,
    customBToA: b.custom,
  };
}

export default function RelationshipFormModal({
  visible,
  characters,
  editingRelationship,
  onDismiss,
  onSave,
}) {
  const [form, setForm] = useState(emptyForm());
  const isEdit = !!editingRelationship;

  useEffect(() => {
    if (visible) {
      setForm(formFromRelationship(editingRelationship));
    }
  }, [visible, editingRelationship]);

  const handleSave = () => {
    if (!form.charAId || !form.charBId) {
      Alert.alert('Pick two characters');
      return;
    }
    if (form.charAId === form.charBId) {
      Alert.alert('Choose two different characters');
      return;
    }
    if (form.dynamicAToB === 'other' && !form.customAToB.trim()) {
      Alert.alert('Describe A → B', 'Enter custom text for "Other".');
      return;
    }
    if (form.dynamicBToA === 'other' && !form.customBToA.trim()) {
      Alert.alert('Describe B → A', 'Enter custom text for "Other".');
      return;
    }

    onSave({
      charAId: form.charAId,
      charBId: form.charBId,
      dynamicAToB: serializeRelationshipValue(
        form.dynamicAToB,
        form.customAToB
      ),
      dynamicBToA: serializeRelationshipValue(
        form.dynamicBToA,
        form.customBToA
      ),
    });
    onDismiss();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onDismiss}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {isEdit ? 'Edit Relationship' : 'New Relationship'}
          </Text>
          <TouchableOpacity onPress={onDismiss}>
            <MaterialCommunityIcons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.body}>
          <CharacterPicker
            label="CHARACTER A"
            value={form.charAId}
            characters={characters}
            disabled={isEdit}
            onSelect={(id) => setForm((f) => ({ ...f, charAId: id }))}
          />
          <CharacterPicker
            label="CHARACTER B"
            value={form.charBId}
            characters={characters}
            disabled={isEdit}
            onSelect={(id) => setForm((f) => ({ ...f, charBId: id }))}
          />

          <TypeSelector
            title="A → B"
            type={form.dynamicAToB}
            custom={form.customAToB}
            onChangeType={(key) =>
              setForm((f) => ({ ...f, dynamicAToB: key }))
            }
            onChangeCustom={(t) => setForm((f) => ({ ...f, customAToB: t }))}
          />
          <TypeSelector
            title="B → A"
            type={form.dynamicBToA}
            custom={form.customBToA}
            onChangeType={(key) =>
              setForm((f) => ({ ...f, dynamicBToA: key }))
            }
            onChangeCustom={(t) => setForm((f) => ({ ...f, customBToA: t }))}
          />
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity onPress={onDismiss}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>Save</Text>
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
  pickerBlock: {
    marginBottom: spacing.md,
  },
  pickerLabel: {
    fontFamily: fonts.serif,
    color: colors.textSecondary,
    fontSize: 11,
    letterSpacing: 1.2,
    marginBottom: spacing.xs,
  },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 52,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  pickerDisabled: {
    opacity: 0.7,
  },
  pickerText: {
    flex: 1,
    fontFamily: fonts.body,
    color: colors.text,
    fontSize: 15,
  },
  pickerMenu: {
    marginTop: 4,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
  },
  pickerRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  pickerRowText: {
    fontFamily: fonts.body,
    color: colors.text,
    fontSize: 14,
  },
  typeBlock: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  typeTitle: {
    fontFamily: fonts.serifBold,
    color: colors.goldMuted,
    fontSize: 14,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 8,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  typeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  typeLabel: {
    fontFamily: fonts.body,
    color: colors.text,
    fontSize: 14,
  },
  customInput: {
    marginTop: spacing.sm,
    backgroundColor: colors.surfaceInset,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    fontFamily: fonts.body,
    color: colors.text,
    fontSize: 14,
    minHeight: 72,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelText: {
    fontFamily: fonts.body,
    color: colors.textSecondary,
    fontSize: 15,
    paddingVertical: spacing.sm,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  saveText: {
    fontFamily: fonts.serif,
    color: colors.gold,
    fontSize: 14,
    letterSpacing: 0.5,
  },
});
