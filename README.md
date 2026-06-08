# LoreForge

Private fanfiction and worldbuilding studio for mobile. Build characters, relationships, plot seeds, and world rules — then write stories yourself or generate scenes with a **local [Ollama](https://ollama.com)** instance.

This folder (`mobile/`) is the **complete app**. It does not depend on any files outside this directory.

## Stack

- **Expo SDK 56** + **React Native**
- **Expo Router** (file-based navigation)
- **Zustand** + **AsyncStorage** (offline-first, on-device storage)
- **React Native Paper** + custom literary dark theme (Cinzel / Lora)
- **Ollama** HTTP API for local AI generation

## Quick start

```bash
cd mobile
npm install --legacy-peer-deps
npm start
```

- Scan the QR code with **Expo Go** on your phone, or
- Press `a` for Android emulator / `i` for iOS simulator / `w` for web

> If you moved or renamed this folder, run commands from wherever `package.json` and `app.json` live.

## Ollama setup

1. Install Ollama on your PC from [ollama.com](https://ollama.com) and keep it running.

2. Pull a model:

   ```powershell
   ollama pull llama3
   ```

3. In LoreForge → **Settings** (gear on Home):
   - Tap **Test connection** — you should see a green connected state.
   - Choose your model (e.g. `llama3`).
   - **Physical phone**: use your PC’s Wi‑Fi IP (Settings can suggest one from Expo).
   - **Android emulator**: use `10.0.2.2`.
   - **Same machine / iOS simulator**: use `localhost`.

4. **Windows firewall**: allow inbound TCP **11434** on private networks if the phone cannot connect.

5. Verify on PC: open `http://localhost:11434` — you should see “Ollama is running”.

## App screens

| Tab / route | Purpose |
|-------------|---------|
| **Home** | Greeting, quick actions, latest story |
| **Characters** | Character grid, portraits, relationships graph |
| **World** | World rules and plot seeds (two tabs) |
| **Library** | Past stories — write manually or open story details |
| **GENERATE +** (FAB) | New AI generation flow (title, cast, plot, tags, rules) |
| **Generate** (hidden tab) | Same generator screen, opened from FAB or Library |
| **Settings** (hidden tab) | Ollama URL/model, auto-save, world export |

### Story flows

- **GENERATE +** → blank generator form → AI writes a new scene.
- **Continue generating** (from a saved story) → pre-fills cast/plot/tags/rules/title; existing text shows under “Your story so far”.
- **Add story → Write yourself** → manual editor with optional **Continue with AI**.

Data stays on the device (AsyncStorage). No accounts or cloud sync.

## Project layout

Everything the app needs lives under `mobile/`:

```
mobile/
├── app/                    # Expo Router screens
│   ├── _layout.js          # Root layout (Paper, fonts, stack)
│   ├── index.js            # Splash / hydration gate
│   └── (tabs)/             # Home, Characters, World, Library, Generate, Settings
├── assets/                 # App icon, favicon, LoreForge logo
├── components/             # UI (home, library, world, characters, shared)
├── constants/              # theme, fonts, greetings, relationship types
├── services/               # Ollama client, relationship PDF export
├── store/                  # Zustand stores (lore, settings, generate draft)
├── utils/                  # tags, timeAgo, graph geometry
├── app.json                # Expo config
├── app.config.js           # Expo plugins (fonts, image picker, cleartext)
├── babel.config.js
├── package.json
└── .gitignore
```

### Required assets (`assets/`)

| File | Used for |
|------|----------|
| `LoreForge_logo.png` | In-app logo |
| `icon.png` | App icon |
| `favicon.png` | Web favicon |
| `android-icon-foreground.png` | Android adaptive icon |
| `android-icon-background.png` | Android adaptive icon background |
| `android-icon-monochrome.png` | Android monochrome icon |

### Generated at runtime (do not commit; recreated by Expo)

- `node_modules/` — run `npm install` after clone
- `.expo/` — local Expo cache

## Can I delete everything outside `mobile/`?

**Yes.** The runnable app is fully self-contained in `mobile/`.

The parent folder (`LoreForge Mobile App Design/`) is a **Figma Make export** that also included a separate **web prototype** (Vite + React in `src/`). That web app is **not** used by the mobile app. No file under `mobile/` imports from the parent directory.

Safe to delete outside `mobile/` (if you only want the mobile app):

| Path (parent folder) | What it is |
|----------------------|------------|
| `src/` | Figma web prototype (Vite/React) — unused by mobile |
| `index.html`, `vite.config.ts` | Web prototype build |
| `package.json`, `pnpm-workspace.yaml` | Web prototype dependencies |
| `node_modules/` (at parent root) | Web prototype deps — not mobile’s |
| `README.md`, `ATTRIBUTIONS.md` (parent) | Figma export docs |
| `.expo/` (at parent root, if present) | Stray cache if Expo was run from wrong folder |

**Keep:** the entire `mobile/` folder (including `mobile/node_modules/` after install).

After cleanup, treat `mobile/` as your project root (open it in your editor, run `npm start` from there).

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run android` | Open on Android |
| `npm run ios` | Open on iOS |
| `npm run web` | Open in browser |

## Design reference

Original Figma design: [LoreForge Mobile App Design](https://www.figma.com/design/PLnhI6ZhKq7UKm8OIWwVuw/LoreForge-Mobile-App-Design)
