import { Modal, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from 'react-native-paper';
import { colors, fonts, radius, spacing } from '../../constants/theme';

const FAILURE_TIPS = [
  'Install and open Ollama on your PC',
  null,
  'On a phone: set host to your PC Wi‑Fi IP',
  'Allow port 11434 in Windows Firewall',
];

export default function ConnectionTestModal({
  visible,
  success,
  message,
  endpoint,
  model,
  onDismiss,
}) {
  const icon = success ? 'check-circle-outline' : 'lan-disconnect';
  const iconColor = success ? colors.success : colors.error;
  const title = success ? 'Connected' : 'Cannot connect';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <Pressable style={styles.backdrop} onPress={onDismiss}>
        <Pressable style={styles.dialog} onPress={(e) => e.stopPropagation()}>
          <View style={[styles.iconWrap, success ? styles.iconSuccess : styles.iconError]}>
            <MaterialCommunityIcons name={icon} size={32} color={iconColor} />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {endpoint ? (
            <View style={styles.endpointBox}>
              <Text style={styles.endpointLabel}>ENDPOINT</Text>
              <Text style={styles.endpointUrl} selectable>
                {endpoint}
              </Text>
            </View>
          ) : null}

          {!success ? (
            <ScrollView
              style={styles.tipsScroll}
              contentContainerStyle={styles.tipsContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.tipsHead}>On your PC</Text>
              {FAILURE_TIPS.map((tip, i) => {
                const text =
                  i === 1 ? `Run: ollama pull ${model || 'llama3'}` : tip;
                return (
                  <View key={i} style={styles.tipRow}>
                    <Text style={styles.tipNum}>{i + 1}.</Text>
                    <Text style={styles.tipText}>{text}</Text>
                  </View>
                );
              })}
            </ScrollView>
          ) : null}

          <TouchableOpacity style={styles.okBtn} onPress={onDismiss} activeOpacity={0.88}>
            <Text style={styles.okBtnText}>OK</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  dialog: {
    width: '100%',
    maxWidth: 360,
    maxHeight: '85%',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  iconSuccess: {
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    borderColor: 'rgba(34, 197, 94, 0.35)',
  },
  iconError: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.35)',
  },
  title: {
    fontFamily: fonts.serifBold,
    color: colors.text,
    fontSize: 20,
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  message: {
    fontFamily: fonts.body,
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  endpointBox: {
    backgroundColor: colors.surfaceInset,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  endpointLabel: {
    fontFamily: fonts.serif,
    color: colors.goldMuted,
    fontSize: 10,
    letterSpacing: 1.2,
    marginBottom: spacing.xs,
  },
  endpointUrl: {
    fontFamily: fonts.body,
    color: colors.gold,
    fontSize: 13,
  },
  tipsScroll: {
    maxHeight: 160,
    marginBottom: spacing.md,
  },
  tipsContent: {
    paddingBottom: spacing.xs,
  },
  tipsHead: {
    fontFamily: fonts.serif,
    color: colors.goldMuted,
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  tipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  tipNum: {
    fontFamily: fonts.bodySemi,
    color: colors.primary,
    fontSize: 13,
    width: 18,
  },
  tipText: {
    flex: 1,
    fontFamily: fonts.body,
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  okBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    minHeight: 44,
  },
  okBtnText: {
    fontFamily: fonts.serif,
    color: colors.gold,
    fontSize: 15,
    letterSpacing: 0.5,
  },
});
