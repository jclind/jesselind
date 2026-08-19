import React, { useMemo } from 'react'
import { geoPath, type GeoProjection } from 'd3-geo'
import { feature } from 'topojson-client'
import type { GeometryCollection, Topology } from 'topojson-specification'
import type { LonLatBox } from '../../../assets/data/travel'
import styles from './Travel.module.scss'

export type GeoMapProps = {
  topology: Topology
  /** Key into `topology.objects` — 'countries' for world-atlas, 'states' for us-atlas. */
  objectKey: string
  /**
   * A factory, not a projection. d3 projections are mutated in place by
   * fitWidth, so handing one in would leave the caller holding a fitted object
   * whose scale depends on whoever rendered last.
   */
  projectionFactory: () => GeoProjection
  /** Region the projection is fitted to, which also sets the aspect ratio. */
  fitTo: GeoJSON.Polygon
  /** Ids to fill, in the order they should animate in. */
  visitedIds: string[]
  /** Ids to omit from the map entirely. */
  excludeIds?: string[]
  /**
   * Restricts an id's fill to the sub-polygons that sit inside the box. Natural
   * Earth files overseas territories under the parent country, so this is how
   * France stops painting French Guiana. The parts left out still draw in the
   * base layer, so their borders survive.
   */
  fillBounds?: Record<string, LonLatBox>
  activeId: string | null
  onActivate: (id: string | null) => void
  labelFor?: (id: string) => string
  /** Projected width in user units. Only sets the viewBox — the svg scales to its container. */
  width?: number
  /** Seconds between each fill in the entrance stagger. */
  stagger?: number
}

/** Every vertex of the ring sits inside the lon/lat box. */
const insideBox = (ring: GeoJSON.Position[], box: LonLatBox) => {
  const [minLon, minLat, maxLon, maxLat] = box
  return ring.every(
    ([lon, lat]) =>
      lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat
  )
}

const GeoMap = ({
  topology,
  objectKey,
  projectionFactory,
  fitTo,
  visitedIds,
  excludeIds = [],
  fillBounds = {},
  activeId,
  onActivate,
  labelFor,
  width = 1100,
  stagger = 0.11,
}: GeoMapProps) => {
  const { height, shapes } = useMemo(() => {
    const collection = feature(
      topology,
      topology.objects[objectKey] as GeometryCollection
    ) as unknown as GeoJSON.FeatureCollection

    const projection = projectionFactory().fitWidth(width, fitTo)
    const path = geoPath(projection)

    const bounds = path.bounds(fitTo)
    const fittedHeight = Math.ceil(bounds[1][1] - bounds[0][1])

    // Keyed by array position, not by feature id: Natural Earth leaves `id`
    // undefined on partially-recognised territories (Kosovo, Somaliland,
    // N. Cyprus), so an id-keyed map collapses them into one and drops the rest.
    const drawn: { key: string; id: string | null; d: string }[] = []
    for (const [i, f] of collection.features.entries()) {
      const id = f.id === undefined || f.id === null ? null : String(f.id)
      if (id !== null && excludeIds.includes(id)) continue

      const box = id === null ? undefined : fillBounds[id]
      if (box && f.geometry.type === 'MultiPolygon') {
        const inside: GeoJSON.Position[][][] = []
        const outside: GeoJSON.Position[][][] = []
        for (const polygon of f.geometry.coordinates) {
          ;(insideBox(polygon[0], box) ? inside : outside).push(polygon)
        }
        // Whatever the box left out becomes an anonymous base shape, so it keeps
        // its outline and just loses the fill.
        const outsideD =
          outside.length &&
          path({ type: 'MultiPolygon', coordinates: outside } as GeoJSON.Geometry)
        if (outsideD) drawn.push({ key: `${id}-outside`, id: null, d: outsideD })

        const insideD =
          inside.length &&
          path({ type: 'MultiPolygon', coordinates: inside } as GeoJSON.Geometry)
        if (insideD) drawn.push({ key: id as string, id, d: insideD })
        continue
      }

      const d = path(f)
      if (d) drawn.push({ key: id ?? `unnamed-${i}`, id, d })
    }

    return { height: fittedHeight, shapes: drawn }
  }, [
    topology,
    objectKey,
    projectionFactory,
    fitTo,
    excludeIds,
    fillBounds,
    width,
  ])

  // Visited shapes render in a second group so their fills and hover strokes sit
  // above neighbouring outlines instead of being overdrawn by them.
  const base = shapes.filter(s => s.id === null || !visitedIds.includes(s.id))
  const byId = new Map(
    shapes.flatMap(s => (s.id === null ? [] : [[s.id, s.d] as const]))
  )
  const visited = visitedIds
    .map(id => [id, byId.get(id)] as const)
    .filter((entry): entry is readonly [string, string] => Boolean(entry[1]))

  return (
    <svg
      className={styles.map}
      viewBox={`0 0 ${width} ${height}`}
      role='img'
      aria-label='World map with visited countries filled in'
    >
      <g className={styles.base}>
        {base.map(shape => (
          <path key={shape.key} d={shape.d} />
        ))}
      </g>
      <g className={styles.visited_layer}>
        {visited.map(([id, d], i) => (
          <path
            key={id}
            d={d}
            className={`${styles.visited} ${
              activeId === id ? styles.active : ''
            }`}
            style={{ animationDelay: `${i * stagger}s` }}
            onMouseEnter={() => onActivate(id)}
            onMouseLeave={() => onActivate(null)}
          >
            {labelFor && <title>{labelFor(id)}</title>}
          </path>
        ))}
      </g>
    </svg>
  )
}

export default GeoMap
