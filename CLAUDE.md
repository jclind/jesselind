# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`jesselind` — Jesse Lind's personal portfolio + notes site ("designer. developer. human."). A static Astro site with React islands, TypeScript, and Sass. Deployed from the `prod` branch (development happens on `main`).

## Commands

```bash
npm run dev          # astro dev --host (local dev server, exposed on the network)
npm run build        # astro build -> dist/
npm run preview      # serve the production build locally
npm run media -- <file> [more...]  # copy file(s) into public/media/ (see below)
npm run geo          # regenerate public/geo/countries/*.json for the travel map
```

There is no test suite, linter, or formatter configured — `package.json` only wraps the Astro CLI. TypeScript runs in Astro's `strict` mode (`tsconfig.json` extends `astro/tsconfigs/strict`).

## Architecture

**Content is data, not files.** Page content lives in typed arrays under `src/assets/data/` (`projects.ts`, `notes.ts`, `contactLinks.ts`, `legalInfo.ts`). To add/edit a project or note, edit the data file — do not hand-write a page. `legalInfo.ts` is the source of the site URL (consumed by `astro.config.mjs`), legal name, and meta description.

**Dynamic routes are generated from those arrays.** `src/pages/projects/[slug].astro` and `src/pages/files/notes/[slug].astro` use `getStaticPaths()` to map each data entry to a page. Note slugs come from `generateSlug(title)` in `src/util/pathFunctions.ts`; project slugs are the explicit `slug` field. A page renders its content through a React island (e.g. `SingleNote`, `SingleProject`), and note body text is HTML strings rendered via `dangerouslySetInnerHTML` / `set:html`.

**`src/api/firebase.ts` is a stub.** `fetchNotesFromFirebase()` is synchronous and just returns the local `notes` array — there is no live Firebase. The indirection is a placeholder; treat `notes.ts` as the real source.

**Special notes shadow the dynamic route.** A note with a `component` field (e.g. `nurture`, `building-a-computer`) is rendered by a dedicated static `.astro` page at `src/pages/files/notes/<slug>.astro` instead of the generic `[slug].astro`. Astro prioritizes static routes over dynamic ones, so the static page wins. These pages still pull their intro prose from the matching `notes.ts` entry to keep a single source of truth.

**The Jack game is a vendored Nand2Tetris simulator.** `src/lib/n2t-sim/` is the official web-ide VM/CPU/ALU/Jack-language simulator (vendored, plain `.js` + `.d.ts`). `src/components/Pages/JackGame/JackGame.astro` is a vanilla-JS island that: fetches `public/game/files.json` → fetches each `.vm` file → `VM.parse` → `Vm.buildFromFiles` → runs a `step()` loop, blitting the Hack screen memory to a `<canvas>` and mapping browser keys to Hack keycodes. To swap the game, replace the `.vm` files in `public/game/` and list them in `files.json` (entry point is `Sys.init` → `Main.main`). `STEPS_PER_FRAME` in that file is the speed knob. The game is keyboard-only and hidden on touch/small screens (a `matchMedia` check in the script mirrors the CSS media query).

**Country detail geometry is generated, not hand-written.** The world map runs on bundled 110m geometry, which is far too coarse to enlarge (Switzerland is 24 points at 110m). `npm run geo` slices 50m geometry out of `world-atlas` into `public/geo/countries/<iso>.json`, one file per country in `travelCountries`, plus a subdivision layer for any country with a `regions` field (only the US, which gets `public/geo/us-states.json` from `us-atlas`). The detail overlay fetches one file when you open a country rather than bundling ~680 KB into a 130 KB chunk. The files are committed. **Re-run `npm run geo` after editing `travel.ts`**, or a new country's detail view will 404 and show "Map unavailable".

A subdivision file holds only the *visited* shapes, for their fills, plus two `topojson.mesh` line layers: `interior` (borders between subdivisions) and `exterior` (the country's outline). Meshing is what keeps the borders one colour — drawing each state's own outline paints every shared edge twice, so whichever state came last won it and a visited/unvisited border ended up a different colour from a visited/visited one. It also means `regions.visited` in `travel.ts` decides what ends up in the file, not just what gets filled at render time, so that list is another reason to re-run the script.

The script imports `travel.ts` directly (Node 24 strips the types) and validates as it goes: every pin must fall inside the country it is listed under, every region id must match a shape, and every name on a trip route must match a place. It exits non-zero on a bad coordinate or a misspelt route name. Pins within 20km of a coastline are reported but allowed — 50m coastlines are simplified inland of the real one, so Stockholm and Hakodate sit a kilometre or two "offshore" while being perfectly correct.

**Trips are routes over the places, not a second list of them.** A country whose `visits` also carries `routes` gets a toggle in its detail panel, one entry per visit in the same order, plus `all`. Picking one draws that itinerary: the cities on it take the trip's colour and a number, an arrowed line runs between them in order, and the cities from the other trips stay on the map as dim unlabelled dots so the country still answers "where have you been here". Only Japan has routes so far.

A route is place *names*, in visit order, matched against `places`. Repeating a name is intended, since leaving Tokyo and coming home through it is a leg worth drawing, and a name can appear on both trips. Nothing is duplicated, so a coordinate is still fixed in one spot. `npm run geo` fails on a name with no place, a place on no route, or a `routes` array a different length from `visits`.

Route geometry is worked out for every trip when the country's projection is, not when a trip is picked, so the toggle only swaps two path strings. Arrowheads are drawn as path data rather than SVG markers: the route uses `non-scaling-stroke`, and a marker would keep its user-space size while the line held at 1px, so the two would come apart below full width. Short legs shrink their trim and head instead of being dropped — Tokyo to Okutama is 50km, ~17 units in a ~1068-unit frame.

**The open country and its trip live in the URL.** `/files/travel?country=<slug>&trip=<n>` opens straight into a country, and into one of its itineraries. The slug is `generateSlug(country.name)`, the same function the note routes use; `trip` is 1-based, and it is left off whenever it names the trip the country would open on anyway, so Sweden's single route stays `?country=sweden` and Japan's `all` view is the bare link. `Travel.tsx` owns both, because the address has to have one author: opening a country pushes a history entry, picking a trip rewrites the current one, and `CountryDetail` takes `trip` as a prop rather than holding it. A slug or trip number that resolves to nothing falls back and drops itself from the address bar: a bad slug rewrites to the bare path, and everything else is rewritten to `urlFor` on arrival, which also normalises `?trip=2.0` and drops a `&trip=1` that only restated the default. Without that the copy button would go on offering a link to a view that does not exist.

Arriving on a link does not land in the detail view. The world map draws first, then flies into the country, the same move a click makes. The flight is driven entirely by the `origin` rect handed to `CountryDetail`, so a deep link only has to measure `[data-country="<id>"]` off the world map once it is on screen. A link arrival also puts `.rushed` on the map wrapper, which zeroes the per-country `animation-delay` and shortens the fill to 0.28s, so the whole world is in at once rather than country by country. That is what lets `LINK_HOLD_MS` be a flat 450ms: you cannot fly out of a shape that has not appeared yet, and without the rush the wait would have to track each country's place in the stagger, which made Iceland wait 2.5x as long as the US for a reason no reader can perceive. The class is set from an effect rather than during render, because the server has no address bar and a class that differed between the two renders would be a hydration mismatch. `!important` is what it takes to beat the inline delay `GeoMap` writes. Reduced motion skips the hold, since there is no flight to wait for. The geometry is warmed at the start of the hold rather than after it.

The pending flight lives in `flightRef`, and `show` clears it, so every way of opening a country cancels it. Held inside the effect instead, a click during the hold was overruled about a second later by the country the link named, leaving the address bar and the overlay disagreeing. The index rows take the pointer for the whole 450ms, so this is one fast tap away rather than a theoretical race. `CountryDetail` has the matching guard at the other end: geometry that lands more than `FLIGHT_GRACE_MS` after the fetch started has missed the flight and gets `.late`, which fades the shape in instead. That is the cold-cache case on a phone, where nothing hovered to warm the file and `us-states.json` is 295 KB. A shape flying in from the world map a second after the panel is already on screen reads as a glitch, and appearing late is only a delay. The panel's copy button reads `window.location.href` rather than rebuilding the link, and races the clipboard against a 1.2s timer, since `writeText` can sit pending forever in a tab the window manager has not focused.

The overlay says `aria-modal`, so it behaves like one: focus moves to the close button on mount, Tab cycles inside `.overlay`, and unmounting hands focus back to whatever opened it. The focusable list is read on each keypress rather than held, because the trip toggle mounts with the geometry. Without the trap, Tab from a deep-linked country walked the nav and the index rows sitting behind a full-screen opaque panel.

**Hovering a US state names it.** The detail view raises the same tooltip the world map does, off the subdivision fills. It only covers *visited* states: the generated subdivision file holds no unvisited polygons at all, only the two border meshes, so there is nothing under the pointer to name. That matches the world map, where only filled countries answer a hover. The border and outline paths carry `pointer-events: none`. An unfilled path is still hit on its stroke, so without it, running the cursor along a state's edge would land on the border and blink the tooltip out.

**The `media/` folder is auto-listed.** `public/media/` is a drop folder for shareable files. Anything placed there serves from the site root (`public/media/x.webp` → `/media/x.webp` — that's the shareable link) and is auto-listed at `/files/media` by `src/pages/files/media.astro`, which reads the directory with `fs` at build time — no manual list editing to add a file. `npm run media -- <file>` just copies files in. To publish, commit and deploy (main → prod). Keep this in-repo only while files stay small/infrequent; large or high-volume media should move to external storage (e.g. Cloudflare R2) and the index made data-driven.

**Layout & globals.** Every page wraps content in `src/layouts/Layout.astro`, which sets meta/OG tags, loads global SCSS, mounts the Lenis smooth-scroll island (`SmoothScroll`), and injects Google Analytics via Partytown. The GA ID is hardcoded in `Layout.astro`.

## Components & styling

- Components live under `src/components/` grouped by role: `Common/` (reusable UI), `Layout/` (Navbar), `Pages/` (per-page), `Util/` (animation + scroll hooks). Most folders use the `Component.tsx` + `index.tsx` re-export pattern.
- Styling is Sass: `src/styles/global.scss` plus per-component `*.module.scss` (CSS modules). Shared SCSS values are in `_vars.scss`; values shared into TS/JS come through `_exports.module.scss` (`:export`).
- React components are Astro islands — they need a client directive (`client:load`) to be interactive.

## Notes

- `todo` (repo root) is a plain-text boilerplate setup checklist, not a task tracker for code work.
