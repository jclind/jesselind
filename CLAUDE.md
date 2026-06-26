# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`jesselind` — Jesse Lind's personal portfolio + notes site ("designer. developer. human."). A static Astro site with React islands, TypeScript, and Sass. Deployed from the `prod` branch (development happens on `main`).

## Commands

```bash
npm run dev      # astro dev --host (local dev server, exposed on the network)
npm run build    # astro build -> dist/
npm run preview  # serve the production build locally
```

There is no test suite, linter, or formatter configured — `package.json` only wraps the Astro CLI. TypeScript runs in Astro's `strict` mode (`tsconfig.json` extends `astro/tsconfigs/strict`).

## Architecture

**Content is data, not files.** Page content lives in typed arrays under `src/assets/data/` (`projects.ts`, `notes.ts`, `contactLinks.ts`, `legalInfo.ts`). To add/edit a project or note, edit the data file — do not hand-write a page. `legalInfo.ts` is the source of the site URL (consumed by `astro.config.mjs`), legal name, and meta description.

**Dynamic routes are generated from those arrays.** `src/pages/projects/[slug].astro` and `src/pages/files/notes/[slug].astro` use `getStaticPaths()` to map each data entry to a page. Note slugs come from `generateSlug(title)` in `src/util/pathFunctions.ts`; project slugs are the explicit `slug` field. A page renders its content through a React island (e.g. `SingleNote`, `SingleProject`), and note body text is HTML strings rendered via `dangerouslySetInnerHTML` / `set:html`.

**`src/api/firebase.ts` is a stub.** `fetchNotesFromFirebase()` is synchronous and just returns the local `notes` array — there is no live Firebase. The indirection is a placeholder; treat `notes.ts` as the real source.

**Special notes shadow the dynamic route.** A note with a `component` field (e.g. `nurture`, `building-a-computer`) is rendered by a dedicated static `.astro` page at `src/pages/files/notes/<slug>.astro` instead of the generic `[slug].astro`. Astro prioritizes static routes over dynamic ones, so the static page wins. These pages still pull their intro prose from the matching `notes.ts` entry to keep a single source of truth.

**The Jack game is a vendored Nand2Tetris simulator.** `src/lib/n2t-sim/` is the official web-ide VM/CPU/ALU/Jack-language simulator (vendored, plain `.js` + `.d.ts`). `src/components/Pages/JackGame/JackGame.astro` is a vanilla-JS island that: fetches `public/game/files.json` → fetches each `.vm` file → `VM.parse` → `Vm.buildFromFiles` → runs a `step()` loop, blitting the Hack screen memory to a `<canvas>` and mapping browser keys to Hack keycodes. To swap the game, replace the `.vm` files in `public/game/` and list them in `files.json` (entry point is `Sys.init` → `Main.main`). `STEPS_PER_FRAME` in that file is the speed knob. The game is keyboard-only and hidden on touch/small screens (a `matchMedia` check in the script mirrors the CSS media query).

**Layout & globals.** Every page wraps content in `src/layouts/Layout.astro`, which sets meta/OG tags, loads global SCSS, mounts the Lenis smooth-scroll island (`SmoothScroll`), and injects Google Analytics via Partytown. The GA ID is hardcoded in `Layout.astro`.

## Components & styling

- Components live under `src/components/` grouped by role: `Common/` (reusable UI), `Layout/` (Navbar), `Pages/` (per-page), `Util/` (animation + scroll hooks). Most folders use the `Component.tsx` + `index.tsx` re-export pattern.
- Styling is Sass: `src/styles/global.scss` plus per-component `*.module.scss` (CSS modules). Shared SCSS values are in `_vars.scss`; values shared into TS/JS come through `_exports.module.scss` (`:export`).
- React components are Astro islands — they need a client directive (`client:load`) to be interactive.

## Notes

- `todo` (repo root) is a plain-text boilerplate setup checklist, not a task tracker for code work.
