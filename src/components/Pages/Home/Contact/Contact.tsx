import styles from './Contact.module.scss'
import { ArrowUpRight } from 'lucide-react'
import {
  splitTextToSpans,
  useTextAnimation,
} from '../../../Util/useTextAnimation'
import fadeStyles from '../../../Util/fadeInAnimation.module.scss'
import { useFadeInAnimation } from '../../../Util/useFadeInAnimation'

const Contact = () => {
  const { setRef: setTextRef } = useTextAnimation({
    threshold: 0.1,
    rootMargin: '-30% 0px -30% 0px',
    removeOnExit: true,
  })

  const { setRef: setFadeRef } = useFadeInAnimation({
    threshold: 0.2,
    rootMargin: '-30% 0px -30% 0px',
    removeOnExit: true,
  })

  return (
    <div className={styles.Contact}>
      <div className={styles.content} ref={setTextRef(0)}>
        <div ref={setTextRef(0)}>
          {splitTextToSpans("let's make something", 'project-title', 'h1')}
        </div>
        <a
          ref={setFadeRef(0)}
          href={'/contact'}
          className={`${styles.contact_btn} ${fadeStyles.fadeInElement}`}
        >
          <span className={styles.btn_glow}></span>
          <span>contact</span> <ArrowUpRight strokeWidth={1} />
        </a>
      </div>
    </div>
  )
}

export default Contact
