import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, Radius, FontSize, BottomNavHeight } from '../constants/theme';
import { useChildProgress } from '@/hooks/use-child-progress';
import { BottomNav } from '@/components/bottom-nav';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
// First 6 done, today = S (index 5), tomorrow locked
const getDayStatus = (i: number) => i < 5 ? 'done' : i === 5 ? 'today' : 'future';

const BADGES = [
  { id: 'alpha',  emoji: '🔤', name: 'Alphabet Star',  desc: 'Learned A-N',        earned: true  },
  { id: 'phonics',emoji: '🎵', name: 'Phonics Pro',    desc: 'Completed phonics',   earned: true  },
  { id: 'story',  emoji: '📖', name: 'Story Teller',   desc: '5 stories needed',    earned: false },
  { id: 'typing', emoji: '⌨️', name: 'Speed Typist',   desc: 'Complete typing',     earned: false },
  { id: 'streak', emoji: '🔥', name: 'Streak Master',  desc: '14 days needed',      earned: false },
  { id: 'star',   emoji: '⭐', name: 'Star Collector', desc: 'Get 500 stars',        earned: false },
];

const RECENT_ACTIVITY = [
  { emoji: '🔤', text: 'Learned letters A-E',   stars: '+10', time: '2h ago'    },
  { emoji: '🎵', text: 'Phonics: C-A-T blends', stars: '+8',  time: 'Yesterday' },
  { emoji: '📖', text: 'Read Jungle Adventure', stars: '+15', time: '2 days ago' },
];

export default function RewardsScreen() {
  const insets = useSafeAreaInsets();
  const { state } = useChildProgress();
  const starScale = useRef(new Animated.Value(0.8)).current;
  const starOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(starScale, { toValue: 1, useNativeDriver: true, tension: 80, friction: 8 }),
      Animated.timing(starOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.three }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Rewards 🏆</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: BottomNavHeight + Spacing.six }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Stars summary */}
        <Animated.View style={[styles.starCard, { transform: [{ scale: starScale }], opacity: starOpacity }]}>
          <Text style={styles.starCardEmoji}>⭐</Text>
          <Text style={styles.starCount}>{state.stars}</Text>
          <Text style={styles.starLabel}>Total Stars Earned</Text>

          <View style={styles.rewardSummary}>
            <Text style={styles.rewardTitle}>Next prize at 500 stars</Text>
            <View style={styles.rewardProgressBg}>
              <View style={[styles.rewardProgressFill, { width: `${Math.min(100, (state.stars / 500) * 100)}%` }]} />
            </View>
          </View>
          <TouchableOpacity style={styles.claimBtn} activeOpacity={0.85}>
            <Text style={styles.claimBtnText}>Visit Prize Shop</Text>
          </TouchableOpacity>

          {/* Week streak */}
          <View style={styles.weekRow}>
            {DAYS.map((day, i) => {
              const status = getDayStatus(i);
              return (
                <View
                  key={i}
                  style={[
                    styles.dayChip,
                    status === 'done'   && styles.dayDone,
                    status === 'today'  && styles.dayToday,
                    status === 'future' && styles.dayFuture,
                  ]}
                >
                  <Text style={[
                    styles.dayText,
                    status === 'done'   && styles.dayTextDone,
                    status === 'today'  && styles.dayTextToday,
                    status === 'future' && styles.dayTextFuture,
                  ]}>{day}</Text>
                </View>
              );
            })}
          </View>
          <Text style={styles.streakLine}>🔥 {state.streakDays} day streak — keep going!</Text>
        </Animated.View>

        {/* Badges */}
        <Text style={styles.sectionTitle}>Badges</Text>
        <View style={styles.badgesGrid}>
          {BADGES.map(badge => (
            <View
              key={badge.id}
              style={[styles.badgeCard, !badge.earned && styles.badgeCardLocked]}
            >
              <Text style={[styles.badgeEmoji, !badge.earned && { opacity: 0.35 }]}>
                {badge.earned ? badge.emoji : '🔒'}
              </Text>
              <Text style={[styles.badgeName, !badge.earned && styles.badgeNameLocked]}>
                {badge.name}
              </Text>
              <Text style={[styles.badgeDesc, !badge.earned && styles.badgeDescLocked]}>
                {badge.earned ? '✓ Earned' : badge.desc}
              </Text>
            </View>
          ))}
        </View>

        {/* Recent activity */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          {RECENT_ACTIVITY.map((item, i) => (
            <View key={i} style={styles.activityRow}>
              <View style={styles.activityIcon}>
                <Text style={{ fontSize: 20 }}>{item.emoji}</Text>
              </View>
              <Text style={styles.activityText}>{item.text}</Text>
              <View style={styles.activityRight}>
                <Text style={styles.activityStars}>{item.stars} ⭐</Text>
                <Text style={styles.activityTime}>{item.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <BottomNav active="rewards" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#ecfdf5' },

  header: {
    backgroundColor: Colors.green600,
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

  scroll: { flex: 1 },
  content: { padding: Spacing.four, gap: Spacing.four },

  starCard: {
    backgroundColor: '#fff',
    borderRadius: Radius.xxl,
    padding: Spacing.five,
    alignItems: 'center',
    shadowColor: Colors.green600,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
    gap: Spacing.two,
  },
  starCardEmoji: { fontSize: 48 },
  starCount: { fontSize: FontSize.hero, fontWeight: '900', color: Colors.navy },
  starLabel: { color: Colors.slate500, fontSize: FontSize.sm },
  weekRow: { flexDirection: 'row', gap: Spacing.one + 2, marginTop: Spacing.two },
  dayChip: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  dayDone:   { backgroundColor: Colors.green600 },
  dayToday:  { backgroundColor: '#d1fae5', borderWidth: 2, borderColor: Colors.green600 },
  dayFuture: { backgroundColor: Colors.slate100 },
  dayText:   { fontSize: FontSize.xs, fontWeight: '800' },
  dayTextDone:   { color: '#fff' },
  dayTextToday:  { color: Colors.green600 },
  dayTextFuture: { color: Colors.slate400 },
  streakLine: { color: Colors.green600, fontSize: FontSize.sm, fontWeight: '700' },
  rewardSummary: { width: '100%', gap: Spacing.two, marginTop: Spacing.four },
  rewardTitle: { color: Colors.slate700, fontSize: FontSize.sm, fontWeight: '700' },
  rewardProgressBg: {
    backgroundColor: Colors.slate100,
    borderRadius: Radius.full,
    height: 10,
    overflow: 'hidden',
    marginTop: Spacing.one,
  },
  rewardProgressFill: {
    height: 10,
    borderRadius: Radius.full,
    backgroundColor: Colors.green600,
  },
  claimBtn: {
    marginTop: Spacing.four,
    backgroundColor: Colors.green600,
    borderRadius: Radius.full,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  claimBtnText: {
    color: '#fff',
    fontSize: FontSize.sm,
    fontWeight: '900',
  },

  sectionTitle: { color: Colors.navy, fontSize: FontSize.lg, fontWeight: '800' },

  badgesGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.three,
  },
  badgeCard: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: Radius.xl,
    padding: Spacing.four,
    alignItems: 'center',
    gap: Spacing.one,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  badgeCardLocked: { opacity: 0.65 },
  badgeEmoji: { fontSize: 36 },
  badgeName: { color: Colors.navy, fontSize: FontSize.sm, fontWeight: '800', textAlign: 'center' },
  badgeNameLocked: { color: Colors.slate500 },
  badgeDesc: { color: Colors.green600, fontSize: FontSize.xs, fontWeight: '700' },
  badgeDescLocked: { color: Colors.slate400 },

  activityList: { gap: Spacing.two },
  activityRow: {
    backgroundColor: '#fff',
    borderRadius: Radius.xl,
    padding: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  activityIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.slate100,
    alignItems: 'center', justifyContent: 'center',
  },
  activityText: { flex: 1, color: Colors.navy, fontSize: FontSize.sm, fontWeight: '700' },
  activityRight: { alignItems: 'flex-end', gap: 2 },
  activityStars: { color: Colors.amber600, fontSize: FontSize.sm, fontWeight: '800' },
  activityTime: { color: Colors.slate400, fontSize: FontSize.xs },

  bottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(236,253,245,0.96)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(5,150,105,0.08)',
    paddingTop: Spacing.two,
  },
  navItem: { flex: 1, alignItems: 'center', gap: 2 },
  navEmoji: { fontSize: 22 },
  navLabel: { color: Colors.slate400, fontSize: FontSize.xs, fontWeight: '700' },
  navLabelActive: { color: Colors.green600 },
  navDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.green600 },
});
