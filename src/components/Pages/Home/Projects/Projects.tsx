import React, { useEffect, useRef } from 'react'
import styles from './Projects.module.scss'
import { projects } from '../../../../assets/data/projects'
import {
  splitTextToSpans,
  useTextAnimation,
} from '../../../Util/useTextAnimations'

const Projects = () => {
  // Use custom hook for text animations
  const { setRef: setTextRef } = useTextAnimation({
    threshold: 0.1,
    rootMargin: '-10% 0px -10% 0px',
    visibleClass: styles.visible,
  })

  // Keep separate observer for images (since they have different behavior)
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])

  console.log('Projects data:', projects)

  useEffect(() => {
    // Observer for images only
    const imageObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          console.log('Image Intersection:', entry.target, entry.isIntersecting)
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visibleImages)
          } else {
            entry.target.classList.remove(styles.visibleImages)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '-30% 0px -30% 0px',
      }
    )

    imageRefs.current.forEach(element => {
      if (element) imageObserver.observe(element)
    })

    return () => {
      imageRefs.current.forEach(element => {
        if (element) imageObserver.unobserve(element)
      })
    }
  }, [])

  return (
    <div className={styles.Projects}>
      <div className={styles.content}>
        <div className={styles.projects_list}>
          {projects.map((project, index) => (
            <div key={index} className={styles.project} ref={setTextRef(index)}>
              <div className={styles.head}>
                <p className={`${styles.title} project-title`}>
                  {splitTextToSpans(project.title, styles.letterTitle)}
                </p>
                <p className={`${styles.tagline} project-tagline`}>
                  {splitTextToSpans(project.tagline, styles.letterTagline, 0.5)}
                </p>
              </div>
              <a
                href={project.link || '#'}
                className={styles.imageLink}
                target='_blank'
                rel='noopener noreferrer'
              >
                <div
                  className={styles.images}
                  ref={el => {
                    imageRefs.current[index] = el
                  }}
                >
                  {project.images.map((image, imgIndex) => (
                    <div className={styles.image} key={imgIndex}>
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
