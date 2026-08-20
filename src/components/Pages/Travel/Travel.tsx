import React, { useCallback, useEffect, useRef, useState } from 'react'
import { geoEqualEarth } from 'd3-geo'
import type { Topology } from 'topojson-specification'
import worldTopology from 'world-atlas/countries-110m.json'
import NavHeader from '../../Common/NavHeader'
import BackButton from '../../Common/BackButton'
import GeoMap from './GeoMap'
import CountryDetail from './CountryDetail'
import { loadCountry } from './countryGeometry'
import { generateSlug } from '../../../util/pathFunctions'
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

const slugFor = (country: { name: string }) => generateSlug(country.name)

const countryFromSearch = (search: string) => {
  const slug = new URLSearchParams(search).get('country')
  if (!slug) return null
  return travelCountries.find(c => slugFor(c) === slug)?.id ?? null
}

const Travel = () => {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [tip, setTip] = useState<Tip | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [origin, setOrigin] = useState<DOMRect | null>(null)
  // Whether this component put the current entry on the history stack, which
  // decides whether closing can go back or has to rewrite the URL in place.
  const pushedRef = useRef(false)

  // Only the map raises a tooltip. Hovering an index row highlights the country
  // but shows no label, since the row already reads as name and dates.
  const handleActivate = (id: string | null) => {
    setActiveId(id)
    if (id === null) {
      setTip(null)
      return
    }
    // Warms the 50m file on hover so a click has nothing to wait for. Fires for
    // index rows too, since they raise the same activation.
    loadCountry(id).catch(() => {})
  }

  const handlePointerMove = (id: string, x: number, y: number) => {
    setTip({ id, x, y, flip: x > window.innerWidth - TOOLTIP_EDGE })
  }

  const open = useCallback((id: string, rect: DOMRect | null) => {
    const country = travelCountries.find(c => c.id === id)
    if (!country) return
    setOrigin(rect)
    setSelectedId(id)
    setTip(null)
    window.history.pushState({ country: id }, '', `?country=${slugFor(country)}`)
    pushedRef.current = true
  }, [])

  const close = useCallback(() => {
    if (pushedRef.current) {
      pushedRef.current = false
      // Restores the URL and keeps the back button meaning what it looks like
      // it means, rather than leaving a dead entry behind.
      window.history.back()
      return
    }
    window.history.replaceState(null, '', window.location.pathname)
    setSelectedId(null)
  }, [])

  // Opening a row uses the shape the row refers to, so both entry points get
  // the same flight rather than a click on the map feeling different.
  const openFromRow = (id: string) => {
    const shape = document.querySelector(`[data-country="${id}"]`)
    open(id, shape ? shape.getBoundingClientRect() : null)
  }

  // Deep links: /files/travel?country=japan opens straight into Japan, with no
  // flight because there is no shape on screen to fly from yet.
  useEffect(() => {
    const fromUrl = countryFromSearch(window.location.search)
    if (fromUrl) {
      setOrigin(null)
      setSelectedId(fromUrl)
    }

    const onPop = () => {
      pushedRef.current = false
      setOrigin(null)
      setSelectedId(countryFromSearch(window.location.search))
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const tipCountry = tip && travelCountries.find(c => c.id === tip.id)
  const selected = selectedId
    ? travelCountries.find(c => c.id === selectedId)
    : undefined

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
            onSelect={open}
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
                  onClick={() => openFromRow(country.id)}
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

      {tip && tipCountry && !selected && (
        <div
          className={`${styles.tooltip} ${tip.flip ? styles.flip : ''}`}
          style={{ left: tip.x, top: tip.y }}
          aria-hidden='true'
        >
          {tipCountry.name}
          {tipCountry.visits && (
            <span className={styles.visits}>{tipCountry.visits.join(', ')}</span>
          )}
        </div>
      )}

      {selected && (
        <CountryDetail
          key={selected.id}
          country={selected}
          origin={origin}
          onClose={close}
        />
      )}
    </div>
  )
}

export default Travel
