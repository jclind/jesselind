export type NoteType = {
  id: number
  link?: string
  title: string
  text: string[]
  date: string
}

export const notes = [
  {
    id: 0,
    title: 'Hello World',
    text: [
      'Hello, these are a collections of my thoughts, ideas, likes, dislikes, life events or really anything on my mind. Enjoy :)',
    ],
    date: '2021-10-01T12:00:00.000Z',
  },
  {
    id: 1,
    title: '未来 mirai',
    link: 'mirai',
    text: [
      'Nostrud occaecat pariatur laboris minim voluptate ea adipisicing quis occaecat. Deserunt officia sunt qui ad incididunt. Eiusmod cillum aute quis irure ullamco. Duis labore amet commodo reprehenderit consectetur qui consequat do ad et ut do cupidatat aliquip. Dolor occaecat cupidatat dolore id eiusmod labore non proident eiusmod dolore occaecat. Labore sunt consequat amet labore. Nisi tempor ipsum esse ea amet sint Lorem magna minim nulla labore qui cillum qui.',
      'Laboris reprehenderit nisi tempor tempor eiusmod ea magna sint aliqua velit ea. Commodo in nulla aliquip reprehenderit excepteur duis. Fugiat non qui nulla qui aute sit culpa labore reprehenderit pariatur id fugiat. Nisi officia eu et consectetur occaecat ad sint. Elit in sunt tempor quis mollit. Est non occaecat dolore labore. In incididunt magna aute aliqua sit voluptate eu occaecat consequat do sit veniam eiusmod. Consectetur quis ex eu in excepteur tempor tempor amet elit incididunt.',
    ],
    date: '2022-11-15T12:00:00.000Z',
  },
  {
    id: 2,
    title: 'Journey With Typescript',
    text: [
      "Lately, I've been using Typescript in all of my projects and let me tell you, it's been a game-changer. With its type checking and improved error handling, I'm able to spot problems earlier in the development process and write better code. Plus, using interfaces and type definitions makes my projects much more manageable, especially as they get bigger and more complex. I never thought I'd enjoy working with a statically typed language, but Typescript has totally won me over.",
      "Going back to plain old JavaScript feels like such a drag now. Without the helpful type information and increased risk of runtime errors, I feel like I'm coding with one hand tied behind my back. Trust me, using Typescript makes me way more productive and my code is just better overall. I highly recommend giving it a try – you might just be surprised at how much you love it, like I have!",
    ],
    date: '2024-01-01T12:00:00.000Z',
  },
  {
    id: 3,
    title: 'Gym Consistency',
    text: [
      'Nostrud occaecat pariatur laboris minim voluptate ea adipisicing quis occaecat. Deserunt officia sunt qui ad incididunt. Eiusmod cillum aute quis irure ullamco. Duis labore amet commodo reprehenderit consectetur qui consequat do ad et ut do cupidatat aliquip. Dolor occaecat cupidatat dolore id eiusmod labore non proident eiusmod dolore occaecat. Labore sunt consequat amet labore. Nisi tempor ipsum esse ea amet sint Lorem magna minim nulla labore qui cillum qui.',
      'Laboris reprehenderit nisi tempor tempor eiusmod ea magna sint aliqua velit ea. Commodo in nulla aliquip reprehenderit excepteur duis. Fugiat non qui nulla qui aute sit culpa labore reprehenderit pariatur id fugiat. Nisi officia eu et consectetur occaecat ad sint. Elit in sunt tempor quis mollit. Est non occaecat dolore labore. In incididunt magna aute aliqua sit voluptate eu occaecat consequat do sit veniam eiusmod. Consectetur quis ex eu in excepteur tempor tempor amet elit incididunt.',
    ],
    date: '2025-03-15T12:00:00.000Z',
  },
]
