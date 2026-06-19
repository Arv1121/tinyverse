import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, Radius, FontSize } from '../constants/theme';
import { useChildProgress } from '@/hooks/use-child-progress';

const WORDS = ['CAT', 'DOG', 'SUN', 'BUS', 'MAP', 'RED', 'HOP', 'NET', 'JAR', 'CUP'];
const KEYBOARD_ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['Z','X','C','V','B','N','M','⌫'],
];

export default function TypingScreen() {
  const insets = useSafeAreaInsets();
  const { state, addTypingScore } = useChildProgress();
  const [wordIndex, setWordIndex] = useState(0);
  const [typed, setTyped] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [correct, setCorrect] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const starScale = useRef(new Animated.Value(0)).current;
  const shakeX = useRef(new Animated.Value(0)).current;

  const currentWord = WORDS[wordIndex % WORDS.length];

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setGameOver(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const handleKey = (key: string) => {
    if (gameOver || correct) return;
    if (key === '⌫') {
      setTyped(t => t.slice(0, -1));
      return;
    }
    if (typed.length >= currentWord.length) return;
    const next = [...typed, key];
    setTyped(next);
    if (next.length === currentWord.length) {
      if (next.join('') === currentWord) {
        setCorrect(true);
        setScore(s => s + 10);
        addTypingScore(10);
        Animated.sequence([
          Animated.spring(starScale, { toValue: 1.3, useNativeDriver: true, tension: 80 }),
          Animated.spring(starScale, { toValue: 1, useNativeDriver: true }),
        ]).start(() => {
          setTimeout(() => {
            setTyped([]);
            setCorrect(false);
            setWordIndex(i => i + 1);
            Animated.timing(starScale, { toValue: 0, duration: 100, useNativeDriver: true }).start();
          }, 800);
        });
      } else {
        Animated.sequence([
          Animated.timing(shakeX, { toValue: 10,  duration: 60, useNativeDriver: true }),
          Animated.timing(shakeX, { toValue: -10, duration: 60, useNativeDriver: true }),
          Animated.timing(shakeX, { toValue: 6,   duration: 60, useNativeDriver: true }),
          Animated.timing(shakeX, { toValue: 0,   duration: 60, useNativeDriver: true }),
        ]).start(() => setTyped([]));
      }
    }
  };

  const restart = () => {
    setTyped([]); setScore(0); setTimeLeft(30);
    setGameOver(false); setCorrect(false); setWordIndex(0);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setGameOver(true); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const timerColor = timeLeft > 15 ? Colors.green600 : timeLeft > 7 ? Colors.amber600 : '#ef4444';

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Typing Game ⌨️</Text>
        <View style={styles.scoreChip}><Text style={styles.scoreText}>⭐ {score}</Text></View>
      </View>

      {/* Timer bar */}
      <View style={styles.timerBar}>
        <View style={[styles.timerFill, { width: `${(timeLeft / 30) * 100}%`, backgroundColor: timerColor }]} />
      </View>
      <Text style={[styles.timerText, { color: timerColor }]}>{timeLeft}s</Text>

      {gameOver ? (
        <View style={styles.gameOverCard}>
          <Text style={styles.gameOverEmoji}>🎉</Text>
          <Text style={styles.gameOverTitle}>Time's Up!</Text>
          <Text style={styles.gameOverScore}>You scored {score} stars!</Text>
          <Text style={styles.gameOverSub}>Words completed: {wordIndex}</Text>
          <TouchableOpacity style={styles.playAgainBtn} onPress={restart}>
            <Text style={styles.playAgainText}>🔄 Play Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Word display */}
          <View style={styles.wordSection}>
            <Text style={styles.wordHint}>Type this word:</Text>
            <Animated.View style={[styles.wordRow, { transform: [{ translateX: shakeX }] }]}>
              {currentWord.split('').map((letter, i) => {
                const typedLetter = typed[i];
                const isCorrect = typedLetter === letter;
                const isWrong = typedLetter && !isCorrect;
                return (
                  <View key={i} style={[
                    styles.letterBox,
                    typedLetter && (isCorrect ? styles.letterBoxCorrect : styles.letterBoxWrong),
                    correct && styles.letterBoxAll,
                    !typedLetter && i === typed.length && styles.letterBoxCurrent,
                  ]}>
                    <Text style={[styles.letterBoxText, typedLetter && { color: '#fff' }]}>
                      {typedLetter || letter}
                    </Text>
                  </View>
                );
              })}
            </Animated.View>
            {correct && (
              <Animated.Text style={[styles.correctMsg, { transform: [{ scale: starScale }] }]}>
                ⭐ +10 Correct!
              </Animated.Text>
            )}
          </View>

          {/* Keyboard */}
          <View style={styles.keyboard}>
            {KEYBOARD_ROWS.map((row, ri) => (
              <View key={ri} style={styles.keyRow}>
                {row.map(key => (
                  <TouchableOpacity
                    key={key}
                    style={[styles.key, key === '⌫' && styles.keyBackspace]}
                    onPress={() => handleKey(key)}
                    activeOpacity={0.65}
                  >
                    <Text style={[styles.keyText, key === '⌫' && styles.keyBackspaceText]}>{key}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#ecfdf5' },
  header: {
    backgroundColor: Colors.green600,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.four, paddingVertical: Spacing.three,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { color: '#fff', fontSize: 18, fontWeight: '800' },
  headerTitle: { color: '#fff', fontSize: FontSize.xl, fontWeight: '800' },
  scoreChip: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: Radius.full, paddingHorizontal: Spacing.three, paddingVertical: Spacing.one },
  scoreText: { color: '#fff', fontSize: FontSize.sm, fontWeight: '800' },

  timerBar: { height: 6, backgroundColor: Colors.slate200, marginHorizontal: Spacing.four, borderRadius: Radius.full, marginTop: Spacing.three, overflow: 'hidden' },
  timerFill: { height: 6, borderRadius: Radius.full },
  timerText: { textAlign: 'center', fontSize: FontSize.md, fontWeight: '800', marginTop: Spacing.one },

  wordSection: { alignItems: 'center', paddingVertical: Spacing.six, gap: Spacing.four },
  wordHint: { color: Colors.slate500, fontSize: FontSize.md, fontWeight: '700' },
  wordRow: { flexDirection: 'row', gap: Spacing.two },
  letterBox: {
    width: 54, height: 62, borderRadius: Radius.lg,
    backgroundColor: '#fff', borderWidth: 2.5, borderColor: Colors.green400,
    alignItems: 'center', justifyContent: 'center',
  },
  letterBoxCurrent: { borderColor: Colors.green600, borderWidth: 3 },
  letterBoxCorrect: { backgroundColor: Colors.green600, borderColor: Colors.green600 },
  letterBoxWrong: { backgroundColor: '#ef4444', borderColor: '#ef4444' },
  letterBoxAll: { backgroundColor: Colors.green500, borderColor: Colors.green500 },
  letterBoxText: { fontSize: FontSize.xxl, fontWeight: '900', color: Colors.navy },
  correctMsg: { color: Colors.green600, fontSize: FontSize.xl, fontWeight: '900' },

  keyboard: { paddingHorizontal: Spacing.two, gap: Spacing.two, paddingBottom: Spacing.five },
  keyRow: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.one },
  key: {
    minWidth: 30, height: 44, borderRadius: Radius.md,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: Spacing.two,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2,
  },
  keyBackspace: { minWidth: 44, backgroundColor: Colors.slate200 },
  keyText: { fontSize: FontSize.md, fontWeight: '800', color: Colors.navy },
  keyBackspaceText: { fontSize: FontSize.sm },

  gameOverCard: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.three, padding: Spacing.six,
  },
  gameOverEmoji: { fontSize: 72 },
  gameOverTitle: { color: Colors.navy, fontSize: FontSize.xxxl, fontWeight: '900' },
  gameOverScore: { color: Colors.green600, fontSize: FontSize.xl, fontWeight: '800' },
  gameOverSub: { color: Colors.slate500, fontSize: FontSize.md },
  playAgainBtn: {
    backgroundColor: Colors.green600, borderRadius: Radius.xl,
    paddingHorizontal: Spacing.eight, paddingVertical: Spacing.four,
    shadowColor: Colors.green600, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 4,
  },
  playAgainText: { color: '#fff', fontSize: FontSize.lg, fontWeight: '800' },
});
