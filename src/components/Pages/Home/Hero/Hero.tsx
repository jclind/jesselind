import React from 'react'
import styles from './Hero.module.scss'
import { ButtonLink } from '../../../Common/ButtonLink'
const Hero = () => {
  return (
    <div className={`${styles.hero} page__horizontal-spacing-3xl`}>
      <div className='page__inner'>
        <div className={styles.content}>
          <div className='never_final'>never final</div>
          <div className={styles.overlapping_logo}>
            <img
              src='/images/jesselind_overlapping.png'
              alt='Jesse Lind Logo'
              className={styles.logo}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
