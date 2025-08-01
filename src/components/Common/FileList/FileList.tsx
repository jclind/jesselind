import React from 'react'
import styles from './FileList.module.scss'

export type FileLinkType = {
  id?: number | string
  name: string
  src: string
}

const FileList = ({ list }: { list: FileLinkType[] }) => {
  return (
    <div className={`files-list`}>
      {list.map((file, index) => (
        <div className={`file`}>
          <div className={`file_index`}>{file.id || index}.</div>
          <a href={file.src} key={file.id}>
            {file.name}
          </a>
        </div>
      ))}
    </div>
  )
}

export default FileList
