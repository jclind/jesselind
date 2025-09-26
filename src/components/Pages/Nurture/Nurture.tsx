import React, { useEffect, useRef, useState } from 'react'
import styles from './Nurture.module.scss'
import Lines from './Lines'

const Nurture = () => {
  return (
    <div className={styles.Nurtures}>
      <Lines />
    </div>
  )
}

export default Nurture
