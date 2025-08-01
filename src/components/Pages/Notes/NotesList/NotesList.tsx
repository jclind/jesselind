import React, { useEffect, useState } from 'react'
import styles from './NotesList.module.scss'
import { notes as originalNotes } from '../../../../assets/data/notes'
import type { NoteType } from '../../../../assets/data/notes'
import { generatePath, generateSlug } from '../../../../util/pathFunctions'
import NavHeader from '../../../Common/NavHeader'
import FileList from '../../../Common/FileList'
import type { FileLinkType } from '../../../Common/FileList/FileList'
import BackButton from '../../../Common/BackButton'

const NotesList = () => {
  const [notesList, setNotesList] = useState<FileLinkType[]>(() => {
    const refinedNotes: FileLinkType[] = originalNotes.map(note => {
      return {
        id: note.id,
        name: note.title,
        src: `/files/notes/${generateSlug(note.title)}`,
      }
    })
    return [...refinedNotes].reverse()
  })

  const links = [
    { name: 'jesselind', src: '/' },
    { name: 'files', src: '/files' },
    { name: 'notes', src: '/files/notes' },
  ]

  // useEffect(() => {
  //   const notesList = [...originalNotes]
  //   const notesListReversed = notesList.reverse()
  //   setNotesList(notesListReversed)
  // }, [])

  return (
    <div className={`${styles.NotesList} notes-style-page`}>
      <div className={`${styles.content} notes-content`}>
        <NavHeader links={links} />
        <FileList list={notesList} />
        <BackButton />
      </div>
    </div>
  )
}

export default NotesList
