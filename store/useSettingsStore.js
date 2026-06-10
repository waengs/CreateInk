import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { getInitialOllamaHost } from '../utils/ollamaHost';

const defaultHost = getInitialOllamaHost();

export const useSettingsStore = create(
  persist(
    (set) => ({
      ollamaHost: defaultHost,
      ollamaModel: 'llama3',
      autoSave: true,
      themeName: 'Ocean',
      hasSeenOllamaOnboarding: false,
      setupGuideVisible: false,

      setOllamaHost: (host) => set({ ollamaHost: host }),
      setOllamaModel: (model) => set({ ollamaModel: model }),
      setAutoSave: (autoSave) => set({ autoSave }),
      setHasSeenOllamaOnboarding: (hasSeenOllamaOnboarding) =>
        set({ hasSeenOllamaOnboarding }),
      setSetupGuideVisible: (setupGuideVisible) => set({ setupGuideVisible }),
    }),
    {
      name: 'createink-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export function getOllamaBaseUrl() {
  const host =
    useSettingsStore.getState().ollamaHost?.trim() || defaultHost || 'localhost';
  const clean = host.replace(/^https?:\/\//, '').replace(/\/$/, '').split(':')[0];
  if (!clean) return 'http://localhost:11434';
  return `http://${clean}:11434`;
}
