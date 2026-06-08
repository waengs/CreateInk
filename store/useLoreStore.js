import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const WORLD_CATEGORIES = [
  'magic',
  'society',
  'geography',
  'history',
  'tech',
  'politics',
];

const emptyCharacter = () => ({
  name: '',
  age: '',
  race: '',
  personality: '',
  likes: '',
  dislikes: '',
  role: '',
  goal: '',
  flaw: '',
  secret: '',
  appearance: '',
  imageUri: null,
});

const emptyRelationship = () => ({
  charAId: '',
  charBId: '',
  dynamicAToB: '',
  dynamicBToA: '',
  sharedHistory: '',
});

const emptyPlot = () => ({
  title: '',
  logline: '',
});

const emptyWorldRule = () => ({
  name: '',
  category: WORLD_CATEGORIES[0],
  ruleText: '',
  characterIds: [],
});

export const createWorldData = (name = 'New World') => ({
  id: String(Date.now()),
  name,
  characters: [],
  relationships: [],
  plotSeeds: [],
  worldRules: [],
  storyHistory: [],
  activityLog: [],
});

const defaultWorld = createWorldData('My World');

function pushActivity(log, type, message) {
  return [
    {
      id: String(Date.now()),
      type,
      message,
      createdAt: new Date().toISOString(),
    },
    ...log.slice(0, 49),
  ];
}

function updateActiveWorld(set, get, updater) {
  const { activeWorldId, worlds } = get();
  set({
    worlds: worlds.map((w) =>
      w.id === activeWorldId ? updater(w) : w
    ),
  });
}

function migrateState(persisted) {
  if (!persisted) return { worlds: [defaultWorld], activeWorldId: defaultWorld.id };

  if (persisted.worlds?.length) {
    return {
      worlds: persisted.worlds,
      activeWorldId:
        persisted.activeWorldId &&
        persisted.worlds.some((w) => w.id === persisted.activeWorldId)
          ? persisted.activeWorldId
          : persisted.worlds[0].id,
    };
  }

  const id = String(Date.now());
  return {
    worlds: [
      {
        id,
        name: 'My World',
        characters: persisted.characters || [],
        relationships: persisted.relationships || [],
        plotSeeds: persisted.plotSeeds || [],
        worldRules: persisted.worldRules || [],
        storyHistory: persisted.storyHistory || [],
        activityLog: persisted.activityLog || [],
      },
    ],
    activeWorldId: id,
  };
}

export const useLoreStore = create(
  persist(
    (set, get) => ({
      worlds: [defaultWorld],
      activeWorldId: defaultWorld.id,

      switchWorld: (id) => {
        if (get().worlds.some((w) => w.id === id)) {
          set({ activeWorldId: id });
        }
      },

      addWorld: (name) => {
        const world = createWorldData(name || `World ${get().worlds.length + 1}`);
        set((s) => ({
          worlds: [...s.worlds, world],
          activeWorldId: world.id,
        }));
        return world.id;
      },

      renameWorld: (id, name) => {
        if (!name?.trim()) return;
        set((s) => ({
          worlds: s.worlds.map((w) =>
            w.id === id ? { ...w, name: name.trim() } : w
          ),
        }));
      },

      deleteWorld: (id) => {
        const { worlds, activeWorldId } = get();
        if (worlds.length <= 1) return false;
        const next = worlds.filter((w) => w.id !== id);
        set({
          worlds: next,
          activeWorldId:
            activeWorldId === id ? next[0].id : activeWorldId,
        });
        return true;
      },

      addCharacter: (data) =>
        updateActiveWorld(set, get, (w) => {
          const name = data.name || 'Character';
          return {
            ...w,
            characters: [
              ...w.characters,
              { id: String(Date.now()), ...emptyCharacter(), ...data },
            ],
            activityLog: pushActivity(
              w.activityLog,
              'character',
              `Added character "${name}"`
            ),
          };
        }),

      updateCharacter: (id, data) =>
        updateActiveWorld(set, get, (w) => ({
          ...w,
          characters: w.characters.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        })),

      deleteCharacter: (id) =>
        updateActiveWorld(set, get, (w) => ({
          ...w,
          characters: w.characters.filter((c) => c.id !== id),
          relationships: w.relationships.filter(
            (r) => r.charAId !== id && r.charBId !== id
          ),
        })),

      importCharactersFromWorld: (sourceWorldId, characterIds) => {
        const { worlds, activeWorldId } = get();
        if (!characterIds?.length || sourceWorldId === activeWorldId) return 0;

        const source = worlds.find((w) => w.id === sourceWorldId);
        if (!source) return 0;

        const picked = source.characters.filter((c) =>
          characterIds.includes(c.id)
        );
        if (!picked.length) return 0;

        let count = 0;
        updateActiveWorld(set, get, (w) => {
          const newChars = picked.map((c, i) => ({
            ...c,
            id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`,
          }));
          count = newChars.length;
          const names = newChars.map((c) => c.name).join(', ');
          return {
            ...w,
            characters: [...w.characters, ...newChars],
            activityLog: pushActivity(
              w.activityLog,
              'character',
              `Imported ${count} character(s) from "${source.name}": ${names}`
            ),
          };
        });
        return count;
      },

      addRelationship: (data) =>
        updateActiveWorld(set, get, (w) => ({
          ...w,
          relationships: [
            ...w.relationships,
            { id: String(Date.now()), ...emptyRelationship(), ...data },
          ],
        })),

      updateRelationship: (id, data) =>
        updateActiveWorld(set, get, (w) => ({
          ...w,
          relationships: w.relationships.map((r) =>
            r.id === id ? { ...r, ...data } : r
          ),
        })),

      deleteRelationship: (id) =>
        updateActiveWorld(set, get, (w) => ({
          ...w,
          relationships: w.relationships.filter((r) => r.id !== id),
        })),

      addPlotSeed: (data) =>
        updateActiveWorld(set, get, (w) => ({
          ...w,
          plotSeeds: [
            ...w.plotSeeds,
            { id: String(Date.now()), ...emptyPlot(), ...data },
          ],
          activityLog: pushActivity(
            w.activityLog,
            'plot',
            `Created plot "${data.title || 'Untitled'}"`
          ),
        })),

      updatePlotSeed: (id, data) =>
        updateActiveWorld(set, get, (w) => ({
          ...w,
          plotSeeds: w.plotSeeds.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        })),

      deletePlotSeed: (id) =>
        updateActiveWorld(set, get, (w) => ({
          ...w,
          plotSeeds: w.plotSeeds.filter((p) => p.id !== id),
        })),

      addWorldRule: (data) =>
        updateActiveWorld(set, get, (w) => ({
          ...w,
          worldRules: [
            ...w.worldRules,
            { id: String(Date.now()), ...emptyWorldRule(), ...data },
          ],
          activityLog: pushActivity(
            w.activityLog,
            'rule',
            `Added ${data.category || 'world'} rule`
          ),
        })),

      updateWorldRule: (id, data) =>
        updateActiveWorld(set, get, (w) => ({
          ...w,
          worldRules: w.worldRules.map((r) =>
            r.id === id ? { ...r, ...data } : r
          ),
        })),

      deleteWorldRule: (id) =>
        updateActiveWorld(set, get, (w) => ({
          ...w,
          worldRules: w.worldRules.filter((r) => r.id !== id),
        })),

      saveStory: (title, content, meta = {}) => {
        const story = {
          id: String(Date.now()),
          title,
          content,
          createdAt: new Date().toISOString(),
          ...meta,
        };
        updateActiveWorld(set, get, (w) => ({
          ...w,
          storyHistory: [story, ...w.storyHistory],
          activityLog: pushActivity(
            w.activityLog,
            'story',
            meta.manual
              ? `Added story "${title}"`
              : `Generated story "${title}"`
          ),
        }));
        return story;
      },

      updateStory: (id, data) =>
        updateActiveWorld(set, get, (w) => ({
          ...w,
          storyHistory: w.storyHistory.map((s) =>
            s.id === id ? { ...s, ...data } : s
          ),
        })),

      deleteStory: (id) =>
        updateActiveWorld(set, get, (w) => ({
          ...w,
          storyHistory: w.storyHistory.filter((s) => s.id !== id),
        })),

      exportWorld: () => {
        const w = getActiveWorld(get());
        return JSON.stringify(
          {
            name: w.name,
            characters: w.characters,
            relationships: w.relationships,
            plotSeeds: w.plotSeeds,
            worldRules: w.worldRules,
            storyHistory: w.storyHistory,
          },
          null,
          2
        );
      },

      exportAllWorlds: () => {
        const s = get();
        return JSON.stringify(
          { worlds: s.worlds, activeWorldId: s.activeWorldId },
          null,
          2
        );
      },

      importWorld: (json) => {
        const data = JSON.parse(json);
        if (data.worlds?.length) {
          set({
            worlds: data.worlds,
            activeWorldId: data.activeWorldId || data.worlds[0].id,
          });
          return;
        }
        updateActiveWorld(set, get, (w) => ({
          ...w,
          name: data.name || w.name,
          characters: data.characters || [],
          relationships: data.relationships || [],
          plotSeeds: data.plotSeeds || [],
          worldRules: data.worldRules || [],
          storyHistory: data.storyHistory || [],
          activityLog: pushActivity(w.activityLog, 'import', 'Imported world data'),
        }));
      },

      getCharacterById: (id) => {
        const w = getActiveWorld(get());
        return w?.characters.find((c) => c.id === id);
      },

      getRelationshipsForCharacters: (charIds) => {
        const ids = new Set(charIds);
        const w = getActiveWorld(get());
        return (w?.relationships || []).filter(
          (r) => ids.has(r.charAId) && ids.has(r.charBId)
        );
      },
    }),
    {
      name: 'loreforge-storage',
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persisted) => migrateState(persisted),
      version: 1,
    }
  )
);

export function getActiveWorld(state) {
  return (
    state.worlds.find((w) => w.id === state.activeWorldId) ?? state.worlds[0]
  );
}
