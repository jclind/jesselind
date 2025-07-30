import React from 'react'
import styles from './SingleNote.module.scss'
import type { NoteType } from '../../../../assets/data/notes'
import { formatNotesDate } from '../../../../util/formatNotesDate'

const SingleNote = ({ note }: { note: NoteType }) => {
  return (
    <div className={styles.SingleNote}>
      <div className={styles.content}>
        <div className='nav-header'>
          <a href='/'>jesselind</a> / <a href='/notes'>notes</a> /{' '}
          <i>
            <a href='#'>{note.title}</a>
          </i>
        </div>
        <h1>{note.title}</h1>
        <div className={styles.text}>
          {note.text.map(paragraph => {
            return <p>{paragraph}</p>
          })}
        </div>
        <div className={styles.date}>{formatNotesDate(note.date)}</div>
      </div>
    </div>
  )
}

export default SingleNote
