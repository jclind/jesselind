import React from 'react'
import styles from './Privacy.module.scss'
import NavHeader from '../../Common/NavHeader'
import { NAV_LINKS_LEGAL } from '../../../util/NAV_VARS'
import BackButton from '../../Common/BackButton'

const Privacy = () => {
  const lastUpdated = 'July 31, 2025'

  const navLinks = [
    ...NAV_LINKS_LEGAL,
    { name: 'privacy-policy.txt', src: '#' },
  ]

  return (
    <div className={`${styles.Privacy} notes-style-page`}>
      <div className={`${styles.content} notes-content`}>
        <NavHeader links={navLinks} />
        <div className='note-title'>privacy policy</div>
        <p className='note-last-updated'>Last updated: [{lastUpdated}]</p>

        <div className='note-text'>
          <p>
            This website uses Google Analytics to help understand user
            interaction and improve the site experience. Google Analytics may
            collect information such as your IP address, browser type, device,
            and pages visited. This data is anonymized and used only for
            analytics purposes.
          </p>

          <p>
            The site is hosted on Netlify, which may log basic technical
            information like IP address and access times for security and
            performance monitoring.
          </p>

          <p>
            We do not collect, store, or share any personally identifiable
            information directly through this site.
          </p>

          <p>
            By using this site, you consent to the processing of data by Google
            as described in{' '}
            <a
              href='https://policies.google.com/technologies/partner-sites'
              target='_blank'
              rel='noopener noreferrer'
            >
              Google’s Privacy Policy
            </a>
            .
          </p>
        </div>
        <BackButton />
      </div>
    </div>
  )
}

export default Privacy
