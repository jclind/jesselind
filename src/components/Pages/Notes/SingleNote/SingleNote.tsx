import React from 'react'
import styles from './SingleNote.module.scss'
import type { NoteType } from '../../../../assets/data/notes'
import { formatNotesDate } from '../../../../util/formatNotesDate'
import NavHeader from '../../../Common/NavHeader'
import BackButton from '../../../Common/BackButton'

const SingleNote = ({ note }: { note: NoteType }) => {
  const noteLinks = [
    { name: 'jesselind', src: '/' },
    { name: 'files', src: '/files' },
    { name: 'notes', src: '/files/notes' },
    { name: note.title, src: '#' },
  ]

  return (
    <div className={`${styles.SingleNote} notes-style-page`}>
      <div className={`${styles.content} notes-content`}>
        <NavHeader links={noteLinks} />
        <h1 className={'note-title'}>{note.title}</h1>
        <div className={'note-text'}>
          {note.text.map(paragraph => {
            return <p>{paragraph}</p>
          })}
        </div>
        <div className={styles.date}>{formatNotesDate(note.date)}</div>
        <BackButton />
      </div>
    </div>
  )
}

export default SingleNote
