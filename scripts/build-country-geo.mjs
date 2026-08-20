// Slices per-country geometry out of world-atlas at 50m and writes one GeoJSON
// Feature per visited country into public/geo/countries/.
//
// The world map ships 110m, which is right for a 1100px-wide world and far too
// coarse for one country filling the screen (Switzerland is 24 points at 110m,
// 187 at 50m). Bundling 50m for every country would add ~900 KB to a 130 KB
// chunk, so the detail view fetches a country's file when you open it.
//
// Overseas territories are left in. FILL_BOUNDS in travel.ts trims them at
// render time, so the box stays defined in exactly one place.
//
// Run: npm run geo

import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { feature } from 'topojson-client'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = join(root, 'public/geo/countries')
const DATA = join(root, 'src/assets/data/travel.ts')

// 3 decimal places is ~110m on the ground, well under the 50m dataset's own
// resolution, and it roughly halves the file.
const PRECISION = 3

const round = coords =>
  Array.isArray(coords[0])
    ? coords.map(round)
    : coords.map(n => Number(n.toFixed(PRECISION)))

const ids = [...readFileSync(DATA, 'utf8').matchAll(/^\s*\{\s*id:\s*'(\d+)'/gm)].map(
  m => m[1]
)
if (!ids.length) {
  throw new Error(`No country ids found in ${DATA}. Did the data shape change?`)
}

const topology = JSON.parse(
  readFileSync(join(root, 'node_modules/world-atlas/countries-50m.json'), 'utf8')
)
const collection = feature(topology, topology.objects.countries)
const byId = new Map(collection.features.map(f => [String(f.id), f]))

rmSync(OUT_DIR, { recursive: true, force: true })
mkdirSync(OUT_DIR, { recursive: true })

let total = 0
for (const id of ids) {
  const found = byId.get(id)
  if (!found) throw new Error(`No 50m feature for id '${id}'.`)

  const out = {
    type: 'Feature',
    id,
    properties: { name: found.properties?.name ?? '' },
    geometry: { ...found.geometry, coordinates: round(found.geometry.coordinates) },
  }
  const json = JSON.stringify(out)
  writeFileSync(join(OUT_DIR, `${id}.json`), json)
  total += json.length
  console.log(
    `  ${id}  ${(out.properties.name || '').padEnd(26)} ${(json.length / 1024)
      .toFixed(1)
      .padStart(7)} KB`
  )
}

console.log(
  `\n${ids.length} countries, ${(total / 1024).toFixed(0)} KB total (fetched one at a time).`
)
