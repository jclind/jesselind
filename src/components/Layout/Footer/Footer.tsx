import React from 'react'
import styles from './Footer.module.scss'
import { links } from './links'
import Divider from '../../Common/Divider'
import { contactInfo } from './contactInfo'
import { LEGAL_NAME } from '../../../assets/data/legalInfo'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className='page__inner'>
        <div className={styles.top_container}>
          <div className={styles.links__container}>
            <div className={styles.image}>
              <img src='/images/logo.webp' alt='Deer Lakes Web Design Icon' />
            </div>
            <div className={styles.links}>
              {links.map(link => (
                <div className={styles.link}>
                  <a href={link.path}>{link.title}</a>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.divider_container}>
            <Divider space='large' />
          </div>
          <div className={styles.contact_info}>
            {contactInfo.map(item => (
              <div className={styles.item}>
                <div className={styles.icon__container}>
                  <item.icon className={styles.icon} />
                </div>
                <span
                  style={{
                    color: 'inherit',
                    textDecoration: 'none',
                    WebkitTextFillColor: 'inherit',
                  }}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
        <Divider space='large' />
        <div className={styles.copyright}>
          <div className={styles.text}>
            {`© Copyright ${new Date().getFullYear()} ${LEGAL_NAME}`} | Website
            By{' '}
            <a href='https://deerlakeswebdesigns.com/'>Deer Lakes Web Design</a>
          </div>
          <div className={styles.legal}>
            <a href='/terms-of-service'>Terms</a>
            <span>|</span>
            <a href='/privacy-policy'>Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
