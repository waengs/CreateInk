import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from 'react-native-paper';
import { colors, fonts, radius, spacing } from '../../constants/theme';

const PLATFORMS = [
  {
    id: 'windows',
    label: 'Windows',
    steps: [
      'On the PC running Ollama, open Command Prompt or PowerShell.',
      'Run the command below.',
      'Find your active Wi‑Fi or Ethernet adapter.',
      'Copy the IPv4 Address (looks like 192.168.x.x).',
      'Paste only the numbers into Host above, not http:// or :11434.',
    ],
    command: 'ipconfig',
    hint: 'Use the IPv4 Address under "Wireless LAN adapter Wi‑Fi" or "Ethernet adapter". Skip 127.0.0.1.',
  },
  {
    id: 'mac',
    label: 'Mac',
    steps: [
      'On the Mac running Ollama, open Terminal.',
      'Run the command below.',
      'Look for inet under en0 (Wi‑Fi) or en1 (Ethernet).',
      'Copy the address like 192.168.x.x (not 127.0.0.1).',
      'Paste only the numbers into Host above.',
    ],
    command: 'ipconfig getifaddr en0',
    hint: 'If empty, try en1, or open System Settings → Network → Wi‑Fi → Details for your IP.',
  },
  {
    id: 'linux',
    label: 'Linux',
    steps: [
      'On the PC running Ollama, open a terminal.',
      'Run the command below.',
      'Find your wlan0 or eth0 interface.',
      'Copy the inet address like 192.168.x.x.',
      'Paste only the numbers into Host above.',
    ],
    command: 'hostname -I',
    hint: 'Use the first address if several are listed. Phone and PC must be on the same Wi‑Fi.',
  },
];

function CommandBlock({ command, onCopy, copied }) {
  return (
    <View style={styles.commandBlock}>
      <Text style={styles.commandText} selectable>
        {command}
      </Text>
      <TouchableOpacity style={styles.copyBtn} onPress={onCopy} activeOpacity={0.85}>
        <MaterialCommunityIcons
          name={copied ? 'check' : 'content-copy'}
          size={18}
          color={colors.gold}
        />
        <Text style={styles.copyBtnText}>{copied ? 'Copied' : 'Copy'}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function FindPcIpModal({ visible, onDismiss }) {
  const [platform, setPlatform] = useState('windows');
  const [copied, setCopied] = useState(false);

  const active = PLATFORMS.find((p) => p.id === platform) ?? PLATFORMS[0];

  const copyCommand = async () => {
    await Clipboard.setStringAsync(active.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <Pressable style={styles.backdrop} onPress={onDismiss}>
        <Pressable style={styles.dialog} onPress={(e) => e.stopPropagation()}>
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons name="desktop-classic" size={28} color={colors.gold} />
          </View>

          <Text style={styles.title}>Find your PC IP</Text>
          <Text style={styles.lead}>
            CreateInk needs the IP of the computer running Ollama. Run these steps on that PC,
            then enter the address in Host.
          </Text>

          <View style={styles.tabRow}>
            {PLATFORMS.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={[styles.tab, platform === p.id && styles.tabActive]}
                onPress={() => {
                  setPlatform(p.id);
                  setCopied(false);
                }}
              >
                <Text style={[styles.tabText, platform === p.id && styles.tabTextActive]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView
            style={styles.stepsScroll}
            contentContainerStyle={styles.stepsContent}
            showsVerticalScrollIndicator={false}
          >
            {active.steps.map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <Text style={styles.stepNum}>{i + 1}.</Text>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}

            <CommandBlock command={active.command} onCopy={copyCommand} copied={copied} />

            <Text style={styles.hint}>{active.hint}</Text>

            <View style={styles.exampleBox}>
              <Text style={styles.exampleLabel}>EXAMPLE HOST VALUE</Text>
              <Text style={styles.exampleValue} selectable>
                192.168.1.4
              </Text>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.okBtn} onPress={onDismiss} activeOpacity={0.88}>
            <Text style={styles.okBtnText}>Got it</Text>
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
    maxWidth: 380,
    maxHeight: '88%',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.md,
    backgroundColor: colors.surfaceInset,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  title: {
    fontFamily: fonts.serifBold,
    color: colors.text,
    fontSize: 20,
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  lead: {
    fontFamily: fonts.body,
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  tabRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceInset,
    alignItems: 'center',
  },
  tabActive: {
    borderColor: colors.goldMuted,
    backgroundColor: colors.surfaceCard,
  },
  tabText: {
    fontFamily: fonts.body,
    color: colors.textMuted,
    fontSize: 13,
  },
  tabTextActive: {
    fontFamily: fonts.bodySemi,
    color: colors.gold,
  },
  stepsScroll: {
    maxHeight: 280,
    marginBottom: spacing.md,
  },
  stepsContent: {
    paddingBottom: spacing.xs,
  },
  stepRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  stepNum: {
    fontFamily: fonts.bodySemi,
    color: colors.primary,
    fontSize: 14,
    width: 20,
  },
  stepText: {
    flex: 1,
    fontFamily: fonts.body,
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  commandBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceInset,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  commandText: {
    flex: 1,
    fontFamily: fonts.body,
    color: colors.gold,
    fontSize: 14,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  copyBtnText: {
    fontFamily: fonts.bodySemi,
    color: colors.gold,
    fontSize: 12,
  },
  hint: {
    fontFamily: fonts.body,
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  exampleBox: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.sm,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  exampleLabel: {
    fontFamily: fonts.serif,
    color: colors.goldMuted,
    fontSize: 10,
    letterSpacing: 1.2,
    marginBottom: spacing.xs,
  },
  exampleValue: {
    fontFamily: fonts.body,
    color: colors.text,
    fontSize: 15,
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
