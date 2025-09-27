import React, { useEffect, useRef, useState } from 'react'
import styles from './Nurture.module.scss'
import Lines from '../../Common/Lines/Lines'
// import Lines from './Lines'

const Nurture = () => {
  return (
    <div className={styles.Nurtures}>
      <Lines />
      <div className={styles.imageContainer}>
        <img src='/images/nurture/clouds.webp' alt='clouds and blue sky' />
      </div>
    </div>
  )
}

export default Nurture
