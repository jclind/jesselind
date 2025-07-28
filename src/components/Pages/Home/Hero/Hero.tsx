import React, { useEffect } from 'react'
import styles from './Hero.module.scss'
import { ButtonLink } from '../../../Common/ButtonLink'
import scssVars from '../../../../styles/_exports.module.scss'
const Hero = () => {
  // React/JS (in a useEffect)
  useEffect(() => {
    const pageHeight = document.documentElement.scrollHeight
    const heroHeight = document.getElementById('hero')?.clientHeight || 0
    const el = document.querySelector('.page-height-line') as HTMLElement
    const displacement =
      (parseFloat(scssVars.pageLineTopDisplacement) / 100) * heroHeight
    console.log(
      'Page height:',
      pageHeight,
      'Hero height:',
      heroHeight,
      'Displacement:',
      displacement
    )
    if (el) {
      el.style.height = `${pageHeight - displacement}px`
    }
  }, [])

  return (
    <div className={`${styles.hero}`} id='hero'>
      {/* <div className={styles.content}> */}
      <h1 className={`${styles.nav_link} nav_link`}>never final</h1>

      <div className={styles.overlapping_logo}>
        <img
          src='/images/jesselind_overlapping.png'
          alt='Jesse Lind Logo'
          draggable='false'
          className={styles.logo}
        />
      </div>
      {/* </div> */}
      <div className={styles.lines}>
        <span className={styles.line1}></span>
        <span className={styles.line2}></span>
        <span className={styles.line3}></span>
        <span className={`${styles.line4} page-height-line`}></span>
        <div className={styles.arrows}>
          <span className={styles.v1}></span>
          <span className={styles.v2}></span>
          <span className={styles.v3}></span>
          <span className={styles.v4}></span>
          <span className={styles.v5}></span>
          <span className={styles.v6}></span>
        </div>
      </div>
      <div className={styles.links}>
        <a href='/notes' className={`${styles.notes} nav_link`}>
          n<br />
          o<br /> t<br /> e<br />s
        </a>
        <a href='#projects' className={`${styles.projects} nav_link`}>
          p<br />
          r<br /> o<br /> j<br /> e<br /> c<br /> t<br /> s
        </a>
        <a className={`${styles.logo} nav_link`}>
          <img
            src='/images/jesselind_kanji_logo.png'
            alt='jesse lind kanji logo'
            draggable='false'
          />
        </a>
      </div>

      {/* <div className={styles.mid_line}></div> */}
    </div>
  )
}

export default Hero
