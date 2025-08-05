import { useEffect, useRef } from 'react'
import styles from './Footer.module.scss'
import scssVars from '../../../../styles/_exports.module.scss'
import { MoveUp } from 'lucide-react'

const Footer = () => {
  const footerRef = useRef<HTMLDivElement>(null)
  const bgImageRef = useRef<HTMLDivElement>(null)

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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

      const viewportWidth = window.innerWidth

      // Center of visible area relative to the footer
      const visibleHeightMod =
        viewportWidth <= Number(scssVars.breakpointSM.replace(/\D/g, ''))
          ? visibleHeight * 0.8
          : visibleHeight
      const centerY = visibleTop + visibleHeightMod / 2

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
          <picture>
            <source
              media={`(max-width: ${scssVars.breakpointSM})`}
              srcSet='/images/home_footer_mobile.png'
            />
            <source
              media={`(min-width: ${scssVars.breakpointSM})`}
              srcSet='/images/home_footer_large.png'
            />
            <img src='/images/home_footer_large.png' alt='' />
          </picture>
        </div>
        <div className={styles.box_top}></div>
        <div className={styles.box_bottom}></div>
        <div className={styles.top}>
          <button className={styles.return_to_top} onClick={handleScrollToTop}>
            <span>return to top</span>
            <MoveUp size={16} strokeWidth={1.5} />
          </button>
        </div>
        <div className={styles.bottom}>
          <div className={styles.left}>
            <a href='/files/notes/mirai'>
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
              <a href='/files/legal/privacy-policy'>privacy</a> |{' '}
              <a href='/files/legal/terms-of-service'>terms</a>
            </div>
            <p
              className={styles.copyright}
            >{`©2021 - ${new Date().getUTCFullYear()} all rights reserved`}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
