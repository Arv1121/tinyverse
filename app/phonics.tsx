import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, Radius, FontSize, BottomNavHeight } from '../constants/theme';
import { useChildProgress } from '@/hooks/use-child-progress';
import { BottomNav } from '@/components/bottom-nav';
import { usePhoneticSound } from '@/hooks/use-phonetic-sound';

const PHONICS_LESSONS = [
  { id: 'short-a', label: 'Short A', example: 'cat, bat, hat', emoji: '🐱' },
  { id: 'short-e', label: 'Short E', example: 'bed, red, ten', emoji: '🛏️' },
  { id: 'short-i', label: 'Short I', example: 'pig, dig, big', emoji: '🐷' },
  { id: 'short-o', label: 'Short O', example: 'hot, dot, pot', emoji: '🔥' },
  { id: 'short-u', label: 'Short U', example: 'bug, mug, hug', emoji: '🐛' },
  { id: 'blend-cl', label: 'Blend: CL', example: 'clap, clock, clay', emoji: '👏' },
  { id: 'blend-gr', label: 'Blend: GR', example: 'grab, grape, green', emoji: '🍇' },
  { id: 'blend-st', label: 'Blend: ST', example: 'stop, star, step', emoji: '⭐' },
];

const BLEND_GAME_LETTERS = ['C', 'A', 'T'];

export default function PhonicsScreen() {
  const insets = useSafeAreaInsets();
  const { state, completePhonicsLesson } = useChildProgress();
  const [selected, setSelected] = useState<string[]>([]);
  const [correct, setCorrect] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const correctScale = useRef(new Animated.Value(1)).current;
  const { playWord } = usePhoneticSound();

  const handleLetterTap = (letter: string) => {
    if (correct) return;
    const next = [...selected, letter];
    setSelected(next);
    
    // Play the letter sound
    playWord(letter);
    
    if (next.length === BLEND_GAME_LETTERS.length) {
      if (next.join('') === 'CAT') {
        setCorrect(true);
        if (!correct) {
          completePhonicsLesson();
        }
        // Play success sound
        playWord('cat');
        Animated.spring(correctScale, { toValue: 1.15, useNativeDriver: true, tension: 80 }).start(() =>
          Animated.spring(correctScale, { toValue: 1, useNativeDriver: true }).start()
        );
      } else {
        Animated.sequence([
          Animated.timing(shakeAnim, { toValue: 10,  duration: 60,  useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -10, duration: 60,  useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 6,   duration: 60,  useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 0,   duration: 60,  useNativeDriver: true }),
        ]).start(() => setSelected([]));
      }
    }
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.three }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Phonics</Text>
        <View style={styles.starsChip}><Text style={styles.starsChipText}>⭐ {state.stars}</Text></View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: BottomNavHeight + Spacing.six }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Mini blend game */}
        <View style={styles.gameCard}>
          <Text style={styles.gameLabel}>🎮 SOUND BLENDING GAME</Text>
          <Text style={styles.gamePrompt}>Tap the letters to spell the word:</Text>
          <Text style={styles.gameClue}>🐱 This animal says meow...</Text>

          <Animated.View style={[styles.answerRow, { transform: [{ translateX: shakeAnim }] }]}>
            {BLEND_GAME_LETTERS.map((_, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.answerSlot,
                  selected[i] && styles.answerSlotFilled,
                  correct && styles.answerSlotCorrect,
                  { transform: correct ? [{ scale: correctScale }] : [] },
                ]}
              >
                <Text style={[styles.answerLetter, correct && styles.answerLetterCorrect]}>
                  {selected[i] || ''}
                </Text>
              </Animated.View>
            ))}
          </Animated.View>

          {correct && <Text style={styles.correctMsg}>🎉 Amazing! C-A-T spells CAT!</Text>}

          <View style={styles.letterButtons}>
            {['C', 'A', 'T', 'B', 'D'].map(l => (
              <TouchableOpacity
                key={l}
                style={[styles.letterBtn, selected.includes(l) && styles.letterBtnUsed]}
                onPress={() => handleLetterTap(l)}
                activeOpacity={0.8}
              >
                <Text style={[styles.letterBtnText, selected.includes(l) && styles.letterBtnTextUsed]}>
                  {l}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {selected.length > 0 && !correct && (
            <TouchableOpacity onPress={() => setSelected([])} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>↩ Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Lessons list */}
        <Text style={styles.sectionTitle}>All Phonics Lessons</Text>
        {PHONICS_LESSONS.map((lesson, index) => {
          const done = index < state.progress.phonicsDone;
          return (
            <TouchableOpacity key={lesson.id} style={styles.lessonRow} activeOpacity={0.8}>
              <View style={[styles.lessonIcon, done && styles.lessonIconDone]}>
                <Text style={{ fontSize: 22 }}>{lesson.emoji}</Text>
              </View>
              <View style={styles.lessonInfo}>
                <Text style={styles.lessonLabel}>{lesson.label}</Text>
                <Text style={styles.lessonExample}>{lesson.example}</Text>
              </View>
              <View style={[styles.lessonStatus, done && styles.lessonStatusDone]}>
                <Text style={[styles.lessonStatusText, done && styles.lessonStatusTextDone]}>
                  {done ? '✓' : '▶'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <BottomNav active="alphabet" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#e0f2fe' },
  header: {
    backgroundColor: Colors.teal600,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.four, paddingBottom: Spacing.five,
    borderBottomLeftRadius: Radius.xxl, borderBottomRightRadius: Radius.xxl,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { color: '#fff', fontSize: 18, fontWeight: '800' },
  headerTitle: { color: '#fff', fontSize: FontSize.xl, fontWeight: '800' },
  starsChip: { backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: Radius.full, paddingHorizontal: Spacing.three, paddingVertical: Spacing.one },
  starsChipText: { color: '#fff', fontSize: FontSize.sm, fontWeight: '700' },

  scroll: { flex: 1 },
  content: { padding: Spacing.four, gap: Spacing.four },

  gameCard: {
    backgroundColor: '#fff', borderRadius: Radius.xxl, padding: Spacing.four,
    gap: Spacing.three,
    shadowColor: Colors.teal600, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 4,
  },
  gameLabel: { color: Colors.teal700, fontSize: FontSize.xs, fontWeight: '800', letterSpacing: 0.5 },
  gamePrompt: { color: Colors.navy, fontSize: FontSize.md, fontWeight: '700' },
  gameClue: { color: Colors.slate500, fontSize: FontSize.sm },
  answerRow: { flexDirection: 'row', gap: Spacing.three, justifyContent: 'center', paddingVertical: Spacing.two },
  answerSlot: {
    width: 56, height: 64, borderRadius: Radius.lg, borderWidth: 2.5,
    borderColor: Colors.teal500, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0fdfa',
  },
  answerSlotFilled: { backgroundColor: Colors.teal500, borderStyle: 'solid' },
  answerSlotCorrect: { backgroundColor: Colors.green500, borderColor: Colors.green500 },
  answerLetter: { fontSize: FontSize.xxl, fontWeight: '900', color: Colors.teal700 },
  answerLetterCorrect: { color: '#fff' },
  correctMsg: { color: Colors.green600, fontSize: FontSize.md, fontWeight: '800', textAlign: 'center' },
  letterButtons: { flexDirection: 'row', gap: Spacing.two, justifyContent: 'center', flexWrap: 'wrap' },
  letterBtn: {
    width: 52, height: 52, borderRadius: Radius.md,
    backgroundColor: Colors.teal100 ?? '#ccfbf1', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.teal500,
  },
  letterBtnUsed: { backgroundColor: Colors.slate100, borderColor: Colors.slate200, opacity: 0.5 },
  letterBtnText: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.teal700 },
  letterBtnTextUsed: { color: Colors.slate400 },
  clearBtn: { alignSelf: 'center' },
  clearBtnText: { color: Colors.teal600, fontSize: FontSize.sm, fontWeight: '700' },

  sectionTitle: { color: Colors.navy, fontSize: FontSize.lg, fontWeight: '800' },
  lessonRow: {
    backgroundColor: '#fff', borderRadius: Radius.xl, padding: Spacing.three,
    flexDirection: 'row', alignItems: 'center', gap: Spacing.three,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  lessonIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#e0f2fe', alignItems: 'center', justifyContent: 'center' },
  lessonIconDone: { backgroundColor: '#d1fae5' },
  lessonInfo: { flex: 1 },
  lessonLabel: { color: Colors.navy, fontSize: FontSize.md, fontWeight: '800' },
  lessonExample: { color: Colors.slate500, fontSize: FontSize.xs, marginTop: 2 },
  lessonStatus: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.slate100, alignItems: 'center', justifyContent: 'center',
  },
  lessonStatusDone: { backgroundColor: Colors.green600 },
  lessonStatusText: { color: Colors.slate400, fontSize: FontSize.sm, fontWeight: '800' },
  lessonStatusTextDone: { color: '#fff' },

  bottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row',
    backgroundColor: 'rgba(224,242,254,0.96)', borderTopWidth: 1, borderTopColor: 'rgba(8,145,178,0.08)', paddingTop: Spacing.two,
  },
  navItem: { flex: 1, alignItems: 'center', gap: 2 },
  navEmoji: { fontSize: 22 },
  navLabel: { color: Colors.slate400, fontSize: FontSize.xs, fontWeight: '700' },
});
