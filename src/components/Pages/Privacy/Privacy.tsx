import React from 'react'
import styles from './Privacy.module.scss'

const Privacy = () => {
  const lastUpdated = 'July 31, 2025'

  return (
    <div className={`${styles.Privacy} notes-style-page`}>
      <div className={`${styles.content} notes-content`}>
        <div className='nav-header'>
          <a href='/'>jesselind</a> /{' '}
          <i>
            <a href='/privacy'>privacy</a>
          </i>
        </div>
        <div className='note-title'>Privacy Policy</div>
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
        <a href='/' className='notes-back-btn'>
          ../
        </a>
      </div>
    </div>
  )
}

export default Privacy
