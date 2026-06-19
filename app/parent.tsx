import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, Radius, FontSize } from '../constants/theme';
import { useChildProgress, AgeGroup } from '@/hooks/use-child-progress';

const AGE_GROUPS: AgeGroup[] = ['3-4', '5-6', '7-8'];

const BASE_PROGRESS = [
  { module: 'Alphabets', emoji: '🔤', total: 26, color: Colors.purple600 },
  { module: 'Phonics',   emoji: '🎵', total: 8,  color: Colors.teal600   },
  { module: 'Typing',    emoji: '⌨️', total: 100, color: Colors.green600  },
  { module: 'Stories',   emoji: '📖', total: 10, color: Colors.amber600  },
];

const WEEKLY = [40, 60, 80, 55, 90, 70, 0]; // minutes per day Mon-Sun
const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const MAX_MIN = 90;

export default function ParentScreen() {
  const insets = useSafeAreaInsets();
  const { state, setAgeGroup } = useChildProgress();
  const [screenTime, setScreenTime] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [safeMode, setSafeMode] = useState(true);

  const progressData = BASE_PROGRESS.map(item => {
    const done = item.module === 'Alphabets' ? state.progress.alphabetDone
      : item.module === 'Phonics' ? state.progress.phonicsDone
      : item.module === 'Typing' ? state.progress.typingScore
      : item.module === 'Stories' ? state.progress.storiesRead
      : 0;

    return {
      ...item,
      done,
    };
  });

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.three }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Parent Dashboard</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.eight }]}
      >
        {/* Child profile */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>👦</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{state.name}</Text>
            <Text style={styles.profileAge}>Age {state.age} · {state.ageGroup}</Text>
            <Text style={styles.profileStreak}>🔥 {state.streakDays} day streak · ⭐ {state.stars} stars</Text>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.ageGroupCard}>
          <Text style={styles.sectionSubtitle}>Age group for learning</Text>
          <View style={styles.ageGroupRow}>
            {AGE_GROUPS.map(group => (
              <TouchableOpacity
                key={group}
                style={[styles.ageGroupChip, state.ageGroup === group && styles.ageGroupChipActive]}
                onPress={() => setAgeGroup(group)}
                activeOpacity={0.8}
              >
                <Text style={[styles.ageGroupText, state.ageGroup === group && styles.ageGroupTextActive]}>{group}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Time this week */}
        <Text style={styles.sectionTitle}>Time Spent This Week</Text>
        <View style={styles.chartCard}>
          <View style={styles.barChart}>
            {WEEKLY.map((mins, i) => (
              <View key={i} style={styles.barCol}>
                <Text style={styles.barMins}>{mins > 0 ? `${mins}m` : ''}</Text>
                <View style={styles.barBg}>
                  <View style={[
                    styles.barFill,
                    { height: `${(mins / MAX_MIN) * 100}%`, opacity: i === 6 ? 0.3 : 1 },
                  ]} />
                </View>
                <Text style={styles.barLabel}>{DAY_LABELS[i]}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.chartSummary}>Total this week: <Text style={styles.chartBold}>6h 35m</Text></Text>
        </View>

        {/* Module progress */}
        <Text style={styles.sectionTitle}>Learning Progress</Text>
        <View style={styles.progressList}>
          {progressData.map(item => (
            <View key={item.module} style={styles.progressRow}>
              <Text style={styles.progressEmoji}>{item.emoji}</Text>
              <View style={styles.progressInfo}>
                <View style={styles.progressLabelRow}>
                  <Text style={styles.progressModule}>{item.module}</Text>
                  <Text style={[styles.progressPct, { color: item.color }]}> 
                    {item.total > 0 ? `${item.done}/${item.total}` : `${item.done} stories`}
                  </Text>
                </View>
                {item.total > 0 && (
                  <View style={styles.progressBarBg}>
                    <View style={[
                      styles.progressBarFill,
                      { width: `${Math.min(100, (item.done / item.total) * 100)}%`, backgroundColor: item.color },
                    ]} />
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Weak areas */}
        <Text style={styles.sectionTitle}>Areas to Improve</Text>
        <View style={styles.weakCard}>
          <Text style={styles.weakItem}>📌 Short-I phonics sounds (not started)</Text>
          <Text style={styles.weakItem}>📌 Letters O–Z (locked)</Text>
          <Text style={styles.weakItem}>📌 Typing speed below average</Text>
        </View>

        {/* Settings */}
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Screen Time Reminders</Text>
              <Text style={styles.settingDesc}>Alert after 30 min of use</Text>
            </View>
            <Switch
              value={screenTime}
              onValueChange={setScreenTime}
              trackColor={{ true: Colors.purple500 }}
              thumbColor="#fff"
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Daily Goal Notifications</Text>
              <Text style={styles.settingDesc}>Remind Adved to learn daily</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ true: Colors.purple500 }}
              thumbColor="#fff"
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Safe AI Mode</Text>
              <Text style={styles.settingDesc}>Filter all AI-generated content</Text>
            </View>
            <Switch
              value={safeMode}
              onValueChange={setSafeMode}
              trackColor={{ true: Colors.green600 }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Subscription */}
        <TouchableOpacity style={styles.upgradeCard} activeOpacity={0.85}>
          <Text style={styles.upgradeEmoji}>👑</Text>
          <View style={styles.upgradeInfo}>
            <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
            <Text style={styles.upgradeSub}>Unlimited stories · Advanced lessons</Text>
          </View>
          <Text style={styles.upgradeArrow}>→</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.slate100 },

  header: {
    backgroundColor: Colors.navy,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.four, paddingBottom: Spacing.five,
    borderBottomLeftRadius: Radius.xxl, borderBottomRightRadius: Radius.xxl,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { color: '#fff', fontSize: 18, fontWeight: '800' },
  headerTitle: { color: '#fff', fontSize: FontSize.xl, fontWeight: '800' },

  content: { padding: Spacing.four, gap: Spacing.four },

  profileCard: {
    backgroundColor: '#fff', borderRadius: Radius.xxl, padding: Spacing.four,
    flexDirection: 'row', alignItems: 'center', gap: Spacing.three,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  avatarCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: Colors.purple100, alignItems: 'center', justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 36 },
  profileInfo: { flex: 1, gap: 2 },
  profileName: { color: Colors.navy, fontSize: FontSize.xl, fontWeight: '900' },
  profileAge: { color: Colors.slate500, fontSize: FontSize.sm },
  profileStreak: { color: Colors.slate700, fontSize: FontSize.xs, fontWeight: '700', marginTop: 2 },
  ageGroupCard: {
    backgroundColor: '#fff',
    borderRadius: Radius.xl,
    padding: Spacing.four,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    gap: Spacing.two,
  },
  sectionSubtitle: { color: Colors.slate400, fontSize: FontSize.xs, fontWeight: '700' },
  ageGroupRow: { flexDirection: 'row', gap: Spacing.two, flexWrap: 'wrap', marginTop: Spacing.two },
  ageGroupChip: {
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.slate200,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  ageGroupChipActive: {
    backgroundColor: Colors.purple600,
    borderColor: Colors.purple600,
  },
  ageGroupText: { color: Colors.slate500, fontSize: FontSize.sm, fontWeight: '700' },
  ageGroupTextActive: { color: '#fff' },
  editBtn: {
    backgroundColor: Colors.purple100, borderRadius: Radius.full,
    paddingHorizontal: Spacing.three, paddingVertical: Spacing.one,
  },
  editBtnText: { color: Colors.purple600, fontSize: FontSize.sm, fontWeight: '700' },

  sectionTitle: { color: Colors.navy, fontSize: FontSize.lg, fontWeight: '800' },

  chartCard: {
    backgroundColor: '#fff', borderRadius: Radius.xxl, padding: Spacing.four,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
    gap: Spacing.three,
  },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', height: 100, gap: Spacing.two },
  barCol: { flex: 1, alignItems: 'center', gap: Spacing.one },
  barMins: { color: Colors.slate400, fontSize: 9, fontWeight: '700' },
  barBg: { flex: 1, width: '100%', backgroundColor: Colors.slate100, borderRadius: Radius.sm, overflow: 'hidden', justifyContent: 'flex-end' },
  barFill: { width: '100%', backgroundColor: Colors.purple500, borderRadius: Radius.sm },
  barLabel: { color: Colors.slate500, fontSize: FontSize.xs, fontWeight: '700' },
  chartSummary: { color: Colors.slate500, fontSize: FontSize.sm, textAlign: 'center' },
  chartBold: { color: Colors.navy, fontWeight: '800' },

  progressList: {
    backgroundColor: '#fff', borderRadius: Radius.xxl, padding: Spacing.four,
    gap: Spacing.three,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  progressEmoji: { fontSize: 24, width: 32 },
  progressInfo: { flex: 1, gap: Spacing.one },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  progressModule: { color: Colors.navy, fontSize: FontSize.sm, fontWeight: '700' },
  progressPct: { fontSize: FontSize.sm, fontWeight: '800' },
  progressBarBg: { height: 7, backgroundColor: Colors.slate100, borderRadius: Radius.full, overflow: 'hidden' },
  progressBarFill: { height: 7, borderRadius: Radius.full },

  weakCard: {
    backgroundColor: '#fff', borderRadius: Radius.xl, padding: Spacing.four, gap: Spacing.two,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  weakItem: { color: Colors.slate700, fontSize: FontSize.sm, fontWeight: '600' },

  settingsCard: {
    backgroundColor: '#fff', borderRadius: Radius.xxl, padding: Spacing.four,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: Spacing.two },
  settingLabel: { color: Colors.navy, fontSize: FontSize.sm, fontWeight: '700' },
  settingDesc: { color: Colors.slate400, fontSize: FontSize.xs, marginTop: 2 },
  divider: { height: 1, backgroundColor: Colors.slate200, marginVertical: Spacing.one },

  upgradeCard: {
    backgroundColor: Colors.purple600, borderRadius: Radius.xxl, padding: Spacing.four,
    flexDirection: 'row', alignItems: 'center', gap: Spacing.three,
    shadowColor: Colors.purple600, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 4,
  },
  upgradeEmoji: { fontSize: 32 },
  upgradeInfo: { flex: 1 },
  upgradeTitle: { color: '#fff', fontSize: FontSize.md, fontWeight: '800' },
  upgradeSub: { color: 'rgba(255,255,255,0.7)', fontSize: FontSize.xs, marginTop: 2 },
  upgradeArrow: { color: '#fff', fontSize: 22, fontWeight: '800' },
});
