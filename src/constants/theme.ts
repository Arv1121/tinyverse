import { Platform } from 'react-native';

// ─── Brand Colors ──────────────────────────────────────────────
export const Colors = {
  // Primary purple (main brand)
  purple50:  '#f5f3ff',
  purple100: '#ede9fe',
  purple200: '#ddd6fe',
  purple400: '#a78bfa',
  purple500: '#8b5cf6',
  purple600: '#7c3aed',
  purple700: '#6d28d9',
  purple900: '#2d1b69',

  // Amber (stories)
  amber400:  '#fbbf24',
  amber500:  '#f59e0b',
  amber600:  '#d97706',
  amber700:  '#b45309',
  amber900:  '#78350f',

  // Teal (phonics)
  teal400:   '#22d3ee',
  teal500:   '#06b6d4',
  teal600:   '#0891b2',
  teal700:   '#0e7490',

  // Green (rewards / typing)
  green400:  '#34d399',
  green500:  '#10b981',
  green600:  '#059669',
  green700:  '#047857',

  // Neutrals
  white:     '#ffffff',
  black:     '#000000',
  navy:      '#1a1a2e',
  slate900:  '#0f172a',
  slate700:  '#334155',
  slate500:  '#64748b',
  slate400:  '#94a3b8',
  slate200:  '#e2e8f0',
  slate100:  '#f1f5f9',

  // Night sky
  sky1:      '#1a0533',
  sky2:      '#2d1b69',
  sky3:      '#0f3460',
};

// ─── Spacing ───────────────────────────────────────────────────
export const Spacing = {
  one:   4,
  two:   8,
  three: 12,
  four:  16,
  five:  20,
  six:   24,
  seven: 28,
  eight: 32,
  nine:  36,
  ten:   40,
};

// ─── Border Radius ─────────────────────────────────────────────
export const Radius = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  xxl:  24,
  full: 9999,
};

// ─── Typography ────────────────────────────────────────────────
export const FontSize = {
  xs:    11,
  sm:    13,
  md:    15,
  lg:    17,
  xl:    20,
  xxl:   24,
  xxxl:  30,
  hero:  40,
};

// ─── Layout ────────────────────────────────────────────────────
export const MaxContentWidth = 480;
export const BottomTabInset  = Platform.OS === 'ios' ? 20 : 0;
export const BottomNavHeight = 64;

// ─── Shadow presets ────────────────────────────────────────────
export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  lg: {
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
};

// ─── Module definitions ────────────────────────────────────────
export const Modules = [
  {
    id: 'alphabet',
    title: 'Alphabets',
    subtitle: 'A to Z',
    emoji: '🔤',
    route: '/alphabet' as const,
    gradientStart: '#7c3aed',
    gradientEnd:   '#5b21b6',
  },
  {
    id: 'phonics',
    title: 'Phonics',
    subtitle: 'Sounds & Blends',
    emoji: '🎵',
    route: '/phonics' as const,
    gradientStart: '#0891b2',
    gradientEnd:   '#0369a1',
  },
  {
    id: 'typing',
    title: 'Typing',
    subtitle: 'Tap & Learn',
    emoji: '⌨️',
    route: '/typing' as const,
    gradientStart: '#059669',
    gradientEnd:   '#047857',
  },
  {
    id: 'stories',
    title: 'AI Stories',
    subtitle: 'Magic tales',
    emoji: '📖',
    route: '/stories' as const,
    gradientStart: '#d97706',
    gradientEnd:   '#b45309',
  },
] as const;

// ─── Mascots ───────────────────────────────────────────────────
export const Mascots = [
  { id: 'ollie', name: 'Ollie', emoji: '🦉', role: 'Learning guide', color: '#7c3aed' },
  { id: 'piko',  name: 'Piko',  emoji: '🐼', role: 'Encouragement',  color: '#059669' },
  { id: 'rex',   name: 'Rex',   emoji: '🦖', role: 'Adventure',      color: '#d97706' },
  { id: 'nova',  name: 'Nova',  emoji: '🤖', role: 'Technology',     color: '#0891b2' },
  { id: 'fifi',  name: 'Fifi',  emoji: '🦊', role: 'Curiosity',      color: '#e11d48' },
  { id: 'bobo',  name: 'Bobo',  emoji: '🐻', role: 'Bedtime stories',color: '#92400e' },
] as const;

// ─── Alphabet data ─────────────────────────────────────────────
export const AlphabetData = [
  { letter: 'A', word: 'Apple',    emoji: '🍎', phonics: '"æ" — short A', examples: 'ant, arrow, arm' },
  { letter: 'B', word: 'Ball',     emoji: '⚽', phonics: '"b" sound',     examples: 'bat, bee, bus' },
  { letter: 'C', word: 'Cat',      emoji: '🐱', phonics: '"k" sound',     examples: 'car, cup, cake' },
  { letter: 'D', word: 'Dog',      emoji: '🐶', phonics: '"d" sound',     examples: 'duck, door, drum' },
  { letter: 'E', word: 'Elephant', emoji: '🐘', phonics: '"ɛ" — short E', examples: 'egg, end, elf' },
  { letter: 'F', word: 'Fish',     emoji: '🐟', phonics: '"f" sound',     examples: 'fan, fox, frog' },
  { letter: 'G', word: 'Grapes',   emoji: '🍇', phonics: '"g" sound',     examples: 'goat, gift, gum' },
  { letter: 'H', word: 'Hat',      emoji: '🎩', phonics: '"h" sound',     examples: 'hen, hill, hop' },
  { letter: 'I', word: 'Ice',      emoji: '🧊', phonics: '"ɪ" — short I', examples: 'ink, itch, ill' },
  { letter: 'J', word: 'Jar',      emoji: '🫙', phonics: '"dʒ" sound',    examples: 'jet, job, joy' },
  { letter: 'K', word: 'Kite',     emoji: '🪁', phonics: '"k" sound',     examples: 'key, kid, king' },
  { letter: 'L', word: 'Lion',     emoji: '🦁', phonics: '"l" sound',     examples: 'leg, lip, log' },
  { letter: 'M', word: 'Moon',     emoji: '🌙', phonics: '"m" sound',     examples: 'map, mud, milk' },
  { letter: 'N', word: 'Nest',     emoji: '🪹', phonics: '"n" sound',     examples: 'net, nap, nod' },
  { letter: 'O', word: 'Orange',   emoji: '🍊', phonics: '"ɒ" — short O', examples: 'ox, off, odd' },
  { letter: 'P', word: 'Penguin',  emoji: '🐧', phonics: '"p" sound',     examples: 'pig, pen, pot' },
  { letter: 'Q', word: 'Queen',    emoji: '👸', phonics: '"kw" sound',    examples: 'quiz, quit' },
  { letter: 'R', word: 'Rabbit',   emoji: '🐰', phonics: '"r" sound',     examples: 'red, rug, run' },
  { letter: 'S', word: 'Sun',      emoji: '☀️', phonics: '"s" sound',     examples: 'sad, sit, sock' },
  { letter: 'T', word: 'Tiger',    emoji: '🐯', phonics: '"t" sound',     examples: 'tap, ten, top' },
  { letter: 'U', word: 'Umbrella', emoji: '☂️', phonics: '"ʌ" — short U', examples: 'up, us, urn' },
  { letter: 'V', word: 'Violin',   emoji: '🎻', phonics: '"v" sound',     examples: 'van, vet, vine' },
  { letter: 'W', word: 'Whale',    emoji: '🐋', phonics: '"w" sound',     examples: 'web, wig, wax' },
  { letter: 'X', word: 'Xylophone',emoji: '🎵', phonics: '"z" or "ks"',  examples: 'fox, box, six' },
  { letter: 'Y', word: 'Yarn',     emoji: '🧶', phonics: '"j" sound',     examples: 'yes, yet, yam' },
  { letter: 'Z', word: 'Zebra',    emoji: '🦓', phonics: '"z" sound',     examples: 'zip, zoo, zap' },
] as const;

// ─── Story themes ──────────────────────────────────────────────
export const StoryThemes = [
  { id: 'jungle',    label: 'Jungle',   emoji: '🌴', color: '#059669' },
  { id: 'space',     label: 'Space',    emoji: '🚀', color: '#7c3aed' },
  { id: 'ocean',     label: 'Ocean',    emoji: '🌊', color: '#0891b2' },
  { id: 'dragons',   label: 'Dragons',  emoji: '🐉', color: '#d97706' },
  { id: 'friendship',label: 'Friends',  emoji: '🤝', color: '#e11d48' },
  { id: 'bedtime',   label: 'Bedtime',  emoji: '🌙', color: '#6d28d9' },
] as const;
