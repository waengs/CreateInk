import { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import { colors, fonts, radius, spacing } from '../../constants/theme';
export const emptyPlotForm = () => ({
  title: '',
  logline: '',
});

export default function PlotFormModal({
  visible,
  editingPlot,
  onDismiss,
  onSave,
  onDelete,
}) {
  const [form, setForm] = useState(emptyPlotForm());

  useEffect(() => {
    if (!visible) return;
    if (editingPlot) {
      setForm({
        title: editingPlot.title || '',
        logline: editingPlot.logline || '',
      });
    } else {
      setForm(emptyPlotForm());
    }
  }, [visible, editingPlot]);

  const handleSave = () => {
    if (!form.title.trim()) {
      Alert.alert('Title required', 'Give this plot seed a title.');
      return;
    }
    onSave(form);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onDismiss}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {editingPlot ? 'Edit Plot Seed' : 'New Plot Seed'}
          </Text>
          <TouchableOpacity onPress={onDismiss}>
            <MaterialCommunityIcons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.field}>
            <TextInput
              value={form.title}
              onChangeText={(t) => setForm((p) => ({ ...p, title: t }))}
              placeholder="Plot Name..."
              placeholderTextColor={colors.textMuted}
              style={styles.nameInput}
              cursorColor={colors.gold}
              selectionColor={colors.primary}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>DESCRIPTION</Text>
            <TextInput
              value={form.logline}
              onChangeText={(t) => setForm((p) => ({ ...p, logline: t }))}
              placeholder="What happens in this plot?"
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={6}
              style={[styles.input, styles.inputMulti]}
              cursorColor={colors.gold}
              selectionColor={colors.primary}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          {editingPlot ? (
            <TouchableOpacity onPress={onDelete}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}
          <View style={styles.footerBtns}>
            <TouchableOpacity onPress={onDismiss}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
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
  field: {
    marginBottom: spacing.md,
  },
  nameInput: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    fontFamily: fonts.serifBold,
    fontSize: 17,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 48,
  },
  fieldLabel: {
    fontFamily: fonts.serif,
    color: colors.textSecondary,
    fontSize: 11,
    letterSpacing: 1.2,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.text,
    paddingHorizontal: spacing.sm,
    paddingVertical: 10,
    minHeight: 44,
  },
  inputMulti: {
    minHeight: 140,
    paddingTop: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  cancelText: {
    fontFamily: fonts.body,
    color: colors.textSecondary,
    fontSize: 15,
  },
  deleteText: {
    fontFamily: fonts.body,
    color: colors.error,
    fontSize: 15,
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
