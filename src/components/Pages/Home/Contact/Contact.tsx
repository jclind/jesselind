import React from 'react'

import styles from './Contact.module.scss'
import { ArrowUpRight } from 'lucide-react'
import {
  splitTextToSpans,
  useTextAnimation,
} from '../../../Util/useTextAnimation'

const Contact = () => {
  const { setRef: setTextRef } = useTextAnimation({
    threshold: 0.1,
    rootMargin: '-25% 0px -40% 0px',
    removeOnExit: true,
  })

  return (
    <div className={styles.Contact}>
      <div className={styles.content} ref={setTextRef(0)}>
        <div ref={setTextRef(0)}>
          {splitTextToSpans("let's make something", 'project-title', 'h1')}
        </div>
        <div className={styles.contact_btn}>
          <span>contact</span> <ArrowUpRight strokeWidth={1} />
        </div>
      </div>
    </div>
  )
}

export default Contact
