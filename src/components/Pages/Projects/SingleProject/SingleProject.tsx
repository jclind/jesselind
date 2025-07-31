import React from 'react'
import styles from './SingleProject.module.scss'
import type { ProjectType } from '../../../../assets/data/projects'
import { SquareArrowOutUpRight } from 'lucide-react'

const SingleProject = ({ project }: { project: ProjectType }) => {
  return (
    <div className={styles.SingleProject}>
      <div className={styles.content}>
        <div className={`${styles.images} project-images`}>
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
        <div className={styles.text_content}>
          <h1 className='note-title'>
            <a href={project.link} target='_blank' rel='noopener noreferrer'>
              {project.title}{' '}
              <SquareArrowOutUpRight strokeWidth={1} size={16} />
            </a>
          </h1>
          <h2 className='note-subtitle'>{project.tagline}</h2>
          <div className='note-text'>
            {project.description.map(paragraph => (
              <p dangerouslySetInnerHTML={{ __html: paragraph }}></p>
            ))}
          </div>
          <div className={styles.links}>
            <a href={project.link} target='_blank' rel='noopener noreferrer'>
              website
            </a>
            <a href={project.github} target='_blank' rel='noopener noreferrer'>
              github
            </a>
          </div>
          <a href='/#projects' className='notes-back-btn'>
            ../
          </a>
        </div>
      </div>
    </div>
  )
}

export default SingleProject
