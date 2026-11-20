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
    `${basePath}${projectName}/1.webp`,
    `${basePath}${projectName}/2.webp`,
    `${basePath}${projectName}/3.webp`,
    `${basePath}${projectName}/4.webp`,
  ]
}

export const projects: ProjectType[] = [
  {
    id: 0,
    title: 'Jesse Lind Photography',
    tagline: 'My personal photography portfolio.',
    description: [
      "My personal photography portfolio website. I've always been fascinated with photography and capturing moments, and over the years, I've taken some pictures that I think are worthy of sharing.",
    ],
    images: genProjectImgs('jesselind-photography'),
    link: 'https://jesselindphoto.vercel.app/',
    slug: 'jesselind-photography',
    github: 'https://github.com/jclind/jesselind-photo',
  },
  {
    id: 1,
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
    id: 2,
    title: 'tally',
    tagline: 'Like Mint, but it runs on your own computer.',
    description: [
      `I discovered Intuit's Mint app in 2023, and it had everything I needed from a budgeting app. I could easily see my net worth, track my monthly spending, and set budgets and goals. Of course, after seeing how useful this service was to me and so many others, Intuit decided that too much fun and convenience was being had by its Mint users. So in November of that same year, Intuit announced that Mint would be shut down within the next few months.`,
      `I was unimpressed by the corporate slop replacement, Credit Karma, with all of the nice features ripped away and loan advertisements forced in their place. Ever since Mint's retirement I've been searching for a budgeting app with anything close to the same features, but everything I found came with an egregious monthly subscription (yay capitalism!!!).`,
      `That was until I found <a href="https://plaid.com/">Plaid</a>'s free plan, which lets you connect up to 10 banks for free, with no time limit. That instantly jump-started my development of tally, an app I don't have to pay a subscription for, that doesn't send my information to Intuit, and that runs on my own computer. With the beauty of open source, I'd like to share tally with anyone who misses Mint's features but is sick of the corporate greed that comes with most apps these days. If you'd like to try it, check out the <a href="https://github.com/jclind/tally">GitHub repo</a> or <a href="https://tally.jesselind.com/">tally.jesselind.com</a> to see the features and how to install it yourself.`,
    ],
    images: genProjectImgs('tally'),
    link: 'https://tally.jesselind.com/',
    slug: 'tally',
    github: 'https://github.com/jclind/tally',
  },
  {
    id: 3,
    title: 'pumptrack',
    tagline: 'Simple yet functional workout tracking.',
    description: [
      'Pump Track is a streamlined workout app designed to make fitness tracking simple and effective. Users can log workouts by entering exercises with titles, weights (including multiple values), sets, and reps. The app offers a smart "Last Exercise Weight" suggestion to guide users in their next sessions. A complete workout history is easily accessible and editable from the home page. To support long-term progress, Pump Track includes visual charts displaying personal records and performance trends for each exercise. Social features allow users to connect with friends and view each other’s workout counts, adding a motivational layer to the experience.',
    ],
    images: genProjectImgs('pumptrack'),
    link: 'https://pumptrack.netlify.app/',
    slug: 'pumptrack',
    github: 'https://github.com/jclind/pump-track',
  },
  {
    id: 4,
    title: 'DoorDash Driver Recap',
    tagline: 'A recap of your dashing year.',
    description: [
      'Dasher Recap is an app allowing dashers to see a recap of their year of DoorDashing including number of orders completed, minutes dashed, most frequent restaurants, top dashing times, and much more. Influenced from Spotify Wrapped, the yearly data is wrapped in slick designs and satisfying animations.',
    ],
    images: genProjectImgs('doordash-recap'),
    link: 'https://dasher-recap.netlify.app/',
    slug: 'doordash-recap',
    github: 'https://github.com/jclind/doordash-recap',
  },
  {
    id: 5,
    title: 'BitWorkout',
    tagline: 'Gamify your workouts and collect treasure.',
    description: [
      'A gamified RPG-like workout app to give added motivation to exercise. Users can earn coins/experience, purchase items with their rewards, create their own workouts, track their progress and much more.',
    ],
    images: genProjectImgs('bitworkout'),
    link: 'https://bitworkout.netlify.app/',
    slug: 'bitworkout',
    github: 'https://github.com/jclind/bit-workout',
  },

  {
    id: 6,
    title: 'Tridle',
    tagline: 'Three letter Wordle clone.',
    description: [
      'A three letter Wordle game featuring themes, colorblind mode and stat tracking.',
    ],
    images: genProjectImgs('tridle'),
    link: 'https://tridle.netlify.app/',
    slug: 'tridle',
    github: 'https://github.com/jclind/tridle',
  },
  // {
  //   title: '',
  //   tagline: '',
  //   description: '',
  //   images: [],
  //   link: '',
  // }
]
