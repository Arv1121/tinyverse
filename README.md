# TinyVerse AI 🌟

> A safe, magical AI-powered learning app for kids aged 3–9.
> Built with Expo 56 · React Native 0.85 · Expo Router · Reanimated 4

---

## Quick Start

```bash
npm install
npx expo start
```

Press `w` for web, `a` for Android, `i` for iOS.

---

## Project Structure

```
tinyverse-ai/
├── app/                        # Expo Router screens
│   ├── _layout.tsx             # Root layout (GestureHandler + SafeArea + Stack)
│   ├── index.tsx               # Home screen (night sky, mascot, module grid)
│   ├── alphabet.tsx            # A–Z learning with phonics + letter grid
│   ├── phonics.tsx             # Sound blending game + lesson list
│   ├── typing.tsx              # Timed typing game with on-screen keyboard
│   ├── stories.tsx             # AI story generator + story library
│   ├── rewards.tsx             # Stars, streak, badges, activity log
│   └── parent.tsx              # Parent dashboard (progress, settings, upgrade)
│
├── src/
│   ├── constants/
│   │   └── theme.ts            # Colors, spacing, radius, fonts, module/mascot data
│   ├── components/
│   │   ├── bottom-nav.tsx      # Shared tab bar component
│   │   ├── mascot-bubble.tsx   # Animated mascot with speech bubble
│   │   └── celebration-burst.tsx # Star/correct answer celebration overlay
│   └── hooks/
│       ├── use-theme.ts        # Dark/light mode colors
│       └── use-child-progress.ts # Stars, streak, module progress state
│
├── babel.config.js             # Module resolver (@/* alias) + Reanimated plugin
├── metro.config.js             # Metro bundler config
├── reanimated.config.js        # Reduced motion override
├── app.json                    # Expo config
└── tsconfig.json               # Strict TypeScript + path aliases
```

---

## Screens

| Screen | Route | Color | Description |
|--------|-------|-------|-------------|
| Home | `/` | Deep purple night sky | Mascot, greeting, daily progress, 4 module cards |
| Alphabet | `/alphabet` | Purple | A–Z grid, featured letter card, phonics, play audio |
| Phonics | `/phonics` | Teal | Sound blending game, lesson list |
| Typing | `/typing` | Green | 30-second timed word typing game |
| Stories | `/stories` | Amber | AI story generator, theme picker, story library |
| Rewards | `/rewards` | Green | Stars total, week streak, badges, recent activity |
| Parent | `/parent` | Navy | Progress charts, settings, upgrade CTA |

---

## AI Story Integration (Phase 2)

In `app/stories.tsx`, replace the mock `handleGenerate` with a real OpenAI call:

```typescript
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gpt-4o',
    messages: [{
      role: 'user',
      content: `Write a safe, fun 2-minute ${selectedTheme} story for a ${childAge}-year-old named ${childName}. 
                Keep it age-appropriate, educational, and end with a moral lesson. 
                Use simple words. Max 200 words.`,
    }],
    max_tokens: 300,
  }),
});
```

---

## Firebase Setup (Phase 2)

Install:
```bash
npx expo install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore
```

Collections:
- `users/{uid}` — parent account
- `users/{uid}/children/{childId}` — child profiles
- `users/{uid}/children/{childId}/progress` — learning progress
- `stories/{storyId}` — generated stories (cached)

---

## Voice / Audio (Phase 2)

For letter pronunciation in `alphabet.tsx`:
```bash
npx expo install expo-speech
```

```typescript
import * as Speech from 'expo-speech';
Speech.speak(`${letter}. ${word}.`, { language: 'en-US', rate: 0.7, pitch: 1.2 });
```

---

## Mascots

| Name | Emoji | Role |
|------|-------|------|
| Ollie 🦉 | Default | Learning guide |
| Piko 🐼 | Gentle | Encouragement |
| Rex 🦖 | Energetic | Adventure mode |
| Nova 🤖 | Tech | Typing/coding |
| Fifi 🦊 | Curious | Phonics puzzles |
| Bobo 🐻 | Calm | Bedtime stories |

---

## Deployment

**Web (Vercel)**
```bash
npx expo export --platform web
# Upload /dist folder to Vercel
```

**Android (Play Store)**
```bash
eas build --platform android
eas submit --platform android
```

**iOS (App Store)**
```bash
eas build --platform ios
eas submit --platform ios
```

---

## MVP Checklist

- [x] Home screen with night sky + mascot
- [x] Alphabet learning (A–Z, phonics, letter grid)
- [x] Phonics screen with blend game
- [x] Typing game (30-second challenge)
- [x] AI Stories screen (theme picker + mock generation)
- [x] Rewards screen (stars, streak, badges)
- [x] Parent dashboard (progress, settings, upgrade)
- [ ] Firebase auth + child profiles
- [ ] Real OpenAI story generation
- [ ] expo-speech for letter pronunciation
- [ ] ElevenLabs voice narration for stories
- [ ] Push notifications (daily goal reminders)
- [ ] Offline support
- [ ] Hindi language support
