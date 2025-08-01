export const NAV_LINKS_DEFAULT = [{ name: 'jesselind', src: '/' }]
export const NAV_LINKS_FILES = [
  ...NAV_LINKS_DEFAULT,
  { name: 'files', src: '/files' },
]
export const NAV_LINKS_NOTES = [
  ...NAV_LINKS_FILES,
  { name: 'notes', src: '/files/notes' },
]
export const NAV_LINKS_LEGAL = [
  ...NAV_LINKS_FILES,
  { name: 'legal', src: '/files/legal' },
]
