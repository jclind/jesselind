import React, { useState } from 'react'
import { geoEqualEarth } from 'd3-geo'
import type { Topology } from 'topojson-specification'
import worldTopology from 'world-atlas/countries-110m.json'
import NavHeader from '../../Common/NavHeader'
import BackButton from '../../Common/BackButton'
import GeoMap from './GeoMap'
import {
  ANTARCTICA_ID,
  FILL_BOUNDS,
  WORLD_CROP,
  travelCountries,
} from '../../../assets/data/travel'
import styles from './Travel.module.scss'

const navLinks = [
  { name: 'jesselind', src: '/' },
  { name: 'files', src: '/files' },
  { name: 'travel', src: '/files/travel' },
]

// Module scope keeps these referentially stable, so GeoMap's projection memo
// isn't invalidated on every hover.
const world = worldTopology as unknown as Topology
const worldProjection = () => geoEqualEarth()
const excluded = [ANTARCTICA_ID]
const visitedIds = travelCountries.map(country => country.id)
const STAGGER = 0.11
/** Flip the tooltip to the cursor's left inside this margin of the right edge. */
const TOOLTIP_EDGE = 220

type Tip = { id: string; x: number; y: number; flip: boolean }

const Travel = () => {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [tip, setTip] = useState<Tip | null>(null)

  // Only the map raises a tooltip. Hovering an index row highlights the country
  // but shows no label, since the row already reads as name and dates.
  const handleActivate = (id: string | null) => {
    setActiveId(id)
    if (id === null) setTip(null)
  }

  const handlePointerMove = (id: string, x: number, y: number) => {
    setTip({ id, x, y, flip: x > window.innerWidth - TOOLTIP_EDGE })
  }

  const tipCountry = tip && travelCountries.find(c => c.id === tip.id)

  return (
    <div className={`${styles.travel} notes-style-page`}>
      <div className={styles.nav_top}>
        <NavHeader links={navLinks} />
      </div>

      <div className={styles.content}>
        <div className={styles.map_wrap}>
          <GeoMap
            topology={world}
            objectKey='countries'
            projectionFactory={worldProjection}
            fitTo={WORLD_CROP}
            visitedIds={visitedIds}
            excludeIds={excluded}
            fillBounds={FILL_BOUNDS}
            activeId={activeId}
            onActivate={handleActivate}
            onPointerMove={handlePointerMove}
            stagger={STAGGER}
          />

          <ul className={styles.index}>
            {travelCountries.map((country, i) => (
              <li key={country.id}>
                <button
                  type='button'
                  className={`${styles.row} ${
                    activeId === country.id ? styles.active : ''
                  }`}
                  style={{ animationDelay: `${i * STAGGER}s` }}
                  onMouseEnter={() => handleActivate(country.id)}
                  onMouseLeave={() => handleActivate(null)}
                  onFocus={() => handleActivate(country.id)}
                  onBlur={() => handleActivate(null)}
                  onClick={() =>
                    setActiveId(activeId === country.id ? null : country.id)
                  }
                >
                  <span className={styles.name}>{country.name}</span>
                  {country.visits && (
                    <span className={styles.visits}>
                      {country.visits.join(', ')}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <BackButton />
      </div>

      {tip && tipCountry && (
        <div
          className={`${styles.tooltip} ${tip.flip ? styles.flip : ''}`}
          style={{ left: tip.x, top: tip.y }}
          aria-hidden='true'
        >
          {tipCountry.name}
          {tipCountry.visits && (
            <span className={styles.visits}>
              {tipCountry.visits.join(', ')}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default Travel
