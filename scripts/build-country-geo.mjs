// Slices per-country geometry out of world-atlas at 50m and writes one GeoJSON
// Feature per visited country into public/geo/countries/, plus any subdivision
// layer a country asks for (only the US, which wants states).
//
// The world map ships 110m, which is right for a 1100px-wide world and far too
// coarse for one country filling the screen (Switzerland is 24 points at 110m,
// 187 at 50m). Bundling 50m for every country would add ~900 KB to a 130 KB
// chunk, so the detail view fetches a country's file when you open it.
//
// It also checks the data: every pin must fall inside the country it is listed
// under, every region id must match a shape, and every name on a trip route
// must match a place. A bad coordinate is otherwise invisible until you notice
// a city sitting in the sea, and a misspelt route name until you notice a leg
// missing from the itinerary.
//
// Overseas territories are left in. FILL_BOUNDS in travel.ts trims them at
// render time, so the box stays defined in exactly one place.
//
// Run: npm run geo

import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { feature, mesh } from 'topojson-client'
import { geoContains } from 'd3-geo'
import { travelCountries } from '../src/assets/data/travel.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(root, 'public/geo')

// 3 decimal places is ~110m on the ground, well under the 50m dataset's own
// resolution, and it roughly halves the file.
const PRECISION = 3

const round = coords =>
  Array.isArray(coords[0])
    ? coords.map(round)
    : coords.map(n => Number(n.toFixed(PRECISION)))

const load = (pkg, file) =>
  JSON.parse(readFileSync(join(root, 'node_modules', pkg, file), 'utf8'))

const kb = json => (json.length / 1024).toFixed(1).padStart(7)

/**
 * A point can sit just outside its country and still be correct: 50m coastlines
 * are simplified inland of the real one, so Stockholm and Hakodate land a few
 * kilometres offshore. Anything within this is coarse geometry, and the pin is
 * a pixel or two off the coast. Anything beyond it is a bad coordinate.
 */
const COAST_SLACK_KM = 20

/** Planar approximation, good to well under a kilometre at country scale. */
const toKm = ([lng, lat], lat0) => [
  lng * 111.32 * Math.cos((lat0 * Math.PI) / 180),
  lat * 110.57,
]

const distanceToEdgeKm = (geometry, lng, lat) => {
  const p = toKm([lng, lat], lat)
  const polygons =
    geometry.type === 'MultiPolygon' ? geometry.coordinates : [geometry.coordinates]
  let best = Infinity

  for (const polygon of polygons) {
    for (const ring of polygon) {
      for (let i = 0; i < ring.length - 1; i++) {
        const a = toKm(ring[i], lat)
        const b = toKm(ring[i + 1], lat)
        const dx = b[0] - a[0]
        const dy = b[1] - a[1]
        const len = dx * dx + dy * dy
        const t = len
          ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len))
          : 0
        const cx = a[0] + t * dx - p[0]
        const cy = a[1] + t * dy - p[1]
        best = Math.min(best, Math.hypot(cx, cy))
      }
    }
  }
  return best
}

rmSync(OUT, { recursive: true, force: true })
mkdirSync(join(OUT, 'countries'), { recursive: true })

const problems = []
const offshore = []

// ---- countries -------------------------------------------------------------
const world = load('world-atlas', 'countries-50m.json')
const countries = new Map(
  feature(world, world.objects.countries).features.map(f => [String(f.id), f])
)

let total = 0
for (const country of travelCountries) {
  const found = countries.get(country.id)
  if (!found) {
    problems.push(`${country.name}: no 50m shape for id '${country.id}'`)
    continue
  }

  for (const place of country.places ?? []) {
    if (geoContains(found, [place.lng, place.lat])) continue
    const km = distanceToEdgeKm(found.geometry, place.lng, place.lat)
    if (km > COAST_SLACK_KM) {
      problems.push(
        `${country.name}: '${place.name}' at ${place.lat}, ${place.lng} is ` +
          `${km.toFixed(0)} km outside it. Check the coordinate.`
      )
    } else {
      offshore.push(`${country.name}: '${place.name}' ${km.toFixed(1)} km offshore`)
    }
  }

  // Routes name places rather than repeating coordinates, so a typo would
  // otherwise drop a leg out of the itinerary with nothing to show for it.
  const names = new Set((country.places ?? []).map(place => place.name))
  const routes = country.routes ?? []
  if (routes.length && routes.length !== (country.visits ?? []).length) {
    problems.push(
      `${country.name}: ${routes.length} route(s) for ` +
        `${(country.visits ?? []).length} visit(s). One route per visit, same order.`
    )
  }
  for (const [i, route] of routes.entries()) {
    for (const name of route) {
      if (!names.has(name)) {
        problems.push(`${country.name}: route ${i + 1} names '${name}', which is not a place.`)
      }
    }
  }
  for (const name of names) {
    if (routes.length && !routes.some(route => route.includes(name))) {
      problems.push(`${country.name}: '${name}' is on no route, so it draws greyed on every trip.`)
    }
  }

  const json = JSON.stringify({
    type: 'Feature',
    id: country.id,
    properties: { name: found.properties?.name ?? country.name },
    geometry: { ...found.geometry, coordinates: round(found.geometry.coordinates) },
  })
  writeFileSync(join(OUT, 'countries', `${country.id}.json`), json)
  total += json.length
  console.log(`  ${country.id}  ${country.name.padEnd(22)} ${kb(json)} KB`)
}

// ---- subdivisions ----------------------------------------------------------
// A source hands back the topology and the object to carve up. Both the shapes
// and the borders come out of the same object, so they cannot drift apart.
const SOURCES = {
  'us-states': () => {
    const us = load('us-atlas', 'states-10m.json')
    // FIPS 60 and up are the overseas territories. geoAlbersUsa projects
    // nothing outside its own frame, so their shapes drop out at render time
    // anyway, but their arcs would still be in the border meshes.
    const states = {
      ...us.objects.states,
      geometries: us.objects.states.geometries.filter(g => Number(g.id) < 60),
    }
    return [us, states]
  },
}

for (const country of travelCountries) {
  const regions = country.regions
  if (!regions) continue

  const build = SOURCES[regions.source]
  if (!build) {
    problems.push(`${country.name}: no source registered for '${regions.source}'`)
    continue
  }

  const [topology, object] = build()
  const collection = feature(topology, object)
  const ids = new Set(collection.features.map(f => String(f.id)))
  for (const id of regions.visited) {
    if (!ids.has(id)) problems.push(`${regions.source}: no shape for id '${id}'`)
  }

  // Borders ship as meshes rather than as each subdivision's own outline. An
  // arc shared by two subdivisions appears once, so a border cannot be painted
  // twice — which is what made a visited/unvisited edge take a different colour
  // from a visited/visited one, depending on which shape happened to draw last.
  const interior = mesh(topology, object, (a, b) => a !== b)
  const exterior = mesh(topology, object, (a, b) => a === b)

  // Only the filled shapes are written out. Everything else is boundary, and
  // interior plus exterior already covers every subdivision's edges, so the
  // unvisited polygons would be 150 KB of coordinates nothing draws.
  const wanted = new Set(regions.visited)
  const features = collection.features
    .filter(f => wanted.has(String(f.id)))
    .map(f => ({
      type: 'Feature',
      id: String(f.id),
      properties: { name: f.properties?.name ?? '' },
      geometry: { ...f.geometry, coordinates: round(f.geometry.coordinates) },
    }))

  const json = JSON.stringify({
    type: 'FeatureCollection',
    features,
    interior: { ...interior, coordinates: round(interior.coordinates) },
    exterior: { ...exterior, coordinates: round(exterior.coordinates) },
  })
  writeFileSync(join(OUT, `${regions.source}.json`), json)
  total += json.length
  console.log(
    `  --   ${regions.source.padEnd(22)} ${kb(json)} KB  ` +
      `(${features.length} of ${collection.features.length} filled)`
  )
}

console.log(`\n${(total / 1024).toFixed(0)} KB total, fetched one file at a time.`)

if (offshore.length) {
  console.log(
    `\n${offshore.length} pin(s) just outside a simplified coastline, which is ` +
      'the geometry, not the data:'
  )
  for (const o of offshore) console.log(`  - ${o}`)
}

if (problems.length) {
  console.error(`\n${problems.length} problem(s) in travel.ts:`)
  for (const p of problems) console.error(`  - ${p}`)
  process.exit(1)
}
console.log(
  '\nEvery pin resolves to its country, every region id has a shape, and every ' +
    'route name has a place.'
)
