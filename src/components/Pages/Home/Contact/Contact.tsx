import React from 'react'

import styles from './Contact.module.scss'
import { ArrowUpRight } from 'lucide-react'

const Contact = () => {
  return (
    <div className={styles.Contact}>
      <div className={styles.content}>
        <h1>let’s make something</h1>
        <div className={styles.contact_btn}>
          <span>contact</span> <ArrowUpRight strokeWidth={1} />
        </div>
      </div>
    </div>
  )
}

export default Contact
