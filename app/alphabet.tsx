import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, Dimensions, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AlphabetData, Colors, Spacing, Radius, FontSize, BottomNavHeight } from '../constants/theme';
import { useChildProgress } from '@/hooks/use-child-progress';
import { BottomNav } from '@/components/bottom-nav';
import { usePhoneticSound } from '@/hooks/use-phonetic-sound';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLS = 5;
const CHIP_SIZE = (SCREEN_WIDTH - Spacing.four * 2 - Spacing.two * (COLS - 1)) / COLS;

export default function AlphabetScreen() {
  const insets = useSafeAreaInsets();
  const { state, completeAlphabetLesson } = useChildProgress();
  const [selectedIndex, setSelectedIndex] = useState(Math.min(state.progress.alphabetDone, AlphabetData.length - 1));
  const selected = AlphabetData[selectedIndex];
  const playScale = useRef(new Animated.Value(1)).current;
  const { playPhonetic } = usePhoneticSound();

  React.useEffect(() => {
    setSelectedIndex(Math.min(state.progress.alphabetDone, AlphabetData.length - 1));
  }, [state.progress.alphabetDone]);

  const getLetterStatus = (index: number) => {
    if (index < state.progress.alphabetDone) return 'done';
    if (index === state.progress.alphabetDone) return 'active';
    return 'locked';
  };

  const handlePlay = () => {
    Animated.sequence([
      Animated.timing(playScale, { toValue: 0.88, duration: 80, useNativeDriver: true }),
      Animated.timing(playScale, { toValue: 1.1, duration: 150, useNativeDriver: true }),
      Animated.timing(playScale, { toValue: 1,   duration: 120, useNativeDriver: true }),
    ]).start();
    // Trigger phonetic audio playback
    playPhonetic(selected.letter, selected.word, selected.examples);
  };

  const handleLetterPress = (index: number) => {
    const status = getLetterStatus(index);
    if (status === 'locked') return;
    setSelectedIndex(index);
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.three }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alphabets</Text>
        <View style={styles.starsChip}>
          <Text style={styles.starsChipText}>⭐ {state.stars}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: BottomNavHeight + Spacing.six }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Featured letter card */}
        <View style={styles.featuredCard}>
          <View style={styles.bigLetterBox}>
            <Text style={styles.bigLetter}>{selected.letter}</Text>
            <Text style={styles.bigEmoji}>{selected.emoji}</Text>
          </View>
          <View style={styles.letterDetails}>
            <Text style={styles.letterWord}>{selected.word}</Text>
            <Text style={styles.letterPhonics}>{selected.phonics}</Text>
            <Text style={styles.letterExamples}>{selected.examples}</Text>
          </View>
          <Animated.View style={{ transform: [{ scale: playScale }] }}>
            <TouchableOpacity style={styles.playBtn} onPress={handlePlay}>
              <Text style={styles.playBtnText}>▶</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Practice prompt */}
        <View style={styles.practiceCard}>
          <Text style={styles.practiceLabel}>Say it out loud! 🎤</Text>
          <Text style={styles.practicePrompt}>
            "{selected.letter}" as in {selected.emoji} {selected.word}
          </Text>
        </View>

        {/* All letters grid */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>All Letters</Text>
          <Text style={styles.progressText}>{state.progress.alphabetDone} / 26 done</Text>
        </View>

        <View style={styles.lettersGrid}>
          {AlphabetData.map((item, index) => {
            const status = getLetterStatus(index);
            const isSelected = index === selectedIndex;
            return (
              <TouchableOpacity
                key={item.letter}
                style={[
                  styles.letterChip,
                  status === 'done'   && styles.chipDone,
                  status === 'active' && styles.chipActive,
                  status === 'locked' && styles.chipLocked,
                  isSelected          && styles.chipSelected,
                ]}
                onPress={() => handleLetterPress(index)}
                activeOpacity={status === 'locked' ? 1 : 0.7}
              >
                <Text style={[
                  styles.chipLetter,
                  status === 'done'   && styles.chipLetterDone,
                  status === 'active' && styles.chipLetterActive,
                  status === 'locked' && styles.chipLetterLocked,
                ]}>
                  {status === 'locked' ? '🔒' : item.letter}
                </Text>
                {status === 'done' && <Text style={styles.chipCheck}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        {getLetterStatus(selectedIndex) === 'active' && (
          <TouchableOpacity
            style={styles.completeBtn}
            activeOpacity={0.85}
            onPress={() => {
              completeAlphabetLesson();
            }}
          >
            <Text style={styles.completeBtnText}>✨ Mark "{selected.letter}" complete</Text>
          </TouchableOpacity>
        )}

        {/* Mini quiz prompt */}
        <TouchableOpacity style={styles.quizBtn} activeOpacity={0.85}>
          <Text style={styles.quizBtnText}>🎯 Take a Letter Quiz!</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNav active="alphabet" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.purple50 },

  header: {
    backgroundColor: Colors.lightBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.five,
    borderBottomLeftRadius: Radius.xxl,
    borderBottomRightRadius: Radius.xxl,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { color: '#fff', fontSize: 18, fontWeight: '800' },
  headerTitle: { color: '#fff', fontSize: FontSize.xl, fontWeight: '800' },
  starsChip: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  starsChipText: { color: '#fff', fontSize: FontSize.sm, fontWeight: '700' },

  scroll: { flex: 1 },
  content: { padding: Spacing.four, gap: Spacing.four },

  featuredCard: {
    backgroundColor: '#fff',
    borderRadius: Radius.xxl,
    padding: Spacing.four,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    shadowColor: Colors.purple600,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  bigLetterBox: {
    width: 80, height: 80, borderRadius: Radius.xl,
    backgroundColor: Colors.yellow,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.yellow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.24,
    shadowRadius: 12,
    elevation: 6,
  },
  bigLetter: { color: '#fff', fontSize: 38, fontWeight: '900', lineHeight: 44 },
  bigEmoji: { fontSize: 16, position: 'absolute', bottom: 4, right: 6 },
  letterDetails: { flex: 1 },
  letterWord: { color: Colors.navy, fontSize: FontSize.xl, fontWeight: '800' },
  letterPhonics: { color: Colors.purple600, fontSize: FontSize.sm, fontWeight: '700', marginTop: 2 },
  letterExamples: { color: Colors.slate500, fontSize: FontSize.xs, marginTop: 4 },
  playBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.coral,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.coral,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  playBtnText: { color: '#fff', fontSize: 18 },

  practiceCard: {
    backgroundColor: Colors.lightBlue + '25',
    borderRadius: Radius.xl,
    padding: Spacing.four,
    borderWidth: 1.5,
    borderColor: Colors.lightBlue,
  },
  practiceLabel: { color: Colors.lightBlue, fontSize: FontSize.xs, fontWeight: '700', letterSpacing: 0.5 },
  practicePrompt: { color: Colors.navy, fontSize: FontSize.lg, fontWeight: '800', marginTop: Spacing.one },

  sectionRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  sectionTitle: { color: Colors.navy, fontSize: FontSize.lg, fontWeight: '800' },
  progressText: { color: Colors.purple600, fontSize: FontSize.sm, fontWeight: '700' },

  lettersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  letterChip: {
    width: CHIP_SIZE, height: CHIP_SIZE,
    borderRadius: Radius.md + 2,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  chipDone:     { backgroundColor: Colors.lightBlue },
  chipActive:   { backgroundColor: Colors.purple100, borderWidth: 2, borderColor: Colors.lightBlue },
  chipLocked:   { backgroundColor: Colors.slate100 },
  chipSelected: { borderWidth: 3, borderColor: Colors.yellow },
  chipLetter:   { fontSize: 18, fontWeight: '900' },
  chipLetterDone:   { color: '#fff' },
  chipLetterActive: { color: Colors.lightBlue },
  chipLetterLocked: { fontSize: 14 },
  chipCheck: {
    position: 'absolute', bottom: 2, right: 4,
    color: 'rgba(255,255,255,0.7)', fontSize: 9, fontWeight: '900',
  },
  completeBtn: {
    backgroundColor: Colors.lightBlue,
    borderRadius: Radius.xl,
    padding: Spacing.four,
    alignItems: 'center',
    shadowColor: Colors.lightBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 3,
  },
  completeBtnText: {
    color: '#fff',
    fontSize: FontSize.sm,
    fontWeight: '800',
  },

  quizBtn: {
    backgroundColor: Colors.mint,
    borderRadius: Radius.xl,
    padding: Spacing.four,
    alignItems: 'center',
    shadowColor: Colors.mint,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  quizBtnText: { color: '#fff', fontSize: FontSize.lg, fontWeight: '800' },

  bottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(245,243,255,0.96)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(124,58,237,0.08)',
    paddingTop: Spacing.two,
  },
  navItem: { flex: 1, alignItems: 'center', gap: 2 },
  navEmoji: { fontSize: 22 },
  navLabel: { color: Colors.slate400, fontSize: FontSize.xs, fontWeight: '700' },
  navLabelActive: { color: Colors.yellow },
  navDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.yellow },
});
