import { create } from 'zustand';

export const useGenerateDraftStore = create((set) => ({
  draft: null,
  freshSession: false,
  setDraft: (draft) => set({ draft, freshSession: false }),
  clearDraft: () => set({ draft: null }),
  requestFreshGenerate: () => set({ freshSession: true, draft: null }),
  consumeFreshSession: () => set({ freshSession: false }),
}));
