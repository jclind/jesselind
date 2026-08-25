import React, { useCallback, useEffect, useRef, useState } from 'react'
import { geoEqualEarth } from 'd3-geo'
import type { Topology } from 'topojson-specification'
import worldTopology from 'world-atlas/countries-110m.json'
import NavHeader from '../../Common/NavHeader'
import BackButton from '../../Common/BackButton'
import GeoMap from './GeoMap'
import CountryDetail from './CountryDetail'
import { loadCountry, loadRegions } from './countryGeometry'
import { generateSlug } from '../../../util/pathFunctions'
import {
  ANTARCTICA_ID,
  FILL_BOUNDS,
  WORLD_CROP,
  travelCountries,
} from '../../../assets/data/travel'
import type { TravelCountryType } from '../../../assets/data/travel'
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

/**
 * The trip a country opens on, which is also the one its URL leaves unsaid. A
 * country with a single route has nothing to toggle between, so that route is
 * simply how it draws. Everything else opens on 'all'.
 */
const defaultTrip = (country: TravelCountryType) =>
  country.routes?.length === 1 ? 0 : null

/**
 * Reads the address bar into the pair of things the overlay needs. Trips are
 * 1-based in the URL, so the second one is `trip=2` rather than `trip=1`, and
 * `trip=0` never appears looking like it means 'none'. Both parameters fall
 * back rather than failing: they come off the address bar, where anyone can
 * mistype one or link to a country that has since been renamed.
 */
const fromSearch = (search: string) => {
  const params = new URLSearchParams(search)
  const slug = params.get('country')
  const country = slug
    ? travelCountries.find(c => slugFor(c) === slug)
    : undefined
  if (!country) return { id: null, trip: null }

  const asked = Number(params.get('trip'))
  const exists =
    Number.isInteger(asked) && asked >= 1 && asked <= (country.routes?.length ?? 0)
  return { id: country.id, trip: exists ? asked - 1 : defaultTrip(country) }
}

/**
 * The address for a country at a trip. The trip is left off when it is the one
 * the country would open on anyway, which keeps Sweden at `?country=sweden` and
 * makes Japan's 'all' view the plain link rather than a state you have to spell
 * out to share.
 */
const urlFor = (country: TravelCountryType, trip: number | null) => {
  const base = `?country=${slugFor(country)}`
  return trip === null || trip === defaultTrip(country)
    ? base
    : `${base}&trip=${trip + 1}`
}

/**
 * Pulls the file the detail view will ask for, so the fetch overlaps whatever
 * happens before it opens. Branches the same way the overlay does: a country
 * with subdivisions draws those and never touches its own outline, so warming
 * the country file for the US would fetch 101 KB nobody opens and leave the
 * 302 KB of states still to come.
 */
const warm = (country: TravelCountryType) => {
  const request = country.regions
    ? loadRegions(country.regions.source)
    : loadCountry(country.id)
  request.catch(() => {})
}

/**
 * How long to hold on the world map before flying into a linked country. The
 * shape has to be on screen to fly out of, so the wait follows its place in the
 * fill-in stagger and then some of its own fade. The floor keeps the first few
 * countries from flashing past before you have seen the map at all.
 */
const holdFor = (index: number) => Math.max(600, index * STAGGER * 1000 + 300)

const Travel = () => {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [tip, setTip] = useState<Tip | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  // Which trip the open country is filtered to, null being 'all'. Kept up here
  // rather than inside the overlay because it belongs in the URL, and the URL
  // has one owner.
  const [trip, setTrip] = useState<number | null>(null)
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
    const country = travelCountries.find(c => c.id === id)
    if (country) warm(country)
  }

  const handlePointerMove = (id: string, x: number, y: number) => {
    setTip({ id, x, y, flip: x > window.innerWidth - TOOLTIP_EDGE })
  }

  // Puts a country on screen without touching history, which is what arriving
  // on a link needs: the address is already the one being shown.
  const show = useCallback((id: string, rect: DOMRect | null) => {
    setOrigin(rect)
    setSelectedId(id)
    setTip(null)
  }, [])

  const open = useCallback(
    (id: string, rect: DOMRect | null) => {
      const country = travelCountries.find(c => c.id === id)
      if (!country) return
      const first = defaultTrip(country)
      show(id, rect)
      setTrip(first)
      window.history.pushState({ country: id }, '', urlFor(country, first))
      pushedRef.current = true
    },
    [show]
  )

  /**
   * Picking a trip rewrites the current history entry instead of pushing a new
   * one. A trip is a filter on a country you are already looking at, and
   * pushing would turn the back button into a trip-undo stack you have to click
   * your way out of before you reach the map again.
   */
  const selectTrip = useCallback(
    (next: number | null) => {
      setTrip(next)
      const country = travelCountries.find(c => c.id === selectedId)
      if (!country) return
      window.history.replaceState(
        window.history.state,
        '',
        urlFor(country, next)
      )
    },
    [selectedId]
  )

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

  // Deep links: /files/travel?country=japan&trip=2 opens Japan's second
  // itinerary. The world map draws first and then flies into the country, the
  // same move a click makes. Landing straight in the detail view would be
  // quicker and would throw away the thing the page is for, which is seeing
  // where the country sits among the rest.
  useEffect(() => {
    let timer: number | undefined
    const linked = fromSearch(window.location.search)

    if (linked.id) {
      const index = travelCountries.findIndex(c => c.id === linked.id)
      // Starts now so the fetch runs under the hold instead of after it.
      warm(travelCountries[index])
      setTrip(linked.trip)

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // No flight to wait for, so the hold would be a delay that buys
        // nothing.
        show(linked.id, null)
      } else {
        timer = window.setTimeout(() => {
          const shape = document.querySelector(`[data-country="${linked.id}"]`)
          show(linked.id!, shape ? shape.getBoundingClientRect() : null)
        }, holdFor(index))
      }
    } else if (new URLSearchParams(window.location.search).has('country')) {
      // Named a country that is not on the list. Drop the parameter so the
      // address bar agrees with the world map that is actually on screen, and
      // so reloading doesn't keep trying.
      window.history.replaceState(null, '', window.location.pathname)
    }

    const onPop = () => {
      // Leaving before the hold is up cancels the flight, so a fast back button
      // is not overruled a moment later by a country opening itself.
      clearTimeout(timer)
      pushedRef.current = false
      const back = fromSearch(window.location.search)
      setOrigin(null)
      setSelectedId(back.id)
      setTrip(back.trip)
    }
    window.addEventListener('popstate', onPop)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('popstate', onPop)
    }
  }, [show])

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
          trip={trip}
          onTripChange={selectTrip}
          onClose={close}
        />
      )}
    </div>
  )
}

export default Travel
