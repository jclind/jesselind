import React from 'react'
import styles from './PageNotFound.module.scss'
import { ButtonLink } from '../../Common/ButtonLink'

const PageNotFound = () => {
  return (
    <div className={styles.page_not_found}>
      <div className='page__inner'>
        <div className={styles.container}>
          <div className={styles.image}>
            <img src='/images/page_not_found.svg' alt='Page Not Found' />
          </div>

          <div className={styles.content}>
            <h1>Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <ButtonLink link='/' text='&larr; Back Home' size='large' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageNotFound
