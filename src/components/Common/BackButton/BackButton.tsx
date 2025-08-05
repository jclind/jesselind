import React from 'react'
import styles from './BackButton.module.scss'

const BackButton = () => {
  const handleGoBack = (e: any) => {
    e.preventDefault() // Prevent default link behavior

    const path = window.location.pathname
    const segments = path.split('/').filter(segment => segment !== '')
    segments.pop() // Remove last segment

    const parentPath =
      '/' + segments.join('/') + (segments.length > 0 ? '/' : '')
    window.location.href = parentPath
  }

  return (
    <a href='../' className='notes-back-btn' onClick={handleGoBack}>
      ../
    </a>
  )
}

export default BackButton
