import { links } from '../../components/Layout/Footer/links'

export type ProjectType = {
  id: number
  title: string
  tagline: string
  description: string[]
  images: string[]
  link: string
  slug: string
  github: string
}

const projectImgPath = '/images/projects/'

const genProjectImgs = (
  projectName: string,
  basePath: string = projectImgPath
): string[] => {
  return [
    `${basePath}${projectName}/1.png`,
    `${basePath}${projectName}/2.png`,
    `${basePath}${projectName}/3.png`,
    `${basePath}${projectName}/3.png`,
  ]
}

export const projects: ProjectType[] = [
  {
    id: 0,
    title: 'Prepify',
    tagline: 'Prep meals. Track costs. Eat better.',
    description: [
      `Prepify is a meal-prepping platform designed to take the guesswork out of recipe planning by offering real-time cost analysis, nutritional breakdowns, and intuitive filtering features. Built with home cooks and meal preppers in mind, it allows users to input or browse recipes and instantly see cost per serving, total recipe price, and full nutrition data — including calorie count, macros, and dietary tags like vegan, gluten-free, and keto. Recipes are displayed with a minimalist, no-nonsense layout that puts the recipe first, eliminating the typical blog clutter and life stories often found on food websites. Users can also leave ratings, write comments, save favorite recipes, and filter their searches by cost, health tags, and more.`,
      `The tech stack includes <a href="https://react.dev/">React.js</a>, <a href="https://www.typescriptlang.org/">TypeScript</a>, <a href="https://sass-lang.com/">SCSS</a>, <a href="https://firebase.google.com/">Firebase Authentication</a>, and <a href="https://www.mongodb.com/">MongoDB</a> — with custom-built tooling like <a href="https://www.npmjs.com/package/@jclind/ingredient-parser">@jclind/ingredient-parser</a>, a package developed specifically to convert raw ingredient strings into structured data for cost and nutrition queries. This parser handles complex inputs like “3 tbsp brown sugar” or “2 onions, diced,” and was one of the most technically challenging parts of the project. MongoDB stores all user and recipe data while Firebase manages authentication. Prepify is a tool built for speed, transparency, and simplicity — offering home cooks a practical, frustration-free way to manage their meals.`,
    ],
    images: genProjectImgs('prepify'),
    link: 'https://prepifymeals.com/',
    slug: 'prepify',
    github: 'https://github.com/jclind/prepify',
  },
  {
    id: 1,
    title: 'Pump Track',
    tagline: 'Simple yet functional workout tracking.',
    description: [],
    images: genProjectImgs('pumptrack'),
    link: 'https://pumptrack.netlify.app/',
    slug: 'pumptrack',
    github: '',
  },
  {
    id: 2,
    title: 'DoorDash Driver Recap',
    tagline: 'A recap of your dashing year.',
    description: [],
    images: genProjectImgs('doordash-recap'),
    link: 'https://dasher-recap.netlify.app/',
    slug: 'doordash-recap',
    github: '',
  },
  {
    id: 3,
    title: 'BitWorkout',
    tagline: 'Gamify your workouts and collect treasure.',
    description: [],
    images: genProjectImgs('bitworkout'),
    link: 'https://bitworkout.netlify.app/',
    slug: 'bitworkout',
    github: '',
  },
  {
    id: 4,
    title: 'Jesse Lind Photography',
    tagline: 'My personal photography portfolio.',
    description: [],
    images: genProjectImgs('jesselind-photography'),
    link: 'https://jesselindphotography.netlify.app/',
    slug: 'jesselind-photography',
    github: '',
  },
  {
    id: 5,
    title: 'Tridle',
    tagline: 'Three letter Wordle clone.',
    description: [],
    images: genProjectImgs('tridle'),
    link: 'https://tridle.netlify.app/',
    slug: 'tridle',
    github: '',
  },
  // {
  //   title: '',
  //   tagline: '',
  //   description: '',
  //   images: [],
  //   link: '',
  // }
]
