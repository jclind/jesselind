import React from 'react'
import styles from './Terms.module.scss'
import NavHeader from '../../Common/NavHeader'
import { NAV_LINKS_LEGAL } from '../../../util/NAV_VARS'

const Terms = () => {
  const lastUpdated = 'July 31, 2025'

  const navLinks = [...NAV_LINKS_LEGAL, { name: 'terms', src: '#' }]

  return (
    <div className={`${styles.Terms} notes-style-page`}>
      <div className={`${styles.content} notes-content`}>
        <NavHeader links={navLinks} />
        <div className='note-title'>terms of service</div>
        <p className='note-last-updated'>Last updated: [{lastUpdated}]</p>

        <div className='note-text'>
          <p>
            This website is provided for informational purposes only. By
            accessing and using this site, you agree to use it responsibly and
            at your own risk.
          </p>

          <p>
            All content is subject to change without notice. We make no
            guarantees about the accuracy or reliability of the content
            provided.
          </p>

          <p>
            We are not liable for any damages resulting from the use of this
            website.
          </p>
        </div>
        <a href='/' className='notes-back-btn'>
          ../
        </a>
      </div>
    </div>
  )
}

export default Terms
