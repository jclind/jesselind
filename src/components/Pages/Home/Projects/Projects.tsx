import React, { useEffect, useRef } from 'react'
import styles from './Projects.module.scss'
import { projects } from '../../../../assets/data/projects'

const Projects = () => {
  const projectRefs = useRef<(HTMLDivElement | null)[]>([])
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])

  console.log('Projects data:', projects)

  const splitTextToSpans = (
    text: string,
    isTitle: boolean,
    initialDelay: number = 0
  ) => {
    return text.split('').map((char, index) => (
      <span
        key={index}
        className={`${isTitle ? styles.letterTitle : styles.letterTagline}`}
        style={
          {
            animationDelay: `${index * 0.02 + initialDelay}s`,
            '--index': index,
          } as React.CSSProperties // Type assertion to allow --index
        }
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))
  }
  useEffect(() => {
    console.log('Project refs:', projectRefs.current)
    console.log('Image refs:', imageRefs.current)
    // Observer for text (title and tagline)
    const textObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          console.log('Text Intersection:', entry.target, entry.isIntersecting)
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible)
          } else {
            // entry.target.classList.remove(styles.visible)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '-10% 0px -10% 0px', // Text: 30% from top, 50% from bottom
      }
    )

    // Observer for images
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
        rootMargin: '-50% 0px -40% 0px', // Images: 50% from top, 50% from bottom
      }
    )

    projectRefs.current.forEach(element => {
      if (element) textObserver.observe(element)
    })

    imageRefs.current.forEach(element => {
      if (element) imageObserver.observe(element)
    })

    return () => {
      projectRefs.current.forEach(element => {
        if (element) textObserver.unobserve(element)
      })
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
            <div
              key={index}
              className={`${styles.project} `}
              ref={el => {
                projectRefs.current[index] = el
              }}
            >
              <div className={styles.head}>
                <p className={`${styles.title} project-title`}>
                  {splitTextToSpans(project.title, true)}
                </p>
                <p className={`${styles.tagline} project-tagline`}>
                  {splitTextToSpans(project.tagline, false, 0.5)}
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
