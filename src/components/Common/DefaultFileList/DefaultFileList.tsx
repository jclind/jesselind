import React from 'react'
import styles from './DefaultFileList.module.scss'
import NavHeader from '../NavHeader'
import FileList from '../FileList'
import BackButton from '../BackButton'
import type { FileLinkType } from '../FileList/FileList'
import type { NavLinkType } from '../NavHeader/NavHeader'

const DefaultFileList = ({
  navLinks,
  fileLinks,
  emptyMessage,
}: {
  navLinks: NavLinkType[]
  fileLinks: FileLinkType[]
  emptyMessage?: string
}) => {
  return (
    <div className={`${styles.DefaultFileList} notes-style-page`}>
      <div className={`${styles.content} notes-content`}>
        <NavHeader links={navLinks} />
        <FileList list={fileLinks} emptyMessage={emptyMessage} />
        <BackButton />
      </div>
    </div>
  )
}

export default DefaultFileList
