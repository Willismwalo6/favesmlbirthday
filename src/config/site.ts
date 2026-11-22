export const site = {
  name: 'Faves',
  fullName: 'Favour Kioko',
  birthday: {
    month: 12,
    day: 5,
    timezone: 'Africa/Nairobi',
    display: 'DECEMBER 5TH ♡',
  },
  welcome: {
    overline: 'A LITTLE SOMETHING FOR SOMEONE VERY SPECIAL...',
    sub: 'Made with love, just for you, Faves. ♡',
    button: 'OPEN YOUR SURPRISE ♡',
    sealedNote: 'Sealed with a kiss and a little bit of magic.',
  },
  countdown: {
    heading: 'COUNTING DOWN TO YOUR SPECIAL DAY',
    birthdayHeading: 'TODAY IS YOUR DAY, FAVES! ♡',
    birthdayNote:
      'The whole world got a little brighter the day you arrived. Happy birthday, my love.',
    subtitle: 'Every second brings me closer to celebrating you.',
    labels: { days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds' },
  },
  hero: {
    heading: 'HAPPY BIRTHDAY, FAVES!',
    text: 'Today is all about celebrating you, my beautiful girl. May your day be as lovely, special and unforgettable as you are. ♡',
  },
  gifts: {
    heading: 'THREE LITTLE GIFTS, JUST FOR YOU ♡',
    instruction: 'Go ahead, beautiful. Open each one...',
    completeLine: 'All three opened — and you deserve a thousand more.',
    items: [
      {
        id: 1,
        label: 'Gift One',
        ribbon: 'Blush & gold',
        title: 'For the girl who is enough',
        message:
          'Faves, I hope you never forget how special you are. Your smile, your presence and the little things that make you who you are mean more than you know. You deserve to be celebrated, appreciated and loved every single day.',
      },
      {
        id: 2,
        label: 'Gift Two',
        ribbon: 'Rose & pearls',
        title: 'For every beautiful possibility',
        message:
          'Never settle for believing that you’re anything less than amazing. You deserve beautiful opportunities, gentle moments, genuine happiness and a love that makes you feel appreciated.',
      },
      {
        id: 3,
        label: 'Gift Three',
        ribbon: 'Berry & ribbon',
        title: 'For the chapter ahead',
        message:
          'My wish for you is that this new chapter brings you closer to every dream you’ve ever had. May your heart find peace, your efforts bring beautiful results and your life give you countless reasons to smile.',
      },
    ],
  },
  letter: {
    heading: 'A LETTER FOR MY FAVOURITE GIRL ♡',
    salutation: 'To Faves, My Love ♡',
    close: 'With all my love. ❤️',
    paragraphs: [
      'My beautiful Faves,',
      'I honestly wish words could perfectly explain just how much you mean to me. Sometimes I find myself thinking about you and smiling for no particular reason. You have this beautiful way of making my world feel warmer, and I hope you never underestimate how special you are to me.',
      'I love your presence, your smile, the little things that make you who you are, and the happiness that comes with having you in my life. I love that you’re you. And if there’s one thing I want you to remember, it’s that you are someone worth celebrating, appreciating, protecting and loving wholeheartedly.',
      'Your birthday is one of the most special days to me because it’s the day someone as beautiful and precious as you came into this world. December 5th isn’t just another date on the calendar. It’s a day I get to celebrate your existence, your journey, your dreams and the wonderful person you are.',
      'I wish I could wrap every beautiful thing in this world into a little gift and place it in your hands. I wish you endless reasons to smile, dreams that come true, peace in your heart, opportunities that find you and love that never makes you question your worth.',
      'And if I could make one wish for you, it would be that life treats you as gently and beautifully as you deserve. May every new chapter bring you closer to everything your heart desires.',
      'Thank you for being you, Faves. Thank you for the smiles, the moments and the beautiful feeling of having you in my world.',
      'Happy birthday in advance, my love. I hope you always know just how much you mean to me.',
    ],
  },
  memories: {
    heading: 'LITTLE MOMENTS, BEAUTIFUL MEMORIES ♡',
    text: "Every picture tells a little story. Here's to the moments that make life beautiful.",
  },
  wish: {
    heading: 'MAKE A WISH, BEAUTIFUL ♡',
    text: 'Close your eyes, think of something wonderful, and let the candles carry it up.',
    button: 'BLOW THE CANDLES ♡',
    replay: 'Light them again ♡',
    reveal:
      'I hope every beautiful thing finds its way to you, Faves. May your life be full of love, laughter, peace and unforgettable memories.',
  },
  finale: {
    overline: 'ONE LAST QUESTION, FAVES...',
    question: 'Faves, my love... WILL YOU BE MY BIRTHDAY GIRLFRIEND? ♡',
    yes: 'YES ♡',
    think: 'LET ME THINK',
    yesHeading: 'YOU JUST MADE THIS THE MOST BEAUTIFUL BIRTHDAY SURPRISE. I LOVE YOU, FAVES! ♡',
    yesText:
      'Thank you for being the softest, loveliest part of my life. I hope this year holds every good thing for you — and I hope I get to be there for all of it. Happy birthday, my love.',
    thinkText:
      'Take your time, beautiful. No pressure. You’re still my favourite person to celebrate. ♡',
    replay: 'Replay our little fairytale ♡',
  },
  music: {
    label: 'Music',
    missing: 'Add a song you love in the photo studio (Music tab) and it will play here.',
  },
  nav: [
    { id: 'home', label: 'Home' },
    { id: 'birthday', label: 'Birthday' },
    { id: 'surprises', label: 'Surprises' },
    { id: 'letter', label: 'Love Letter' },
    { id: 'memories', label: 'Memories' },
    { id: 'question', label: 'The Question' },
  ],
} as const;

export type SectionId = (typeof site.nav)[number]['id'];
