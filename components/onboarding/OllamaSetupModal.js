import { useEffect, useState } from 'react';
import {
  Linking,
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

const OLLAMA_URL = 'https://ollama.com';

const STEPS = [
  {
    id: 'welcome',
    icon: 'book-open-page-variant',
    title: 'Welcome to CreateInk',
    body:
      'CreateInk writes stories with AI using Ollama on your computer. Nothing is sent to the cloud. Your phone talks to Ollama over Wi-Fi.',
    bullets: [
      'Install Ollama on your PC or Mac',
      'Pull a model (e.g. llama3)',
      'Enter your PC IP in Settings',
    ],
  },
  {
    id: 'install',
    icon: 'download-outline',
    title: 'Install Ollama',
    body: 'On the computer that will run AI generation:',
    bullets: [
      'Open ollama.com in your browser',
      'Download the installer for Windows, Mac, or Linux',
      'Run the installer and open the Ollama app',
      'You should see Ollama running in the system tray or menu bar',
    ],
    link: { label: 'Open ollama.com', url: OLLAMA_URL },
  },
  {
    id: 'run',
    icon: 'play-circle-outline',
    title: 'Run a model',
    body: 'With Ollama open, run this in Terminal (Mac/Linux) or PowerShell (Windows):',
    command: 'ollama pull llama3',
    bullets: [
      'Wait until the download finishes',
      'Keep Ollama running while you use CreateInk',
      'On your PC, open http://localhost:11434 to confirm it says Ollama is running',
    ],
  },
  {
    id: 'connect',
    icon: 'lan-connect',
    title: 'Connect your phone',
    body: 'Your phone and PC must be on the same Wi-Fi network.',
    bullets: [
      'On your PC, find your Wi-Fi IP (e.g. 192.168.1.4)',
      'In CreateInk, open Settings',
      'Under Host, enter only the IP numbers',
      'Tap Test connection. You should see Connected',
    ],
    note: 'Do not use localhost or 10.0.2.2 on a real phone. Those only work on emulators.',
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

export default function OllamaSetupModal({ visible, onOpenSettings, onDismiss }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (visible) {
      setStepIndex(0);
      setCopied(false);
    }
  }, [visible]);

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;
  const isFirst = stepIndex === 0;

  const copyCommand = async () => {
    if (!step.command) return;
    await Clipboard.setStringAsync(step.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const goNext = () => {
    if (isLast) {
      onOpenSettings();
      return;
    }
    setCopied(false);
    setStepIndex((i) => i + 1);
  };

  const goBack = () => {
    setCopied(false);
    setStepIndex((i) => Math.max(0, i - 1));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <Pressable style={styles.backdrop}>
        <Pressable style={styles.dialog} onPress={(e) => e.stopPropagation()}>
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons name={step.icon} size={28} color={colors.gold} />
          </View>

          <Text style={styles.stepLabel}>
            Step {stepIndex + 1} of {STEPS.length}
          </Text>
          <Text style={styles.title}>{step.title}</Text>

          <ScrollView
            style={styles.bodyScroll}
            contentContainerStyle={styles.bodyContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.body}>{step.body}</Text>

            {step.command ? (
              <CommandBlock command={step.command} onCopy={copyCommand} copied={copied} />
            ) : null}

            {step.bullets.map((line, i) => (
              <View key={i} style={styles.bulletRow}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{line}</Text>
              </View>
            ))}

            {step.link ? (
              <TouchableOpacity
                style={styles.linkBtn}
                onPress={() => Linking.openURL(step.link.url)}
                activeOpacity={0.85}
              >
                <MaterialCommunityIcons name="open-in-new" size={18} color={colors.gold} />
                <Text style={styles.linkBtnText}>{step.link.label}</Text>
              </TouchableOpacity>
            ) : null}

            {step.note ? <Text style={styles.note}>{step.note}</Text> : null}
          </ScrollView>

          <View style={styles.dots}>
            {STEPS.map((s, i) => (
              <View key={s.id} style={[styles.dot, i === stepIndex && styles.dotActive]} />
            ))}
          </View>

          <View style={styles.actions}>
            {!isFirst ? (
              <TouchableOpacity style={styles.secondaryBtn} onPress={goBack} activeOpacity={0.85}>
                <Text style={styles.secondaryBtnText}>Back</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.secondaryBtn} onPress={onDismiss} activeOpacity={0.85}>
                <Text style={styles.secondaryBtnText}>Skip</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.primaryBtn} onPress={goNext} activeOpacity={0.88}>
              <Text style={styles.primaryBtnText}>
                {isLast ? 'Open Settings' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  dialog: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
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
    marginBottom: spacing.sm,
    backgroundColor: colors.surfaceInset,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  stepLabel: {
    fontFamily: fonts.serif,
    color: colors.goldMuted,
    fontSize: 11,
    letterSpacing: 1.2,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontFamily: fonts.serifBold,
    color: colors.text,
    fontSize: 22,
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  bodyScroll: {
    maxHeight: 320,
    marginBottom: spacing.md,
  },
  bodyContent: {
    paddingBottom: spacing.xs,
  },
  body: {
    fontFamily: fonts.body,
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: spacing.sm,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xs,
    paddingRight: spacing.sm,
  },
  bulletDot: {
    fontFamily: fonts.body,
    color: colors.gold,
    fontSize: 14,
    lineHeight: 20,
  },
  bulletText: {
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
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.goldMuted,
    backgroundColor: colors.surfaceCard,
  },
  linkBtnText: {
    fontFamily: fonts.serif,
    color: colors.gold,
    fontSize: 14,
  },
  note: {
    fontFamily: fonts.body,
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.gold,
    width: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  secondaryBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 44,
  },
  secondaryBtnText: {
    fontFamily: fonts.body,
    color: colors.textSecondary,
    fontSize: 15,
  },
  primaryBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    minHeight: 44,
  },
  primaryBtnText: {
    fontFamily: fonts.serif,
    color: colors.gold,
    fontSize: 15,
    letterSpacing: 0.5,
  },
});
