import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  geoAlbersUsa,
  geoArea,
  geoBounds,
  geoConicEqualArea,
  geoContains,
  geoPath,
  type GeoPermissibleObjects,
} from 'd3-geo'
import {
  FILL_BOUNDS,
  type TravelCountryType,
  type TravelPlaceType,
} from '../../../assets/data/travel'
import {
  loadCountry,
  loadRegions,
  restrictToBox,
  type RegionLayer,
} from './countryGeometry'
import styles from './Travel.module.scss'

/**
 * Nominal projected width. The frame is cropped to whatever the country turns
 * out to occupy, so this only fixes the working precision and the padding's
 * scale, not the shape of the view.
 */
const W = 1000
const PAD = 34

/** Matches the flight duration in the stylesheet. */
const FLIGHT_MS = 450

type Rect = { left: number; top: number; right: number; bottom: number }

/**
 * Where a label may sit relative to its dot, best first. `ax`/`ay` are the
 * fraction of the label pinned to the offset point, so ax:1 hangs it to the
 * left of the dot and ax:0 to the right.
 */
const PLACEMENTS = [
  { dx: 9, dy: 0, ax: 0, ay: 0.5 },
  { dx: -9, dy: 0, ax: 1, ay: 0.5 },
  { dx: 0, dy: -8, ax: 0.5, ay: 1 },
  { dx: 0, dy: 8, ax: 0.5, ay: 0 },
  { dx: 8, dy: -7, ax: 0, ay: 1 },
  { dx: -8, dy: -7, ax: 1, ay: 1 },
  { dx: 8, dy: 7, ax: 0, ay: 0 },
  { dx: -8, dy: 7, ax: 1, ay: 0 },
]

/** Breathing room between two labels, in pixels. */
const GAP = 4
/** Radius around a dot that a label should not cover. */
const DOT = 5

const overlap = (a: Rect, b: Rect) => {
  const w = Math.min(a.right, b.right + GAP) - Math.max(a.left, b.left - GAP)
  const h = Math.min(a.bottom, b.bottom + GAP) - Math.max(a.top, b.top - GAP)
  return w > 0 && h > 0 ? w * h : 0
}

const covers = (r: Rect, x: number, y: number) =>
  x > r.left - DOT && x < r.right + DOT && y > r.top - DOT && y < r.bottom + DOT

/** ISO numeric for the United States. */
const US = '840'

/** An island smaller than this share of the biggest one is an outlier. */
const OUTLIER = 0.02

/**
 * Drops distant specks so the frame belongs to the part of the country you'd
 * recognise. Japan's Ryukyu and Ogasawara chains reach 1,500km southwest, which
 * leaves the four main islands using about a third of the screen.
 *
 * An island is kept if it is a serious size *or* if a pin sits on it, so
 * Gotland survives on Visby's account while Okinawa, which Jesse has not been
 * to, does not.
 */
const trimOutliers = (
  geometry: GeoJSON.Geometry,
  places: TravelPlaceType[]
): GeoJSON.Geometry => {
  if (geometry.type !== 'MultiPolygon') return geometry

  const areas = geometry.coordinates.map(coordinates =>
    geoArea({ type: 'Polygon', coordinates })
  )
  const largest = Math.max(...areas)

  const kept = geometry.coordinates.filter((coordinates, i) => {
    if (areas[i] >= largest * OUTLIER) return true
    const polygon: GeoJSON.Polygon = { type: 'Polygon', coordinates }
    return places.some(place => geoContains(polygon, [place.lng, place.lat]))
  })

  return kept.length ? { type: 'MultiPolygon', coordinates: kept } : geometry
}

/**
 * A conic fitted to the country's own latitude band, which is what an atlas
 * does for a single country. Mercator would work but stretches anything far
 * from the equator: it makes Canada half again as tall as it should be and
 * turns Sweden into a ribbon.
 *
 * The US is the exception. Its geometry spans the antimeridian because of
 * Alaska, which leaves the derived bounds meaningless, so it gets the
 * projection built for exactly this problem.
 */
const projectionFor = (id: string, source: GeoPermissibleObjects) => {
  if (id === US) return geoAlbersUsa()

  const [[minLon, minLat], [maxLon, maxLat]] = geoBounds(source)
  const span = maxLat - minLat
  return geoConicEqualArea()
    .parallels([minLat + span / 6, maxLat - span / 6])
    .rotate([-(minLon + maxLon) / 2, 0])
    .center([0, (minLat + maxLat) / 2])
}

export type CountryDetailProps = {
  country: TravelCountryType
  /**
   * Where the country sits on the world map at the moment it was clicked. The
   * panel grows out of that rect, so the small shape appears to become the big
   * one. Null falls back to a plain fade.
   */
  origin: DOMRect | null
  onClose: () => void
}

const CountryDetail = ({ country, origin, onClose }: CountryDetailProps) => {
  const [geometry, setGeometry] = useState<GeoJSON.Geometry | null>(null)
  const [regions, setRegions] = useState<RegionLayer | null>(null)
  const [failed, setFailed] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const shapeRef = useRef<SVGGElement>(null)
  const pinsRef = useRef<HTMLDivElement>(null)
  const flownRef = useRef(false)

  useEffect(() => {
    let cancelled = false
    setGeometry(null)
    setRegions(null)
    setFailed(false)
    flownRef.current = false

    // A country with subdivisions draws those instead of its own outline: the
    // states already trace the border, and the two sources are different
    // resolutions, so drawing both would double the coastline slightly offset.
    const source = country.regions
    const request = source
      ? loadRegions(source.source).then(loaded => {
          if (!cancelled) setRegions(loaded)
        })
      : loadCountry(country.id).then(loaded => {
          if (!cancelled) {
            const trimmed = restrictToBox(loaded.geometry, FILL_BOUNDS[country.id])
            setGeometry(trimOutliers(trimmed, country.places ?? []))
          }
        })

    request.catch(() => {
      if (!cancelled) setFailed(true)
    })

    return () => {
      cancelled = true
    }
  }, [country.id, country.regions, country.places])

  const drawing = useMemo(() => {
    // The frame comes from the outline, not the fills: half the states are
    // unvisited, so fitting to the filled ones would crop Texas off the map.
    const source: GeoPermissibleObjects | null = regions?.exterior ?? geometry
    if (!source) return null

    const projection = projectionFor(country.id, source).fitWidth(W, source)
    const path = geoPath(projection)

    const shapes = regions
      ? regions.features.flatMap(f => {
          const d = path(f)
          // geoAlbersUsa projects nothing outside its own frame, which is how
          // Guam and Puerto Rico drop out rather than landing in the Pacific.
          return d ? [{ key: String(f.id), d }] : []
        })
      : (() => {
          const d = geometry && path(geometry)
          return d ? [{ key: country.id, d }] : []
        })()

    const borders = regions
      ? {
          interior: path(regions.interior) ?? '',
          exterior: path(regions.exterior) ?? '',
        }
      : null
    if (!shapes.length && !borders) return null

    // Crop the frame to what was drawn rather than fitting the country into a
    // fixed rectangle, so a tall country is not left as a narrow strip down the
    // middle of a wide one's frame.
    const [[x0, y0], [x1, y1]] = path.bounds(source)
    const box = {
      x: x0 - PAD,
      y: y0 - PAD,
      w: x1 - x0 + PAD * 2,
      h: y1 - y0 + PAD * 2,
    }

    const pins = (country.places ?? []).flatMap(place => {
      const point = projection([place.lng, place.lat])
      if (!point) return []
      // Percentages of the frame rather than user units, so the labels are
      // typeset in CSS alongside the rest of the page instead of scaling with
      // the drawing.
      return [
        {
          name: place.name,
          left: `${((point[0] - box.x) / box.w) * 100}%`,
          top: `${((point[1] - box.y) / box.h) * 100}%`,
        },
      ]
    })

    return { shapes, borders, pins, box, aspect: box.w / box.h }
  }, [geometry, regions, country.id, country.places])

  // The flight: put the stage where the world map's country is, then let it
  // transition back to its natural place. Measured from the drawn path, not the
  // stage, so the shape lands on the small one rather than near it.
  useLayoutEffect(() => {
    const stage = stageRef.current
    const shape = shapeRef.current
    if (!stage || !shape || !origin || flownRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const target = shape.getBoundingClientRect()
    if (!target.width || !target.height) return
    flownRef.current = true

    const box = stage.getBoundingClientRect()
    const centreX = target.left + target.width / 2
    const centreY = target.top + target.height / 2
    const scale = origin.width / target.width

    stage.style.transformOrigin = `${centreX - box.left}px ${centreY - box.top}px`
    stage.style.transition = 'none'
    stage.style.transform = `translate(${
      origin.left + origin.width / 2 - centreX
    }px, ${origin.top + origin.height / 2 - centreY}px) scale(${scale})`

    // Force the browser to take the start state as a frame of its own,
    // otherwise both writes collapse into one and nothing animates.
    void stage.offsetWidth

    stage.style.transition = ''
    stage.style.transform = ''
  }, [drawing, origin])

  // Labels are placed rather than pinned to one side. Cities cluster (Toronto
  // and Niagara Falls are 60km apart, a few pixels here), so each label takes
  // the free-est of eight positions around its dot, in the order they were
  // authored. Greedy and one pass, which is plenty for a dozen pins.
  useLayoutEffect(() => {
    const container = pinsRef.current
    if (!container) return

    const place = () => {
      const frame = container.getBoundingClientRect()
      if (!frame.width) return

      // Placement can run mid-flight, while the stage is still scaled down to
      // the size of the country on the world map. Everything measured off the
      // screen is scaled by that, so divide it out and work in the layout
      // coordinates the transforms are written in. Otherwise the pass sees
      // fourteen labels inside a few pixels and hides most of them.
      const scale = frame.width / container.offsetWidth || 1
      const width = container.offsetWidth
      const height = container.offsetHeight

      const pins = Array.from(
        container.querySelectorAll<HTMLElement>('[data-pin]')
      )
      const dots = pins.map(pin => {
        const r = pin.getBoundingClientRect()
        return { x: (r.left - frame.left) / scale, y: (r.top - frame.top) / scale }
      })

      const placed: Rect[] = []
      pins.forEach((pin, i) => {
        const label = pin.querySelector<HTMLElement>('[data-pin-label]')
        if (!label) return

        label.style.transform = ''
        const measured = label.getBoundingClientRect()
        const labelW = measured.width / scale
        const labelH = measured.height / scale
        const { x, y } = dots[i]

        let bestCost = Infinity
        let bestCollision = Infinity
        let best = PLACEMENTS[0]
        PLACEMENTS.forEach((candidate, rank) => {
          const left = x + candidate.dx - candidate.ax * labelW
          const top = y + candidate.dy - candidate.ay * labelH
          const rect = { left, top, right: left + labelW, bottom: top + labelH }

          let collision = 0
          for (const other of placed) collision += overlap(rect, other)
          dots.forEach((dot, j) => {
            if (j !== i && covers(rect, dot.x, dot.y)) collision += 400
          })

          let cost = collision
          // Running off the frame is worse than any amount of overlap.
          if (left < 0 || top < 0 || rect.right > width || rect.bottom > height) {
            cost += 1e4
          }
          // Breaks ties toward the earlier, more conventional positions.
          cost += rank

          if (cost < bestCost) {
            bestCost = cost
            bestCollision = collision
            best = candidate
          }
        })

        // The label already sits on its dot, so the transform is the offset from
        // it. Collisions are tested in frame coordinates, which is why the two
        // are worked out separately.
        const dx = best.dx - best.ax * labelW
        const dy = best.dy - best.ay * labelH
        label.style.transform = `translate(${dx}px, ${dy}px)`

        // Eight cities inside greater Toronto need more label width than the
        // region has pixels, at any frame size, so somewhere the algorithm has
        // to give up rather than stack names on top of each other. A crowded
        // label hides and its dot keeps it: hovering brings it back. Earlier
        // entries in places[] win, so the order there is the priority order.
        const crowded = bestCollision > labelW * labelH * 0.08
        label.toggleAttribute('data-crowded', crowded)
        // A hidden label occupies nothing, so the next one may use the space.
        if (crowded) return

        const left = x + dx
        const top = y + dy
        placed.push({ left, top, right: left + labelW, bottom: top + labelH })
      })
    }

    place()
    // The frame is sized off the viewport, so every pin moves on resize.
    const observer = new ResizeObserver(place)
    observer.observe(container)
    return () => observer.disconnect()
  }, [drawing])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className={styles.overlay}
      role='dialog'
      aria-modal='true'
      aria-label={country.name}
    >
      <button
        type='button'
        className={styles.close}
        onClick={onClose}
        aria-label={`Close ${country.name}`}
      >
        close
      </button>

      <div
        className={styles.stage}
        ref={stageRef}
        style={drawing ? ({ '--ar': drawing.aspect } as React.CSSProperties) : undefined}
      >
        <svg
          className={styles.detail_map}
          viewBox={
            drawing
              ? `${drawing.box.x} ${drawing.box.y} ${drawing.box.w} ${drawing.box.h}`
              : undefined
          }
          role='img'
          aria-label={`Map of ${country.name}`}
        >
          {drawing && (
            <g ref={shapeRef}>
              {/* Fills first and unstroked, then the borders over the top, so
                  every edge on the map is drawn by exactly one path. */}
              {drawing.shapes.map(shape => (
                <path
                  key={shape.key}
                  className={
                    drawing.borders ? styles.region_fill : styles.detail_shape
                  }
                  d={shape.d}
                />
              ))}
              {drawing.borders && (
                <>
                  <path className={styles.region_line} d={drawing.borders.interior} />
                  <path className={styles.outline} d={drawing.borders.exterior} />
                </>
              )}
            </g>
          )}
        </svg>

        {drawing && drawing.pins.length > 0 && (
          <div
            className={styles.pins}
            ref={pinsRef}
            style={{ animationDelay: `${FLIGHT_MS}ms` }}
          >
            {drawing.pins.map(pin => (
              <span
                key={pin.name}
                data-pin=''
                className={styles.pin}
                style={{ left: pin.left, top: pin.top }}
              >
                <span className={styles.pin_dot} />
                <span data-pin-label='' className={styles.pin_label}>
                  {pin.name}
                </span>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className={styles.panel} style={{ animationDelay: `${FLIGHT_MS * 0.6}ms` }}>
        <h2 className={styles.panel_name}>{country.name}</h2>
        {country.visits && (
          <p className={styles.panel_visits}>{country.visits.join(' · ')}</p>
        )}
        {country.notes && (
          <div
            className={styles.panel_notes}
            dangerouslySetInnerHTML={{ __html: country.notes }}
          />
        )}
        {failed && (
          <p className={styles.panel_visits}>Map unavailable. Try reloading.</p>
        )}
      </div>
    </div>
  )
}

export default CountryDetail
