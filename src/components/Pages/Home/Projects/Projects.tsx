import React, { useEffect, useRef } from 'react'
import styles from './Projects.module.scss'
import { projects } from '../../../../assets/data/projects'
import {
  splitTextToSpans,
  useTextAnimation,
} from '../../../Util/useTextAnimation'
import { useFadeInAnimation } from '../../../Util/useFadeInAnimation'
import fadeInAnimationStyles from '../../../Util/fadeInAnimation.module.scss'
import fadeStyles from '../../../Util/fadeInAnimation.module.scss'

const Projects = () => {
  const { setRef: setTextRef } = useTextAnimation({
    threshold: 0.1,
    rootMargin: '-10% 0px -10% 0px',
  })

  const { setRef: setFadeRef } = useFadeInAnimation({
    threshold: 0.1,
    removeOnExit: true,
    rootMargin: '-30% 0px -30% 0px',
  })

  return (
    <div className={styles.Projects} id='projects'>
      <div className={styles.content}>
        <div className={styles.projects_list}>
          {projects.map((project, index) => (
            <div
              key={index}
              className={`${styles.project} project-container`}
              ref={setTextRef(index)}
            >
              <div className={styles.title_text}>
                {splitTextToSpans(project.title, 'project-title')}
              </div>
              <div className={styles.tagline_text}>
                {splitTextToSpans(project.tagline, 'project-tagline', 'p', 0.5)}
              </div>
              <a
                href={project.slug ? `/projects/${project.slug}` : '#'}
                className={styles.imageLink}
              >
                <div
                  className={`${styles.images} project-images ${fadeStyles.fadeInElement}`}
                  ref={setFadeRef(index)}
                >
                  {project.images.map((image, imgIndex) => (
                    <div className={`${styles.image} image`} key={imgIndex}>
                      <img
                        key={imgIndex}
                        src={image}
                        alt={`${project.title} image ${imgIndex + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Projects
