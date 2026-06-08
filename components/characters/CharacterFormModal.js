import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import { colors, fonts, radius, spacing } from '../../constants/theme';

const FIELDS = [
  { key: 'name', label: 'Name', required: true },
  { key: 'age', label: 'Age', placeholder: 'e.g. 24' },
  { key: 'race', label: 'Race', placeholder: 'e.g. Elf' },
  { key: 'personality', label: 'Personality', multiline: true },
  { key: 'likes', label: 'Likes', multiline: true },
  { key: 'dislikes', label: 'Dislikes', multiline: true },
];

export const emptyCharacterForm = () => ({
  name: '',
  age: '',
  race: '',
  personality: '',
  likes: '',
  dislikes: '',
  imageUri: null,
});

export default function CharacterFormModal({
  visible,
  editingCharacter,
  onDismiss,
  onSave,
  onDelete,
}) {
  const [form, setForm] = useState(emptyCharacterForm());

  useEffect(() => {
    if (visible && editingCharacter) {
      setForm({
        name: editingCharacter.name || '',
        age: editingCharacter.age || '',
        race: editingCharacter.race || '',
        personality: editingCharacter.personality || '',
        likes: editingCharacter.likes || '',
        dislikes: editingCharacter.dislikes || '',
        imageUri: editingCharacter.imageUri || null,
      });
    } else if (visible) {
      setForm(emptyCharacterForm());
    }
  }, [visible, editingCharacter]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow photo access to upload a portrait.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      setForm((p) => ({ ...p, imageUri: result.assets[0].uri }));
    }
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      Alert.alert('Name required');
      return;
    }
    onSave(form);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onDismiss}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {editingCharacter ? 'Edit Character' : 'New Character'}
          </Text>
          <TouchableOpacity onPress={onDismiss}>
            <MaterialCommunityIcons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity style={styles.uploadBox} onPress={pickImage} activeOpacity={0.9}>
            {form.imageUri ? (
              <Image
                source={{ uri: form.imageUri }}
                style={styles.uploadImage}
                resizeMode="cover"
              />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="image-plus"
                  size={32}
                  color={colors.textMuted}
                />
                <Text style={styles.uploadLabel}>+ UPLOAD IMG</Text>
              </>
            )}
          </TouchableOpacity>

          {FIELDS.map((f) => (
            <View key={f.key} style={styles.field}>
              <Text style={styles.fieldLabel}>{f.label.toUpperCase()}</Text>
              <TextInput
                value={form[f.key]}
                onChangeText={(t) => setForm((p) => ({ ...p, [f.key]: t }))}
                multiline={f.multiline}
                numberOfLines={f.multiline ? 4 : 1}
                placeholder={f.placeholder}
                placeholderTextColor={colors.textMuted}
                style={[styles.input, f.multiline && styles.inputMulti]}
                cursorColor={colors.gold}
                selectionColor={colors.primary}
                selectionHandleColor={colors.gold}
                underlineColorAndroid="transparent"
              />
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          {editingCharacter ? (
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
  uploadBox: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  uploadImage: {
    width: '100%',
    height: '100%',
  },
  uploadLabel: {
    fontFamily: fonts.serif,
    color: colors.textMuted,
    fontSize: 12,
    letterSpacing: 1,
  },
  field: {
    marginBottom: spacing.md,
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
    minHeight: 96,
    textAlignVertical: 'top',
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
