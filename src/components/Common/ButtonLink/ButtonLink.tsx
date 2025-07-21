import React from 'react'
import styles from './ButtonLink.module.scss'

const ButtonLink = ({
  text,
  link,
  color = 'primary',
  size = 'medium',
}: {
  text: string
  link: string
  color?: 'primary' | 'secondary' | 'tertiary' | 'white'
  size?: 'small' | 'medium' | 'large' | 'full_width'
}) => {
  return (
    <a
      href={link}
      className={`${styles.button_link} ${styles[color]} ${styles[size]} button`}
    >
      {text}
    </a>
  )
}

export default ButtonLink
