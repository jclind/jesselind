import { links } from '../../components/Layout/Footer/links'

const projectImgPath = '/images/projects/'

const genProjectImgs = (
  projectName: string,
  basePath: string = projectImgPath
) => {
  return [
    `${basePath}${projectName}/1.png`,
    `${basePath}${projectName}/2.png`,
    `${basePath}${projectName}/3.png`,
    `${basePath}${projectName}/3.png`,
  ]
}

export const projects = [
  {
    title: 'Prepify',
    tagline: 'Prep meals. Track costs. Eat better.',
    description: '',
    images: genProjectImgs('prepify'),
    link: '/portfolio/prepify',
  },
  {
    title: 'Pump Track',
    tagline: 'Simple yet functional workout tracking.',
    description: '',
    images: genProjectImgs('pumptrack'),
    link: '/portfolio/pumptrack',
  },
  {
    title: 'DoorDash Driver Recap',
    tagline: 'A recap of your dashing year, inspired by Spotify Wrapped.',
    description: '',
    images: genProjectImgs('doordash-recap'),
    link: '/portfolio/doordash-recap',
  },
  {
    title: 'BitWorkout',
    tagline: 'Gamify your workouts. Collect items and treasure for motivation.',
    description: '',
    images: genProjectImgs('bitworkout'),
    link: '/portfolio/bitworkout',
  },
  {
    title: 'Jesse Lind Photography',
    tagline: 'My personal photography portfolio.',
    description: '',
    images: genProjectImgs('jesselind-photography'),
    link: '/portfolio/jesselind-photography',
  },
  {
    title: 'Tridle',
    tagline: 'Three letter Wordle clone.',
    description: '',
    images: genProjectImgs('tridle'),
    link: '/portfolio/tridle',
  },
  // {
  //   title: '',
  //   tagline: '',
  //   description: '',
  //   images: [],
  //   link: '',
  // }
]
