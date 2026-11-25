// Jesse's Christmas list, served at /christmas. The page is unlisted: nothing
// links to it, the sitemap skips it, and it carries a noindex tag. To add an
// item, add an entry here. Prices are what each store showed on 2026-11-25.

export type ChristmasItem = {
  name: string
  store: string
  price: string
  url: string
  image: string
  note?: string
}

export const CHRISTMAS_YEAR = 2026

export const christmasItems: ChristmasItem[] = [
  {
    name: 'Keychron M3 wireless mouse',
    store: 'Amazon',
    price: '$49.99',
    url: 'https://www.amazon.com/dp/B0CH7V357L',
    image: 'https://m.media-amazon.com/images/I/61YDaKpe9VL._AC_SL500_.jpg',
    note: 'The white one',
  },
  {
    name: 'LEPOWER gooseneck reading lamp',
    store: 'Amazon',
    price: '$19.93',
    url: 'https://www.amazon.com/dp/B07WGS7JMR',
    image: 'https://m.media-amazon.com/images/I/510rAqWSMJL._AC_SL500_.jpg',
    note: 'Black',
  },
  {
    name: 'Foldable 3-in-1 charger for phone and watch',
    store: 'Amazon',
    price: '$15.18',
    url: 'https://www.amazon.com/dp/B0GXKSMTQ2',
    image: 'https://m.media-amazon.com/images/I/71VHyMiPitL._AC_SL500_.jpg',
  },
]

// Smaller ideas with no link, listed under the cards.
export const christmasSmallIdeas: string[] = [
  "Lip balm, Burt's Bees",
  'Gum or mints',
  'A new deck of playing cards for my collection',
  'A small LEGO Botanicals set',
  'Anything Studio Ghibli',
  'Japanese instant ramen',
  'Barebells protein bars',
  'Black socks',
  'Candles',
]
