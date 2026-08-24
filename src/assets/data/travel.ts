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
   * One itinerary per entry in `visits`, in the same order, which is what turns
   * the detail view's trip toggle on. Each is place names in the order they
   * were visited, matched against `places` by exact name. A name may repeat:
   * flying home through Tokyo is a leg worth drawing. `npm run geo` fails if a
   * name has no place or if the two arrays are different lengths, so they
   * cannot drift apart. Leave the field off and the country draws the way it
   * always has, every pin at once and no route.
   */
  routes?: string[][]
  /**
   * Cities pinned on the country's detail view. The world map ignores these.
   * Coordinates are decimal degrees, positive north and east.
   */
  places?: TravelPlaceType[]
  /**
   * Optional prose for the detail view, rendered as HTML the way note bodies
   * are. Leave it out and the panel just shows the name, dates and cities.
   */
  notes?: string
  /**
   * A subdivision layer for the detail view. Only the US has one: without it a
   * country draws as a single outline.
   */
  regions?: TravelRegionsType
}

export type TravelRegionsType = {
  /** Basename of a generated file in public/geo/, no extension. */
  source: string
  /** Subdivision ids to fill, keyed the way that file keys them. */
  visited: string[]
}

/**
 * Visited US states by FIPS code, as strings — us-atlas keys them that way and
 * Colorado is '08', not 8. Taken from the atlas by name rather than typed out,
 * so a code with no matching shape can't slip in.
 */
export const US_STATES = [
  '42', // Pennsylvania — home
  '23', // Maine
  '12', // Florida
  '36', // New York
  '39', // Ohio
  '37', // North Carolina
  '45', // South Carolina
  '26', // Michigan
  '33', // New Hampshire
  '51', // Virginia
  '24', // Maryland
  '54', // West Virginia
  '21', // Kentucky
  '18', // Indiana
  '19', // Iowa
  '17', // Illinois
  '31', // Nebraska
  '46', // South Dakota
  '30', // Montana
  '56', // Wyoming
  '16', // Idaho
  '49', // Utah
  '08', // Colorado
  '53', // Washington
  '41', // Oregon
  '06', // California
]

/**
 * Array order is render order: it drives the index list top-to-bottom and the
 * staggered fill-in on the map. Kept chronological by first visit, oldest
 * first, with home pinned to the top. Sorted by hand rather than at runtime —
 * `visits` holds prose like '~2010', which no date parser should be asked to
 * read. Adding a country means slotting it into the right position.
 */
export const travelCountries: TravelCountryType[] = [
  {
    id: '840',
    name: 'United States',
    visits: ['home'],
    regions: { source: 'us-states', visited: US_STATES },
  },
  { id: '044', name: 'Bahamas', visits: ['~2010'] },
  {
    id: '826',
    name: 'United Kingdom',
    visits: ['May 2016'],
    places: [{ name: 'London', lat: 51.5074, lng: -0.1278 }],
  },
  {
    id: '250',
    name: 'France',
    visits: ['May 2016'],
    places: [{ name: 'Paris', lat: 48.8566, lng: 2.3522 }],
  },
  {
    id: '756',
    name: 'Switzerland',
    visits: ['May 2016'],
    places: [
      { name: 'Geneva', lat: 46.2044, lng: 6.1432 },
      { name: 'Interlaken', lat: 46.6863, lng: 7.8632 },
    ],
  },
  {
    id: '380',
    name: 'Italy',
    visits: ['May 2016'],
    places: [
      { name: 'Rome', lat: 41.9028, lng: 12.4964 },
      { name: 'Florence', lat: 43.7696, lng: 11.2558 },
    ],
  },
  {
    id: '214',
    name: 'Dominican Republic',
    visits: ['Feb 2018'],
    places: [
      { name: 'Santo Domingo', lat: 18.4861, lng: -69.9312 },
      { name: 'Hato Mayor del Rey', lat: 18.7627, lng: -69.2568 },
    ],
  },
  {
    id: '124',
    name: 'Canada',
    visits: ['Sep 2019'],
    places: [
      { name: 'Toronto', lat: 43.6532, lng: -79.3832 },
      { name: 'Niagara Falls', lat: 43.0896, lng: -79.0849 },
    ],
  },
  {
    id: '392',
    name: 'Japan',
    visits: ['May 2023', 'May–Jul 2025'],
    // TODO(jesse): both orders are a guess. The first is the classic
    // Tokyo/Kansai loop, the second is everything else. Rewrite them to what
    // actually happened. The route on the map is drawn from these arrays alone,
    // so nothing else needs touching.
    routes: [
      ['Tokyo', 'Mount Fuji', 'Kyoto', 'Osaka', 'Tokyo'],
      [
        'Tokyo',
        'Okutama',
        'Yokohama',
        'Nagoya',
        'Nagano',
        'Mount Togakushi',
        'Nikko',
        'Fukuoka',
        'Nagasaki',
        'Hakodate',
        'Sapporo',
        'Tokyo',
      ],
    ],
    places: [
      { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
      { name: 'Sapporo', lat: 43.0618, lng: 141.3545 },
      { name: 'Hakodate', lat: 41.7688, lng: 140.7288 },
      { name: 'Osaka', lat: 34.6937, lng: 135.5023 },
      { name: 'Kyoto', lat: 35.0116, lng: 135.7681 },
      { name: 'Fukuoka', lat: 33.5904, lng: 130.4017 },
      { name: 'Nagasaki', lat: 32.7503, lng: 129.8779 },
      { name: 'Nagoya', lat: 35.1815, lng: 136.9066 },
      { name: 'Mount Fuji', lat: 35.3606, lng: 138.7274 },
      { name: 'Nikko', lat: 36.7198, lng: 139.6982 },
      { name: 'Mount Togakushi', lat: 36.7594, lng: 138.0756 },
      { name: 'Nagano', lat: 36.6513, lng: 138.181 },
      { name: 'Okutama', lat: 35.8094, lng: 139.0966 },
      { name: 'Yokohama', lat: 35.4437, lng: 139.638 },
    ],
  },
  {
    id: '704',
    name: 'Vietnam',
    visits: ['Jun 2026'],
    places: [
      { name: 'Ha Noi', lat: 21.0278, lng: 105.8342 },
      { name: 'Ho Chi Minh City', lat: 10.8231, lng: 106.6297 },
      { name: 'Ninh Binh', lat: 20.2506, lng: 105.9744 },
      { name: 'Ha Giang', lat: 22.8233, lng: 104.9784 },
    ],
  },
  {
    id: '752',
    name: 'Sweden',
    visits: ['Aug 2026'],
    places: [
      { name: 'Stockholm', lat: 59.3293, lng: 18.0686 },
      { name: 'Visby', lat: 57.6348, lng: 18.2948 },
      { name: 'Nynäshamn', lat: 58.9027, lng: 17.9469 },
    ],
  },
  {
    id: '352',
    name: 'Iceland',
    visits: ['Aug 2026'],
    places: [{ name: 'Reykjavik', lat: 64.1466, lng: -21.9426 }],
  },
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
