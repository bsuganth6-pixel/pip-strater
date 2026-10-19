# PipOS 98 — Midnight Nursery redesign

A React + Vite interpretation of the retro nursery desktop idea. It keeps Pip’s official character facts and has three showcase projects, an interactive three-scene story, day/night mode, opt-in Web Audio chimes with a mute switch, sparkle trail on fine-pointer devices, a local browser-only guestbook, a local-only visit counter, and a five-click ribbon Easter egg.

## Apply to the existing `hex-baby-starter` project

Copy the contents of this ZIP over your existing project directory (do not delete `node_modules`). Files included are `src/App.jsx`, `src/index.css`, `index.html`, `vite.config.js`, and `public/assets/pip.jpg`.

Then run:

```bash
npm install
npm run build
npm run dev -- --host 127.0.0.1 --port 5174 --strictPort
```

Open `http://127.0.0.1:5174/` on the same device.

## Deploy to Vercel

After local verification, commit and push the changed files to the `main` branch. Vercel should trigger a new deployment automatically. Build command: `npm run build`; output directory: `dist`.

## Notes

- The uploaded Pip illustration is included locally at `public/assets/pip.jpg`, so the hero works without loading a third-party image.
- Project PNGs are loaded from official haX.baby public asset URLs; CSS emoji fallbacks remain visible if these images fail.
- The guestbook and visit odometer are stored locally in the visitor's browser only. They are not a global/shared guestbook or global analytics counter.
- The sound switch starts muted and must be intentionally enabled by the visitor.
- This is an original implementation inspired by a retro portfolio OS interface; it does not copy the reference repository's source files.

## Music box

- `src/music.js` plays an original generative music-box lullaby with the Web Audio API (no audio files). It starts only after a visitor taps the ♫ button or "Play lullaby"; the speaker switch mutes it.
- `src/music.css` styles the ♫ button, the taskbar equalizer and the credits line.
