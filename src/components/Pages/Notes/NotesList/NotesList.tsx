import React, { useEffect, useState } from 'react'
import styles from './NotesList.module.scss'
import { notes as originalNotes } from '../../../../assets/data/notes'
import type { NoteType } from '../../../../assets/data/notes'
import { generateSlug } from '../../../../util/generateSlug'

const NotesList = () => {
  const [notesList, setNotesList] = useState<NoteType[]>(
    [...originalNotes].reverse()
  )

  useEffect(() => {
    const notesList = [...originalNotes]
    const notesListReversed = notesList.reverse()
    setNotesList(notesListReversed)
  }, [])

  return (
    <div className={styles.NotesList}>
      <div className={styles.content}>
        <div className='nav-header'>
          <a href={'/'}>jesselind</a> /{' '}
          <a href={'/notes'}>
            <i>notes</i>
          </a>
        </div>
        <div className={styles.divider}>—</div>
        <div className={styles.notes}>
          {notesList.map(note => (
            <div className={styles.note}>
              <div className={styles.note_id}>{note.id}.</div>
              <a href={generateSlug(note)} key={note.id}>
                <span>{'['}</span>
                {note.title}
                <span>{']'}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NotesList
