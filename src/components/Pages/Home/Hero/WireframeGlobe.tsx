import React from 'react'
import styles from './WireframeGlobe.module.scss'

/**
 * Sized 36px against the kanji logo's 30px, which is not a mismatch. The wire
 * only reaches 52 of the 64 viewBox units, so the drawn globe is 30.3px across,
 * against ink of 31.5 x 27.5 in the logo. Matching the boxes instead left a
 * circle noticeably smaller than the glyph beside it.
 *
 * Meridians and parallels only — no landmasses. Made of the same lines and
 * curves as the rest of the hero, and costs no geo library on the homepage.
 *
 * The rotation is honest to the projection: a meridian spinning at a constant
 * rate projects to an ellipse whose rx traces R·|cos ωt|, so each one is the
 * same shrink-and-grow a quarter-period apart. The static `rx` attributes are
 * the reduced-motion fallback — without them, pausing the animation would stack
 * four identical circles.
 */
const MERIDIANS = [
  { rx: 26, delay: '0s' },
  { rx: 18, delay: '-3s' },
  { rx: 9, delay: '-6s' },
  { rx: 2, delay: '-9s' },
]

const WireframeGlobe = () => (
  <svg
    className={styles.globe}
    viewBox='0 0 64 64'
    width='36'
    height='36'
    aria-hidden='true'
    focusable='false'
  >
    <g className={styles.wire}>
      <circle cx='32' cy='32' r='26' />

      {/* Parallels: equator, plus one either side at ~35°. */}
      <ellipse cx='32' cy='32' rx='26' ry='6.5' />
      <ellipse cx='32' cy='17.5' rx='21.3' ry='5.3' />
      <ellipse cx='32' cy='46.5' rx='21.3' ry='5.3' />

      {MERIDIANS.map(m => (
        <ellipse
          key={m.rx}
          className={styles.meridian}
          cx='32'
          cy='32'
          rx={m.rx}
          ry='26'
          style={{ animationDelay: m.delay }}
        />
      ))}
    </g>
  </svg>
)

export default WireframeGlobe
