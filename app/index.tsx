import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, Radius, FontSize, BottomNavHeight, Modules } from '../constants/theme';
import { BottomNav } from '@/components/bottom-nav';
import { useChildProgress } from '@/hooks/use-child-progress';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Star component ────────────────────────────────────────────
function Star({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) {
  const opacity = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 1200 + delay * 200, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 1200 + delay * 200, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View
      style={{
        position: 'absolute', left: x, top: y,
        width: size, height: size, borderRadius: size / 2,
        backgroundColor: '#fff', opacity,
      }}
    />
  );
}

// ─── Stars background ──────────────────────────────────────────
const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * SCREEN_WIDTH,
  y: Math.random() * 320,
  size: Math.random() * 2.5 + 0.8,
  delay: Math.random() * 5,
}));

const BUBBLES = [
  { id: 'b1', x: 28,  y: 120, size: 110, color: Colors.yellow, opacity: 0.18 },
  { id: 'b2', x: 220, y: 60,  size: 80,  color: Colors.lightBlue, opacity: 0.12 },
  { id: 'b3', x: 150, y: 260, size: 140, color: Colors.coral, opacity: 0.14 },
  { id: 'b4', x: 300, y: 180, size: 90,  color: Colors.mint, opacity: 0.16 },
];

const QUICK_ACTIONS = [
  { id: 'alphabet', title: 'Letters', subtitle: 'ABC practice', emoji: '🔤', route: '/alphabet', color: Colors.purple600 },
  { id: 'phonics', title: 'Phonics', subtitle: 'Sound fun', emoji: '🎵', route: '/phonics', color: Colors.teal600 },
  { id: 'stories', title: 'Stories', subtitle: 'Magic tales', emoji: '📖', route: '/stories', color: Colors.amber600 },
  { id: 'rewards', title: 'Rewards', subtitle: 'Earn stars', emoji: '🏆', route: '/rewards', color: Colors.green600 },
];

// ─── Module card ───────────────────────────────────────────────
function ModuleCard({ module }: { module: typeof Modules[number] }) {
  const scale = useRef(new Animated.Value(1)).current;
  const onPress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.93, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start(() => router.push(module.route));
  };
  return (
    <Animated.View style={[styles.moduleCard, { transform: [{ scale }] }]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={[styles.moduleCardInner, { backgroundColor: module.gradientStart }]}
      >
        <Text style={styles.moduleEmoji}>{module.emoji}</Text>
        <Text style={styles.moduleTitle}>{module.title}</Text>
        <Text style={styles.moduleSub}>{module.subtitle}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Home Screen ───────────────────────────────────────────────

// ─── Home Screen ───────────────────────────────────────────────
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { state } = useChildProgress();
  const [time, setTime] = useState(new Date());
  const mascotBounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000);
    Animated.loop(
      Animated.sequence([
        Animated.timing(mascotBounce, { toValue: -8, duration: 1000, useNativeDriver: true }),
        Animated.timing(mascotBounce, { toValue: 0,  duration: 1000, useNativeDriver: true }),
      ])
    ).start();
    return () => clearInterval(t);
  }, []);

  const hour = time.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const greetingEmoji = hour < 12 ? '🌅' : hour < 17 ? '☀️' : '🌙';
  const lessonsDone = [
    state.progress.alphabetDone > 0,
    state.progress.phonicsDone > 0,
    state.progress.storiesRead > 0,
  ].filter(Boolean).length;
  const progressPercent = (lessonsDone / 3) * 100;

  return (
    <View style={styles.root}>
      {/* Sky background */}
      <View style={styles.skyBg}>
        {STARS.map(s => <Star key={s.id} {...s} />)}
        {BUBBLES.map(b => (
          <View
            key={b.id}
            style={[styles.skyBubble, {
              left: b.x,
              top: b.y,
              width: b.size,
              height: b.size,
              backgroundColor: b.color,
              opacity: b.opacity,
            }]}
          />
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + Spacing.four }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}! {greetingEmoji}</Text>
            <Text style={styles.childName}>Hello, {state.name}! 👋</Text>
            <Text style={styles.childAgeGroup}>Age group: {state.ageGroup}</Text>
          </View>
          <TouchableOpacity style={styles.parentBtn} onPress={() => router.push('/parent')}>
            <Text style={styles.parentBtnText}>👨‍👩‍👧 Parent</Text>
          </TouchableOpacity>
        </View>

        {/* Streak */}
        <View style={styles.streakBadge}>
          <Text style={styles.streakText}>🔥 {state.streakDays} day streak — amazing!</Text>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Today's mission</Text>
          <Text style={styles.heroSub}>Play one fun lesson and collect stars to unlock stickers.</Text>
          <TouchableOpacity style={styles.heroAction} onPress={() => router.push('/stories')} activeOpacity={0.85}>
            <Text style={styles.heroActionText}>Start Story Time</Text>
          </TouchableOpacity>
        </View>

        {/* Mascot + bubble */}
        <View style={styles.mascotRow}>
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>Let's learn something new today! 🚀</Text>
          </View>
          <Animated.View style={[styles.mascotCircle, { transform: [{ translateY: mascotBounce }] }]}>
            <Text style={styles.mascotEmoji}>🦉</Text>
          </Animated.View>
        </View>

        {/* Daily progress */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>TODAY'S GOAL — 3 LESSONS</Text>
            <Text style={styles.progressCount}>{lessonsDone} / 3</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${Math.max(15, progressPercent)}%` }]} />
          </View>
          <View style={styles.starsRow}>
            <Text style={styles.starIcon}>⭐</Text>
            <Text style={styles.starIcon}>⭐</Text>
            <Text style={[styles.starIcon, { opacity: 0.3 }]}>⭐</Text>
          </View>
        </View>

        {/* Section title */}
        <Text style={styles.sectionTitle}>What do you want to learn?</Text>

        <View style={styles.actionRow}>
          {QUICK_ACTIONS.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[styles.actionCard, { backgroundColor: item.color + '15', borderColor: item.color + '30' }]}
              onPress={() => router.push(item.route)}
              activeOpacity={0.85}
            >
              <Text style={styles.actionEmoji}>{item.emoji}</Text>
              <Text style={styles.actionTitle}>{item.title}</Text>
              <Text style={styles.actionSub}>{item.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Pick a learning adventure</Text>
        <View style={styles.modulesGrid}>
          {Modules.map(mod => <ModuleCard key={mod.id} module={mod} />)}
        </View>

        {/* Bottom padding for nav */}
        <View style={{ height: BottomNavHeight + Spacing.four }} />
      </ScrollView>

      <BottomNav active="index" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  skyBg: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.sky1,
  },
  skyBubble: {
    position: 'absolute',
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 8,
  },

  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.four,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.three,
  },
  greeting: { color: 'rgba(255,255,255,0.8)', fontSize: FontSize.sm, fontWeight: '700' },
  childName: { color: '#fff', fontSize: FontSize.xxxl, fontWeight: '900', marginTop: 4 },
  childAgeGroup: { color: 'rgba(255,255,255,0.8)', fontSize: FontSize.xs, marginTop: 3 },
  parentBtn: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
  },
  parentBtnText: { color: '#fff', fontSize: FontSize.xs, fontWeight: '700' },

  streakBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,200,50,0.15)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderWidth: 1,
    borderColor: 'rgba(255,200,50,0.4)',
    marginBottom: Spacing.four,
  },
  streakText: { color: '#ffc832', fontSize: FontSize.sm, fontWeight: '700' },
  heroCard: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: Radius.xl,
    padding: Spacing.four,
    marginBottom: Spacing.four,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  heroTitle: { color: '#fff', fontSize: FontSize.lg, fontWeight: '900', marginBottom: Spacing.one },
  heroSub: { color: 'rgba(255,255,255,0.8)', fontSize: FontSize.sm, lineHeight: 20, marginBottom: Spacing.three },
  heroAction: {
    backgroundColor: '#fff',
    borderRadius: Radius.full,
    paddingVertical: Spacing.two,
    alignItems: 'center',
  },
  heroActionText: { color: Colors.purple700, fontSize: FontSize.sm, fontWeight: '900' },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  actionCard: {
    width: '48%',
    borderRadius: Radius.xl,
    padding: Spacing.four,
    borderWidth: 1,
    marginBottom: Spacing.two,
  },
  actionEmoji: { fontSize: 28, marginBottom: Spacing.two },
  actionTitle: { color: Colors.slate900, fontSize: FontSize.sm, fontWeight: '900', marginBottom: 4 },
  actionSub: { color: Colors.slate500, fontSize: FontSize.xs, lineHeight: 18 },

  mascotRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginBottom: Spacing.four,
    gap: Spacing.two,
  },
  speechBubble: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: Radius.lg,
    borderBottomRightRadius: Radius.sm,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    flex: 1,
  },
  speechText: { color: '#fff', fontSize: FontSize.sm, fontWeight: '600' },
  mascotCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: Colors.yellow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 10,
  },
  mascotEmoji: { fontSize: 40 },

  progressCard: {
    backgroundColor: '#ffffff15',
    borderRadius: Radius.xl,
    padding: Spacing.four,
    marginBottom: Spacing.five,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.two },
  progressLabel: { color: 'rgba(255,255,255,0.6)', fontSize: FontSize.xs, fontWeight: '700', letterSpacing: 0.5 },
  progressCount: { color: Colors.yellow, fontSize: FontSize.sm, fontWeight: '800' },
  progressBarBg: { backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: Radius.full, height: 10 },
  progressBarFill: {
    height: 10, borderRadius: Radius.full,
    backgroundColor: Colors.yellow,
  },
  starsRow: { flexDirection: 'row', gap: Spacing.one, marginTop: Spacing.two },
  starIcon: { fontSize: 18 },

  sectionTitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: FontSize.lg,
    fontWeight: '800',
    marginBottom: Spacing.three,
  },

  modulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },

  moduleCard: {
    width: (SCREEN_WIDTH - Spacing.four * 2 - Spacing.three) / 2,
    borderRadius: Radius.xl,
    overflow: 'hidden',
  },
  moduleCardInner: {
    padding: Spacing.four,
    borderRadius: Radius.xl,
    gap: Spacing.one,
    minHeight: 132,
    justifyContent: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 10,
  },
  moduleEmoji: { fontSize: 36, marginBottom: Spacing.one },
  moduleTitle: { color: '#fff', fontSize: FontSize.md, fontWeight: '900', letterSpacing: 0.4 },
  moduleSub: { color: 'rgba(255,255,255,0.92)', fontSize: FontSize.xs, fontWeight: '700' },

  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(26,10,51,0.92)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingTop: Spacing.two,
    ...Platform.select({
      ios: { backdropFilter: 'blur(20px)' },
    }),
  },
  navItem: { flex: 1, alignItems: 'center', gap: 2, paddingVertical: Spacing.one },
  navEmoji: { fontSize: 22 },
  navLabel: { color: 'rgba(255,255,255,0.6)', fontSize: FontSize.xs, fontWeight: '700' },
  navLabelActive: { color: Colors.yellow },
  navDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.yellow },
});
