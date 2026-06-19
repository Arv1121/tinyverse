import { useCallback } from 'react';
import * as Speech from 'expo-speech';

export function usePhoneticSound() {
  const playPhonetic = useCallback((letter: string, word: string, exampleText: string) => {
    const phrase = `${letter}, ${word}. ${exampleText}.`;
    Speech.speak(phrase, { language: 'en-US', pitch: 1.2, rate: 0.85, onError: err => console.error('Speech error:', err) });
  }, []);

  const playWord = useCallback((word: string) => {
    Speech.speak(word, { language: 'en-US', pitch: 1.1, rate: 0.9, onError: err => console.error('Speech error:', err) });
  }, []);

  return { playPhonetic, playWord };
}
