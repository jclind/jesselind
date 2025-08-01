import React from 'react'
import styles from './ContactHero.module.scss'
import { contactLinks } from '../../../../assets/data/contactLinks'

const ContactHero = () => {
  return (
    <div className={styles.ContactHero}>
      <div className={styles.content}>
        <div className={styles.diagonal_links}>
          {contactLinks.map(link => (
            <a
              href={link.src}
              key={link.text}
              target={`${link.src !== '/' ? '_blank' : ''}`}
              rel='noopener noreferrer'
            >
              {link.text}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ContactHero
