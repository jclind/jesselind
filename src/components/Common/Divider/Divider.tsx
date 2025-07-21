import React from 'react'
import styles from './Divider.module.scss'
const Divider = ({
  space = 'regular',
  color = 'light',
}: {
  space?: 'regular' | 'medium' | 'large'
  color?: 'dark' | 'light'
}) => {
  return (
    <div
      className={`${styles.divider} ${styles[space]} ${styles[color]}`}
    ></div>
  )
}

export default Divider
