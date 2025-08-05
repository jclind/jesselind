import React, { useState } from 'react'
import styles from './Navbar.module.scss'
import { navLinks } from './navData'
import { Twirl as Hamburger } from 'hamburger-react'

interface NavbarProps {
  currentPath: string
}

const Navbar = ({ currentPath }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className={styles.navbar}>
      <div className={styles.inner}>
        <a href='/' className={styles.logo}>
          <img src='/images/logo.webp' alt='Deer Lakes Web Designs' />
        </a>
        <div className={styles.hamburger}>
          <Hamburger toggled={isOpen} toggle={setIsOpen} label='Menu' />
        </div>
        <nav className={`${styles.links} ${isOpen ? styles.open : ''}`}>
          {navLinks.map(link => (
            <a
              key={link.path}
              href={link.path}
              className={`${styles.link} ${
                currentPath === link.path ? styles.active : ''
              }`}
            >
              {link.title}
            </a>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default Navbar
