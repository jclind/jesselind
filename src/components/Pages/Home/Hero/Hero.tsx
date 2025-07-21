import React from 'react'
import styles from './Hero.module.scss'
import { ButtonLink } from '../../../Common/ButtonLink'
const Hero = () => {
  return (
    <div className={`${styles.hero} page__horizontal-spacing-3xl`}>
      <div className='page__inner'>
        <div className={styles.content}>
          <h1 className='page-title'>This Is The Hero</h1>
          <p className='section-paragraph'>
            This is the description for the hero Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Illo, commodi.
          </p>
          <div className={styles.buttons}>
            <ButtonLink text='Get Started' link='/contact' color='primary' />
            <ButtonLink text='About Us' link='/about' color='secondary' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
