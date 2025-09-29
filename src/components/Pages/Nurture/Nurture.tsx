import React, { useEffect, useRef, useState } from 'react'
import styles from './Nurture.module.scss'
import Lines from '../../Common/Lines/Lines'
// import Lines from './Lines'

const Nurture = () => {
  return (
    <div className={styles.Nurtures}>
      <Lines />
      {/* <div className={styles.imageContainer}>
        <img src='/images/nurture/clouds.webp' alt='clouds and blue sky' />
      </div> */}
      <div className={styles.cloudImages}>
        <img src='/images/nurture/clouds1.webp' alt='clouds and blue sky' />
        <img src='/images/nurture/clouds2.webp' alt='clouds and blue sky' />
        <img src='/images/nurture/clouds3.webp' alt='clouds and blue sky' />
        <img src='/images/nurture/clouds4.webp' alt='clouds and blue sky' />
        <img src='/images/nurture/clouds5.webp' alt='clouds and blue sky' />
        <img src='/images/nurture/clouds6.webp' alt='clouds and blue sky' />
        <img src='/images/nurture/clouds7.webp' alt='clouds and blue sky' />
        <img src='/images/nurture/clouds8.webp' alt='clouds and blue sky' />
        <img src='/images/nurture/clouds9.webp' alt='clouds and blue sky' />
        <img src='/images/nurture/clouds10.webp' alt='clouds and blue sky' />
      </div>
    </div>
  )
}

export default Nurture
