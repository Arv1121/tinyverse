import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ModuleProgress = {
  alphabetDone: number;
  phonicsDone: number;
  typingScore: number;
  storiesRead: number;
};

export type StoryItem = {
  id: string;
  title: string;
  theme: string;
  emoji: string;
  duration: string;
  date: string;
  preview: string;
  content: string;
};

export type AgeGroup = '3-4' | '5-6' | '7-8';

export type ChildState = {
  name: string;
  age: number;
  ageGroup: AgeGroup;
  stars: number;
  streakDays: number;
  progress: ModuleProgress;
  savedStories: StoryItem[];
};

const STORAGE_KEY = '@tinyverse_child_state';

export const DEFAULT_STATE: ChildState = {
  name: 'Adved',
  age: 5,
  ageGroup: '5-6',
  stars: 248,
  streakDays: 7,
  progress: {
    alphabetDone: 14,
    phonicsDone: 2,
    typingScore: 60,
    storiesRead: 3,
  },
  savedStories: [
    {
      id: '1',
      title: "Leo's Big Jungle Adventure",
      theme: 'jungle',
      emoji: '🦁',
      duration: '2 mins',
      date: 'Yesterday',
      preview: 'Leo the lion set off into the jungle one sunny morning...',
      content: 'Leo the lion set off into the jungle one sunny morning. He made friends with a curious monkey and discovered a hidden waterfall. At the end, he learned that kindness makes every adventure better.',
    },
    {
      id: '2',
      title: 'Nova Finds a New Planet',
      theme: 'space',
      emoji: '🚀',
      duration: '3 mins',
      date: '2 days ago',
      preview: 'Brave astronaut Nova blasted off into the starry night...',
      content: 'Brave astronaut Nova blasted off into the starry night. She explored a shiny new planet and made friends with gentle space creatures. Nova learned that curiosity leads to big discoveries.',
    },
  ],
};

type ProgressContextValue = {
  state: ChildState;
  setAgeGroup: (group: AgeGroup) => void;
  completeAlphabetLesson: () => void;
  completePhonicsLesson: () => void;
  addTypingScore: (points: number) => void;
  saveStory: (story: StoryItem) => void;
};

const ChildProgressContext = createContext<ProgressContextValue | undefined>(undefined);

export function ChildProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ChildState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(value => {
        if (value) {
          const parsed = JSON.parse(value) as ChildState;
          setState(parsed);
        }
      })
      .catch(() => {})
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [hydrated, state]);

  const completeAlphabetLesson = useCallback(() => {
    setState(s => ({
      ...s,
      stars: s.stars + 10,
      progress: {
        ...s.progress,
        alphabetDone: Math.min(s.progress.alphabetDone + 1, 26),
      },
    }));
  }, []);

  const completePhonicsLesson = useCallback(() => {
    setState(s => ({
      ...s,
      stars: s.stars + 8,
      progress: {
        ...s.progress,
        phonicsDone: Math.min(s.progress.phonicsDone + 1, 8),
      },
    }));
  }, []);

  const addTypingScore = useCallback((points: number) => {
    setState(s => ({
      ...s,
      stars: s.stars + points,
      progress: {
        ...s.progress,
        typingScore: s.progress.typingScore + points,
      },
    }));
  }, []);

  const setAgeGroup = useCallback((ageGroup: AgeGroup) => {
    setState(s => ({
      ...s,
      ageGroup,
    }));
  }, []);

  const saveStory = useCallback((story: StoryItem) => {
    setState(s => ({
      ...s,
      stars: s.stars + 15,
      progress: {
        ...s.progress,
        storiesRead: s.progress.storiesRead + 1,
      },
      savedStories: [story, ...s.savedStories],
    }));
  }, []);

  return (
    <ChildProgressContext.Provider
      value={{ state, setAgeGroup, completeAlphabetLesson, completePhonicsLesson, addTypingScore, saveStory }}
    >
      {children}
    </ChildProgressContext.Provider>
  );
}

export function useChildProgress() {
  const context = useContext(ChildProgressContext);
  if (!context) {
    throw new Error('useChildProgress must be used inside ChildProgressProvider');
  }
  return context;
}
