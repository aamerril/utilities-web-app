# Hub — Personal PWA launcher

A tiny Progressive Web App that acts as a launcher for self-contained mini-tools.
Install it to your iPhone home screen and it looks/behaves like a native app —
no App Store, no rebuilds, no provisioning profiles.

## Layout

```
pwa-hub/
├── index.html              # Launcher grid
├── styles.css              # Shared styles (tools can reuse)
├── app.js                  # Loads tools.json and renders tiles
├── manifest.webmanifest    # PWA metadata (name, icons, colors)
├── sw.js                   # Service worker (offline + cache)
├── tools.json              # Registry of tiles shown on the hub
├── about.html
├── icons/                  # Add icon-192.png, icon-512.png, icon-512-maskable.png
└── tools/
    ├── _template/          # Copy this to start a new tool
    └── wordle-helper/      # Example tool
```

## Add a new tool (the Claude loop)

1. Ask Claude: *"Create a new tool under `tools/<name>/` that does X. It should be a single self-contained `index.html`."*
2. Add an entry to `tools.json`:
   ```json
   { "name": "...", "description": "...", "emoji": "🧠", "path": "./tools/<name>/" }
   ```
3. Commit & push. Your host redeploys. Pull-to-refresh on the phone.

## Run locally

Serve the folder over HTTP (service workers require it). From `pwa-hub/`:

```powershell
# Python 3
python -m http.server 8080

# or Node
npx serve .
```

Open `http://localhost:8080`.

## Deploy (pick one — all free)

### GitHub Pages
1. Push this folder to a repo (e.g. `pwa-hub` at the repo root).
2. Repo → Settings → Pages → Source: `main` branch, `/` root.
3. Visit `https://<you>.github.io/pwa-hub/`.

### Cloudflare Pages / Netlify / Vercel
- Connect the repo, set build command to *(none)*, publish directory to the folder containing `index.html`.

## Install on iPhone

1. Open the deployed URL in **Safari** (not Chrome — only Safari can install PWAs on iOS).
2. Share → **Add to Home Screen**.
3. Launch from the icon — it runs full-screen with no browser chrome.

## Icons

Drop three PNGs into `icons/`:

- `icon-192.png` (192×192)
- `icon-512.png` (512×512)
- `icon-512-maskable.png` (512×512, with ~10% safe padding)

Generate quickly: <https://realfavicongenerator.net/> or ask Claude to produce placeholder SVGs you rasterize.

## Notes / gotchas

- **iOS PWAs have limited background capability.** Fine for utilities; don't expect push reliability.
- **Storage:** use `localStorage` or `IndexedDB` per tool. iOS may evict data if the PWA is unused for weeks.
- **Updates:** the service worker uses network-first, so a refresh picks up new code. Bump `VERSION` in `sw.js` if you change the shell.
- **Cross-tool sharing:** tools can import `../../styles.css` to stay on-brand.
