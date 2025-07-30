import React from 'react'
import styles from './ContactHero.module.scss'

const ContactHero = () => {
  const links = [
    { text: 'email', src: '' },
    { text: 'instagram', src: '' },
    { text: 'photography', src: '' },
    { text: 'coffee', src: '' },
    { text: 'linkedin', src: '' },
    { text: 'github', src: '' },
    { text: 'back', src: '/' },
  ]
  return (
    <div className={styles.ContactHero}>
      <div className={styles.content}>
        <div className={styles.diagonal_links}>
          {links.map(link => (
            <a href={link.src} key={link.text}>
              {link.text}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ContactHero
