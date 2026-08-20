import type { LonLatBox } from '../../../assets/data/travel'

/**
 * Detail geometry, sliced to 50m by `npm run geo` and fetched when a country
 * opens rather than bundled: all twelve come to ~384 KB against a 130 KB page
 * chunk, and you only ever look at one.
 */
const cache = new Map<string, Promise<GeoJSON.Feature>>()

export const loadCountry = (id: string) => {
  const hit = cache.get(id)
  if (hit) return hit

  const request = fetch(`/geo/countries/${id}.json`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`No detail geometry for country ${id}`)
      }
      return response.json() as Promise<GeoJSON.Feature>
    })
    // A rejected promise would otherwise sit in the cache forever, so one
    // dropped request would break that country for the rest of the session.
    .catch(error => {
      cache.delete(id)
      throw error
    })

  cache.set(id, request)
  return request
}

/** Every vertex of the ring sits inside the lon/lat box. */
export const insideBox = (ring: GeoJSON.Position[], box: LonLatBox) => {
  const [minLon, minLat, maxLon, maxLat] = box
  return ring.every(
    ([lon, lat]) =>
      lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat
  )
}

/**
 * Drops the sub-polygons that fall outside the box. The detail view fits its
 * projection to whatever it is handed, so leaving French Guiana in would shrink
 * metropolitan France to a speck in the corner.
 */
export const restrictToBox = (
  geometry: GeoJSON.Geometry,
  box: LonLatBox | undefined
): GeoJSON.Geometry => {
  if (!box || geometry.type !== 'MultiPolygon') return geometry
  const kept = geometry.coordinates.filter(polygon => insideBox(polygon[0], box))
  return kept.length ? { type: 'MultiPolygon', coordinates: kept } : geometry
}
