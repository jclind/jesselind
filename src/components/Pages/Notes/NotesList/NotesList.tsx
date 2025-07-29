import React from 'react'
import styles from './NotesList.module.scss'
import { notes } from '../../../../assets/data/notes'

const NotesList = () => {
  return (
    <div className={styles.NotesList}>
      <div className={styles.content}>
        <div className={styles.header}>
          <a href={'/'}>jesselind</a> /{' '}
          <a href={'/notes'}>
            <i>notes</i>
          </a>
        </div>
        <div className={styles.divider}>—</div>
        <div className={styles.notes}>
          {notes.reverse().map(note => (
            <div className={styles.note}>
              <div className={styles.note_id}>{note.id}.</div>
              <a href={`/notes/${note.id}`} key={note.id}>
                <span>{'{'}</span>
                {note.title}
                <span>{'}'}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NotesList
