import { useCallback } from 'react';
import { Platform } from 'react-native';

export function useSoundEffect() {
  const playSound = useCallback(async (soundUri: string) => {
    if (Platform.OS === 'web') {
      try {
        const audio = new Audio(soundUri);
        await audio.play();
      } catch (error) {
        console.error('Error playing sound in web fallback:', error);
      }
    } else {
      console.warn('Sound playback is unavailable on native until expo-av is reinstalled.');
    }
  }, []);

  const playSpeech = useCallback(async (text: string) => {
    if (Platform.OS === 'web') {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 1;
        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('Error with speech synthesis:', error);
      }
    }
  }, []);

  return { playSound, playSpeech };
}
