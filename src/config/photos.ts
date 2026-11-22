export type PhotoSection =
  | 'welcome'
  | 'countdown'
  | 'hero'
  | 'gifts'
  | 'letter'
  | 'memories'
  | 'wish'
  | 'finale';

export type StoredPhoto = {
  blob: Blob;
  x: number; // object-position X, 0-100
  y: number; // object-position Y, 0-100
  zoom: number; // 1 - 2
};

export type PhotoSlotConfig = {
  /** Stable, unique slot id. Use this to replace or manage a photo. */
  id: string;
  /** 1 - 38 */
  number: number;
  section: PhotoSection;
  /** Human description of where this photo appears. */
  location: string;
  /** Short label shown on the placeholder. */
  label: string;
  /** Optional suggested aspect ratio for the frame. */
  ratio?: string;
  /** Suggested crop orientation hint. */
  orientation?: 'portrait' | 'landscape' | 'square';
  caption?: string;
  date?: string;
  /** Scrapbook rotation in degrees (gallery only). */
  rotate?: number;
  /** Relative size in the gallery grid. */
  size?: 'sm' | 'md' | 'lg' | 'tall';
};

export const SECTION_LABELS: Record<PhotoSection, string> = {
  welcome: 'Welcome ✉️',
  countdown: 'Birthday Countdown ⏳',
  hero: 'Birthday Hero 🎂',
  gifts: 'Gift Room 🎁',
  letter: 'Love Letter 💌',
  memories: 'Memories Gallery 📸',
  wish: 'Make a Wish 🕯️',
  finale: 'Grand Finale 🌹',
};

const captions = [
  'A moment worth keeping ♡',
  'One of my favourite smiles.',
  'A beautiful little memory.',
  'More moments to come...',
];

const memoryLayout: Array<{ size: PhotoSlotConfig['size']; rotate: number }> = [
  { size: 'lg', rotate: -2.4 },
  { size: 'md', rotate: 1.8 },
  { size: 'sm', rotate: 2.8 },
  { size: 'tall', rotate: -1.4 },
  { size: 'md', rotate: -2.9 },
  { size: 'sm', rotate: 2.2 },
  { size: 'lg', rotate: 1.2 },
  { size: 'sm', rotate: -2.1 },
  { size: 'tall', rotate: 2.6 },
  { size: 'md', rotate: -1.1 },
  { size: 'sm', rotate: 1.6 },
  { size: 'md', rotate: -2.6 },
  { size: 'sm', rotate: 2.4 },
  { size: 'lg', rotate: -1.8 },
  { size: 'md', rotate: 1.4 },
  { size: 'sm', rotate: -2.2 },
];

const memories: PhotoSlotConfig[] = memoryLayout.map((layout, i) => {
  const number = 15 + i;
  return {
    id: `faves-photo-${String(number).padStart(2, '0')}`,
    number,
    section: 'memories' as const,
    location: `Memories gallery — scrapbook print ${i + 1} of 16`,
    label: `Gallery memory ${i + 1}`,
    caption: captions[i % captions.length],
    date: '',
    rotate: layout.rotate,
    size: layout.size,
    orientation: i % 3 === 0 ? 'portrait' : 'landscape',
  };
});

export const PHOTO_SLOTS: PhotoSlotConfig[] = [
  {
    id: 'faves-photo-01',
    number: 1,
    section: 'welcome',
    location: 'Welcome screen — portrait medallion above the envelope',
    label: 'Welcome portrait',
    orientation: 'portrait',
    caption: 'The loveliest hello ♡',
  },
  {
    id: 'faves-photo-02',
    number: 2,
    section: 'welcome',
    location: 'Welcome screen — polaroid beside Heart Buddy',
    label: 'Welcome polaroid',
    orientation: 'landscape',
    caption: 'Hello, beautiful.',
  },
  {
    id: 'faves-photo-03',
    number: 3,
    section: 'countdown',
    location: 'Countdown — tall gilded frame beside the timer',
    label: 'Countdown portrait',
    orientation: 'portrait',
    caption: 'Counting down to you ♡',
  },
  {
    id: 'faves-photo-04',
    number: 4,
    section: 'countdown',
    location: 'Countdown — small taped photograph under the subtitle',
    label: 'Countdown keepsake',
    orientation: 'landscape',
    caption: 'December 5th, always.',
  },
  {
    id: 'faves-photo-05',
    number: 5,
    section: 'hero',
    location: 'Birthday hero — main portrait in the ornate gold frame',
    label: 'Main hero portrait',
    orientation: 'portrait',
    caption: 'The birthday girl ♡',
  },
  {
    id: 'faves-photo-06',
    number: 6,
    section: 'hero',
    location: 'Birthday hero — supporting portrait, right side',
    label: 'Supporting portrait',
    orientation: 'portrait',
    caption: 'My favourite view.',
  },
  {
    id: 'faves-photo-07',
    number: 7,
    section: 'hero',
    location: 'Birthday hero — small polaroid tucked under the cake card',
    label: 'Hero polaroid',
    orientation: 'square',
    caption: 'Sweetest smile.',
  },
  {
    id: 'faves-photo-08',
    number: 8,
    section: 'hero',
    location: 'Birthday hero — scrapbook print with washi tape, top left',
    label: 'Hero scrapbook print',
    orientation: 'landscape',
    caption: 'A moment I replay.',
  },
  {
    id: 'faves-photo-09',
    number: 9,
    section: 'hero',
    location: 'Birthday hero — additional framed photograph, lower left',
    label: 'Hero framed photo',
    orientation: 'landscape',
    caption: 'Simply you ♡',
  },
  {
    id: 'faves-photo-10',
    number: 10,
    section: 'gifts',
    location: 'Gift room — revealed inside Gift 1',
    label: 'Gift 1 photograph',
    orientation: 'portrait',
    caption: 'Gift one, for you ♡',
  },
  {
    id: 'faves-photo-11',
    number: 11,
    section: 'gifts',
    location: 'Gift room — revealed inside Gift 2',
    label: 'Gift 2 photograph',
    orientation: 'portrait',
    caption: 'Gift two, with love.',
  },
  {
    id: 'faves-photo-12',
    number: 12,
    section: 'gifts',
    location: 'Gift room — revealed inside Gift 3',
    label: 'Gift 3 photograph',
    orientation: 'portrait',
    caption: 'Gift three, always.',
  },
  {
    id: 'faves-photo-13',
    number: 13,
    section: 'letter',
    location: 'Love letter — main photograph beside the stationery',
    label: 'Letter portrait',
    orientation: 'portrait',
    caption: 'To my favourite girl.',
  },
  {
    id: 'faves-photo-14',
    number: 14,
    section: 'letter',
    location: 'Love letter — small photo clipped to the stationery',
    label: 'Letter keepsake',
    orientation: 'landscape',
    caption: 'P.S. you are so loved.',
  },
  ...memories,
  {
    id: 'faves-photo-31',
    number: 31,
    section: 'wish',
    location: 'Make a wish — main gilded frame beside the cake',
    label: 'Wish portrait',
    orientation: 'portrait',
    caption: 'Make a wish ♡',
  },
  {
    id: 'faves-photo-32',
    number: 32,
    section: 'wish',
    location: 'Make a wish — small decorative photo on the cake table',
    label: 'Wish decoration',
    orientation: 'landscape',
    caption: 'Sweetest wishes.',
  },
  {
    id: 'faves-photo-33',
    number: 33,
    section: 'wish',
    location: 'Make a wish — scrapbook photo with ribbon',
    label: 'Wish scrapbook print',
    orientation: 'square',
    caption: 'For all your dreams.',
  },
  {
    id: 'faves-photo-34',
    number: 34,
    section: 'finale',
    location: 'Grand finale — large prominent portrait above the question',
    label: 'Finale portrait',
    orientation: 'portrait',
    caption: 'My favourite person ♡',
  },
  {
    id: 'faves-photo-35',
    number: 35,
    section: 'finale',
    location: 'Grand finale — supporting portrait beside Cupid Buddy',
    label: 'Finale + Cupid photo',
    orientation: 'portrait',
    caption: 'Love, delivered.',
  },
  {
    id: 'faves-photo-36',
    number: 36,
    section: 'finale',
    location: 'Grand finale — polaroid pinned to the rose arch',
    label: 'Finale polaroid',
    orientation: 'square',
    caption: 'One of my favourites.',
  },
  {
    id: 'faves-photo-37',
    number: 37,
    section: 'finale',
    location: 'Grand finale — decorative romantic photo with petals',
    label: 'Finale romantic print',
    orientation: 'landscape',
    caption: 'Always you.',
  },
  {
    id: 'faves-photo-38',
    number: 38,
    section: 'finale',
    location: 'Grand finale — final celebration photograph after YES',
    label: 'Final celebration photo',
    orientation: 'landscape',
    caption: 'The best is still ahead ♡',
  },
];

export const PHOTO_MAP: Record<string, PhotoSlotConfig> = Object.fromEntries(
  PHOTO_SLOTS.map((slot) => [slot.id, slot])
);

export const SECTION_ORDER: PhotoSection[] = [
  'welcome',
  'countdown',
  'hero',
  'gifts',
  'letter',
  'memories',
  'wish',
  'finale',
];

export const photosBySection = (section: PhotoSection) =>
  PHOTO_SLOTS.filter((slot) => slot.section === section);

export const getPhoto = (id: string): PhotoSlotConfig => {
  const slot = PHOTO_MAP[id];
  if (!slot) throw new Error(`Unknown photo slot: ${id}`);
  return slot;
};
