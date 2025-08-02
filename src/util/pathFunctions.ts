import type { NoteType } from '../assets/data/notes'

export const generateSlug = (
  value: string
  // slugOnly: boolean = false,
  // path: string | undefined
) => {
  // let pageSlug = ''
  // if (note.link) pageSlug = note.link
  // else
  const pageSlug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .trim()
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-')
  console.log(pageSlug)
  return pageSlug
  // return slugOnly ? pageSlug : `${path}/${pageSlug}`
}

export const generatePath = (slug: string, pathname: string) => {
  return `${pathname}/${slug}`
}
