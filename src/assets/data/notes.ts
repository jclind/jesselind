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
    title: 'hello world',
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
      `Words carry weight. I chose the Japanese word <span style="white-space:nowrap">未来</span> (みらい) or 'mirai' to be a symbol for this website. 未来 means <i>future</i> or literally <i>not yet come</i>. The word paints a picture of an ideal, abstract future not yet arrived.`,
      'There is a beautiful tension in this word, even just in the kanji characters themselves. 未 holds the meaning of <i>uncertainty, openness, or potential</i> however 来 implies <i>something certain, fated and unfolding</i>. The concept of something being open-ended and not yet determined, but in motion. In this way, I believe this word relates to our humanity: every person is always becoming. Whether they intend to or not, change is inevitable. The only choice is its direction. What <i>is</i> malleable however is the direction that we choose to point this trajectory, the path that we are walking. Every step appears to be insignificant, but over time it leads us to somewhere very real.',
      "Unfortunately, humans aren't always keen on change (look at every older generation complaining about youngsters). This often leads us to slowly slip into stubborn routines, habits, and conversations. The illusion of stasis is a very dangerous thing. Day to day, this illusion goes unnoticed. Over time however, it becomes unmistakable. People don't just drift into joy and positivity. They fall into fatigue, fear, and frustration. That grumpy old guy in Walmart didn't set a goal in his younger life to be a curmudgeon, however, years of seemingly insignificant decisions changed his entire temperament. These decisions are frighteningly easy. A gut reaction. A moment’s pleasure. They take no real thought and they compound fast. The instant outburst of anger in traffic, the fast food meal calling out to you on your drive home, or the hour of dopamine-chasing on instagram reels when the alternative is studying or (God forbid) being bored. All this to say, the direction we point our future is a very present thing with very real consequences.",
      `The good news: there is no barrier to entry or 6 month course you need to buy to point yourself towards a better 未来. You can start right now with the small decisions in your life; the decisions that truly make you who you are. It's really that simple. Hard and requiring a constant fight against mental stagnation, nevertheless simple. I write all this as a reminder for myself. A reminder to walk the path with intention and to treat every step as shaping where I will one day arrive. And in a more personal way, to never stop pushing myself to create, to continue writing, photography, music, and <a href="https://open.spotify.com/album/4Hjqdhj5rh816i1dfcUEaM?si=atAZ1bcRT6WGIScaD-Et5Q">nurturing</a>* a love of learning. <i>Never final</i>.`,
      `<span class="footnotes">
      * I will use every opportunity I can to link to this masterpiece of an album on this site btw. You have been warned. Now go listen.
      </span>`,
    ],
    date: '2025-08-04T23:16:00.000Z',
  },
  {
    id: 2,
    title: 'the dichotomy of beauty',
    link: 'the dichotomy of beauty',
    text: [
      'I yearn to truly experience the things I find beautiful. The joy of engaging with beauty and the urge to recreate it becomes an addiction, a hindrance to true appreciation. When my soul resonates with a work of art or a melody that affects me deeply, a great longing overwhelms me to create something similar, I feel as though I cannot grasp that beauty fully without capturing and reshaping its likeness with my own hands.',
      `Every time I hear something that moves me, there is a dichotomy that agitates my soul: joy and discontentment. Joy for the gift of experience; discontentment for a feeling that eludes me. Perhaps it is a selfish desire: I want to be the one who created this beauty and therefore to be known for it. Perhaps it is a craving for a deeper understanding that only emerges through the struggle of creation.`,
      `I don't want to be this way, yet every day I see creations that strike me. Designs, animations, songs, buildings, technologies, photographs. And instead of simply marveling, I compare them to myself, my own abilities and ideas. I sort them into boxes: <i>I could replicate that</i> or <i>I could never dream of achieving such brilliance.</i> Ironically, it is my desperate desire to appreciate beauty that keeps me from truly doing so.`,
      `How do I escape this exhausting trap? How do I learn to celebrate the creativity of others without looking at it through a mirror of my own abilities? `,
    ],
    date: '2025-09-29T17:13:11-05:00',
  },
  // {
  //   id: 3,
  //   title: '',
  //   link: '',
  //   text: ["",
  //   ],
  //   date: '',
  // },
]
