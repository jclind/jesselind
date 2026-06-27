import React from 'react'
import styles from './FileList.module.scss'

export type FileLinkType = {
  id?: number | string
  name: string
  src: string
  type?: string
}

const FileList = ({
  list,
  emptyMessage,
}: {
  list: FileLinkType[]
  emptyMessage?: string
}) => {
  if (list.length === 0 && emptyMessage) {
    return (
      <div className={`files-list`}>
        <div className={`files-empty`}>{emptyMessage}</div>
      </div>
    )
  }
  return (
    <div className={`files-list`}>
      {list.map((file, index, origArr) => (
        <div className={`file`} key={file.id || file.name}>
          <div className={`file_index`}>
            {file.id || origArr.length - index - 1}.
          </div>
          <a href={file.src} key={file.id} data-astro-prefetch='hover'>
            {file.name}
            {file.type && <span>{file.type}</span>}
          </a>
        </div>
      ))}
    </div>
  )
}

export default FileList
