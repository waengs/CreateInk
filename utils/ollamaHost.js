import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

function stripHost(value) {
  if (!value) return '';
  return value
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '')
    .split(':')[0]
    .trim();
}

/** Optional default from .env at build time (APK or dev) */
export function getEnvOllamaHost() {
  return stripHost(process.env.EXPO_PUBLIC_OLLAMA_HOST);
}

/** PC IP from Expo Go / dev client (not available in standalone APK) */
export function getExpoDevHost() {
  const debuggerHost =
    Constants.expoGoConfig?.debuggerHost ??
    Constants.expoConfig?.hostUri?.replace(/^exp:\/\//, '');
  if (!debuggerHost) return '';
  const ip = debuggerHost.split(':')[0];
  if (!ip || ip === 'localhost' || ip === '127.0.0.1') return '';
  return ip;
}

/** Best one-tap host: .env IP, then Expo dev IP */
export function getSuggestedOllamaHost() {
  return getEnvOllamaHost() || getExpoDevHost() || '';
}

export function isAndroidEmulator() {
  return Platform.OS === 'android' && Device.isDevice === false;
}

export function isPhysicalPhone() {
  return Device.isDevice === true && Platform.OS !== 'web';
}

export function getInitialOllamaHost() {
  const suggested = getSuggestedOllamaHost();
  if (suggested) return suggested;

  if (isAndroidEmulator()) return '10.0.2.2';

  if (Platform.OS === 'web' || Platform.OS === 'ios') {
    return 'localhost';
  }

  // Physical Android APK: no safe default — user enters PC LAN IP
  return '';
}

export function getDefaultHostHint() {
  if (isAndroidEmulator()) {
    return '10.0.2.2 (emulator) or your PC LAN IP';
  }
  if (Platform.OS === 'android' && isPhysicalPhone()) {
    const suggested = getSuggestedOllamaHost();
    return suggested
      ? `${suggested} (from config) or your PC LAN IP`
      : 'Your PC LAN IP, e.g. 192.168.1.4';
  }
  if (Platform.OS === 'ios') {
    const suggested = getSuggestedOllamaHost();
    return suggested
      ? `${suggested} (device) or localhost (simulator)`
      : 'localhost (simulator) or your PC LAN IP';
  }
  return 'localhost';
}

export function shouldShowLocalhostChip() {
  if (Platform.OS === 'web') return true;
  if (Platform.OS === 'ios' && !isPhysicalPhone()) return true;
  if (isAndroidEmulator()) return true;
  return false;
}

export function isEmulatorOnlyHost(host) {
  const h = stripHost(host);
  return h === '10.0.2.2' || h === 'localhost' || h === '127.0.0.1';
}
