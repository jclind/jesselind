import React from 'react'
import styles from './PageNotFound.module.scss'
import { ButtonLink } from '../../Common/ButtonLink'

const PageNotFound = () => {
  return (
    <div className={styles.page_not_found}>
      <div className={styles.content}>
        <div className={styles.content}>
          <h1>page not found</h1>
          <a href='/'>back</a>
        </div>
      </div>
    </div>
  )
}

export default PageNotFound
