import type { NoteType } from '../assets/data/notes'

export const generateSlug = (note: NoteType, slugOnly: boolean = false) => {
  let pageSlug = ''
  if (note.link) pageSlug = note.link
  else
    pageSlug = note.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-')

  return slugOnly ? pageSlug : `/notes/${pageSlug}`
}
