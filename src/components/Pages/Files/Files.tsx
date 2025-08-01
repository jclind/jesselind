import React from 'react'
import styles from './Files.module.scss'
import NavHeader from '../../Common/NavHeader'
import BackButton from '../../Common/BackButton'

const Files = () => {
  const navLinks = [
    { name: 'jesselind', src: '/' },
    { name: 'files', src: '/files' },
  ]
  const folderLinks = [
    { name: 'notes/', src: '/files/notes' },
    { name: 'legal/', src: '/files/legal' },
  ]

  return (
    <div className={`${styles.Files} notes-style-page`}>
      <div className={`${styles.content} notes-content`}>
        <NavHeader links={navLinks} />
        <div className='files-list'>
          {folderLinks.map(link => (
            <a href={link.src}>{link.name}</a>
          ))}
        </div>
        <BackButton />
      </div>
    </div>
  )
}

export default Files
