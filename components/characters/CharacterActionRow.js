import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fonts, radius, spacing } from '../../constants/theme';

export default function CharacterActionRow({ onImport, onAddNew }) {
  return (
    <View style={styles.row}>
      <TouchableOpacity style={styles.btnOuter} onPress={onImport} activeOpacity={0.85}>
        <LinearGradient
          colors={[colors.cardGradientStart, colors.cardGradientEnd]}
          style={styles.btn}
        >
          <MaterialCommunityIcons name="import" size={20} color={colors.text} />
          <Text style={styles.label}>IMPORT{'\n'}CHARACTER</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnOuter} onPress={onAddNew} activeOpacity={0.85}>
        <LinearGradient
          colors={[colors.cardGradientStart, colors.cardGradientEnd]}
          style={styles.btn}
        >
          <MaterialCommunityIcons name="account-plus" size={20} color={colors.text} />
          <Text style={styles.label}>ADD NEW</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  btnOuter: {
    flex: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  btn: {
    minHeight: 72,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  label: {
    fontFamily: fonts.serif,
    color: colors.text,
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 14,
    letterSpacing: 0.8,
  },
});
