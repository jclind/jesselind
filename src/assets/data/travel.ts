export type TravelPlaceType = {
  name: string
  lat: number
  lng: number
}

export type TravelCountryType = {
  /**
   * ISO 3166-1 numeric code, as a string — that is how world-atlas keys its
   * features (`'044'`, not `44`). Verify new ids against the atlas before
   * adding: a code with no matching shape fails silently as a missing fill.
   */
  id: string
  name: string
  /**
   * Free-form on purpose, so mixed precision coexists without a date parser:
   * 'home', '~2010', 'May 2016', 'May–Jul 2025'. Omit the field entirely for a
   * country visited on a date you don't know.
   */
  visits?: string[]
  /**
   * Per-country pins. Empty by design — the map renders country fills only.
   * Fill this in to add a pin layer without changing anything else here.
   */
  places?: TravelPlaceType[]
}

/**
 * Array order is render order: it drives the index list top-to-bottom and the
 * staggered fill-in on the map. Kept chronological by first visit, oldest
 * first, with home pinned to the top. Sorted by hand rather than at runtime —
 * `visits` holds prose like '~2010', which no date parser should be asked to
 * read. Adding a country means slotting it into the right position.
 */
export const travelCountries: TravelCountryType[] = [
  { id: '840', name: 'United States', visits: ['home'] },
  { id: '044', name: 'Bahamas', visits: ['~2010'] },
  { id: '826', name: 'United Kingdom', visits: ['May 2016'] },
  { id: '250', name: 'France', visits: ['May 2016'] },
  { id: '756', name: 'Switzerland', visits: ['May 2016'] },
  { id: '380', name: 'Italy', visits: ['May 2016'] },
  { id: '214', name: 'Dominican Republic', visits: ['Feb 2018'] },
  { id: '124', name: 'Canada', visits: ['Sep 2019'] },
  { id: '392', name: 'Japan', visits: ['May 2023', 'May–Jul 2025'] },
  { id: '704', name: 'Vietnam', visits: ['Jun 2026'] },
  { id: '752', name: 'Sweden', visits: ['Aug 2026'] },
  { id: '352', name: 'Iceland', visits: ['Aug 2026'] },
]

/** Antarctica. Cropped from the world view — see WORLD_CROP. */
export const ANTARCTICA_ID = '010'

/**
 * The world view is cropped to 60°S–84°N rather than the full sphere. Antarctica
 * is a permanent white smear across the bottom of an uncropped world map and
 * nothing above 84°N is land. Yields a ~2.26:1 frame under geoEqualEarth.
 */
export const WORLD_CROP: GeoJSON.Polygon = {
  type: 'Polygon',
  coordinates: [
    [
      [-180, -60],
      [180, -60],
      [180, 84],
      [-180, 84],
      [-180, -60],
    ],
  ],
}

/** [minLon, minLat, maxLon, maxLat] */
export type LonLatBox = [number, number, number, number]

/**
 * Natural Earth files overseas departments under the parent country, so the
 * France feature carries French Guiana on the South American coast. Restrict the
 * fill to the boxes here; anything outside still draws as an outline, so the
 * Guiana border stays intact between Suriname and Brazil.
 *
 * France is the only country on this list with a stray territory. The US
 * polygons for Alaska and Hawaii are wanted.
 */
export const FILL_BOUNDS: Record<string, LonLatBox> = {
  '250': [-6, 41, 10, 52], // metropolitan France, Corsica included
}
