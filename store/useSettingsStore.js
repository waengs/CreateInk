import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Platform } from 'react-native';

const defaultHost =
  Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const useSettingsStore = create(
  persist(
    (set) => ({
      ollamaHost: defaultHost,
      ollamaModel: 'llama3',
      autoSave: true,
      themeName: 'Ocean',

      setOllamaHost: (host) => set({ ollamaHost: host }),
      setOllamaModel: (model) => set({ ollamaModel: model }),
      setAutoSave: (autoSave) => set({ autoSave }),
    }),
    {
      name: 'loreforge-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export function getOllamaBaseUrl() {
  const host = useSettingsStore.getState().ollamaHost || defaultHost;
  return `http://${host.replace(/^https?:\/\//, '').replace(/\/$/, '')}:11434`;
}
