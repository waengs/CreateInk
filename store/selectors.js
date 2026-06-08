import { getActiveWorld, useLoreStore } from './useLoreStore';

export const selectActiveWorld = (s) => getActiveWorld(s);
export const selectWorlds = (s) => s.worlds;
export const selectWorldCount = (s) => s.worlds.length;
export const selectCharacters = (s) => getActiveWorld(s)?.characters ?? [];
export const selectRelationships = (s) => getActiveWorld(s)?.relationships ?? [];
export const selectPlotSeeds = (s) => getActiveWorld(s)?.plotSeeds ?? [];
export const selectWorldRules = (s) => getActiveWorld(s)?.worldRules ?? [];
export const selectActivityLog = (s) => getActiveWorld(s)?.activityLog ?? [];
export const selectStoryHistory = (s) => getActiveWorld(s)?.storyHistory ?? [];
export const selectActiveWorldName = (s) => getActiveWorld(s)?.name ?? 'World';

export function useActiveWorldName() {
  return useLoreStore(selectActiveWorldName);
}

export function useWorldCount() {
  return useLoreStore(selectWorldCount);
}
