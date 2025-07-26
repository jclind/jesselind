import React, { useEffect, useRef } from 'react'
import styles from './Footer.module.scss'

const Footer = () => {
  const footerRef = useRef<HTMLDivElement>(null)
  const bgImageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const footer = footerRef.current
      const bg = bgImageRef.current
      if (!footer || !bg) return

      const rect = footer.getBoundingClientRect()
      const viewportHeight = window.innerHeight

      // How much of the footer is visible
      const visibleTop = Math.max(0, 0 - rect.top)
      const visibleBottom = Math.min(rect.height, viewportHeight - rect.top)
      const visibleHeight = Math.max(0, visibleBottom - visibleTop)

      // Center of visible area relative to the footer
      const centerY = visibleTop + visibleHeight / 2

      // Move image so its center lines up with centerY
      bg.style.transform = `translate(-50%, ${centerY - rect.height / 2}px)`
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleScroll)
    handleScroll() // run on mount

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <div className={styles.Footer} ref={footerRef}>
      <div className={styles.top_line}></div>
      <div className={styles.content}>
        <div className={styles.background_image} ref={bgImageRef}>
          <img src='/images/home_footer.png' alt='' />
        </div>
        <div className={styles.box_top}></div>
        <div className={styles.box_bottom}></div>
        <div className='top'></div>
        <div className={styles.bottom}>
          <div className={styles.left}>
            <a href='/mirai'>
              <div className={styles.logo}>
                <img
                  src='/images/jesselind_kanji_logo.png'
                  alt='Jesse Lind Logo'
                  draggable='false'
                />
              </div>
            </a>
          </div>
          <div className={styles.right}>
            <div className={styles.links}>
              <a href='/privacy'>Privacy</a> | <a href='/terms'>Terms</a>
            </div>
            <p
              className={styles.copyright}
            >{`©2021 - ${new Date().getUTCFullYear()} All Rights Reserved`}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
