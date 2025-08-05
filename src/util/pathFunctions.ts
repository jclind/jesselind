import type { NoteType } from '../assets/data/notes'

export const generateSlug = (value: string) => {
  const pageSlug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .trim()
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-')
  return pageSlug
}

export const generatePath = (slug: string, pathname: string) => {
  return `${pathname}/${slug}`
}
