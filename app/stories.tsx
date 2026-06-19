import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, Radius, FontSize, BottomNavHeight, StoryThemes } from '../constants/theme';
import { useChildProgress, StoryItem } from '@/hooks/use-child-progress';
import { createFallbackStory, generateStoryFromOpenAI } from '@/utils/openai';
import * as Speech from 'expo-speech';
import { BottomNav } from '@/components/bottom-nav';

const THEME_BG: Record<string, string> = {
  jungle: '#dcfce7',
  space: '#ede9fe',
  ocean: '#dbeafe',
  dragons: '#fef3c7',
  friendship: '#fce7f3',
  bedtime: '#f5f3ff',
};

function StoryCard({ story, onOpen, onPlay }: { story: StoryItem; onOpen: (story: StoryItem) => void; onPlay: (story: StoryItem) => void }) {
  return (
    <TouchableOpacity
      style={styles.storyCard}
      activeOpacity={0.9}
      onPress={() => onOpen(story)}
    >
      <View style={[styles.storyThumb, { backgroundColor: THEME_BG[story.theme] || '#f1f5f9' }]}> 
        <Text style={{ fontSize: 28 }}>{story.emoji}</Text>
      </View>
      <View style={styles.storyInfo}>
        <Text style={styles.storyTitle}>{story.title}</Text>
        <Text style={styles.storyMeta}>🕐 {story.duration} · {story.date}</Text>
        <Text style={styles.storyPreview} numberOfLines={1}>{story.preview}</Text>
      </View>
      <TouchableOpacity style={styles.storyPlayBtn} activeOpacity={0.8} onPress={() => onPlay(story)}>
        <Text style={styles.storyPlayBtnText}>▶ Listen</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function StoriesScreen() {
  const insets = useSafeAreaInsets();
  const { state, saveStory } = useChildProgress();
  const [selectedTheme, setSelectedTheme] = useState('jungle');
  const [isGenerating, setIsGenerating] = useState(false);
  const genBtnScale = useRef(new Animated.Value(1)).current;

  const theme = StoryThemes.find(item => item.id === selectedTheme) || StoryThemes[0];
  const [selectedStory, setSelectedStory] = useState<StoryItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playStory = (story: StoryItem) => {
    if (!story.content) return;
    setIsPlaying(true);
    Speech.speak(story.content, {
      language: 'en-US',
      pitch: 1.05,
      rate: 0.9,
      onDone: () => setIsPlaying(false),
      onStopped: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    });
  };

  const stopStory = () => {
    Speech.stop();
    setIsPlaying(false);
  };

  const handleGenerate = async () => {
    Animated.sequence([
      Animated.timing(genBtnScale, { toValue: 0.95, duration: 80, useNativeDriver: true }),
      Animated.timing(genBtnScale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();

    setIsGenerating(true);
    let storyText = '';

    try {
      storyText = await generateStoryFromOpenAI(theme.label, state.name, state.age, state.ageGroup);
    } catch (error) {
      storyText = createFallbackStory(theme.label, state.name);
      Alert.alert('Offline story created', 'The story was generated locally because no OpenAI key is configured.');
    }

    const newStory: StoryItem = {
      id: `${Date.now()}`,
      title: `${theme.label} Adventure`,
      theme: selectedTheme,
      emoji: theme.emoji,
      duration: '2 mins',
      date: 'Just now',
      preview: `${storyText.slice(0, 90).trim()}...`,
      content: storyText,
    };

    saveStory(newStory);
    setIsGenerating(false);
    Alert.alert('🎉 Story Ready!', 'Your new story has been saved to My Stories.');
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.three }]}> 
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>AI Story Time</Text>
          <Text style={styles.headerSub}>Personalized just for {state.name} ✨</Text>
        </View>
        <View style={styles.starsChip}>
          <Text style={styles.starsChipText}>⭐ {state.stars}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: BottomNavHeight + Spacing.six }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Generator card */}
        <View style={styles.generatorCard}>
          <View style={styles.generatorHeader}>
            <Text style={styles.genLabel}>✨ Create a New Story</Text>
            <Text style={styles.genBadge}>Age {state.age} · {state.ageGroup}</Text>
          </View>
          <Text style={styles.genHint}>Pick a theme for {state.name}&apos;s adventure and tap the magic button.</Text>

          <View style={styles.themesGrid}>
            {StoryThemes.map(themeOption => (
              <TouchableOpacity
                key={themeOption.id}
                style={[
                  styles.themeChip,
                  selectedTheme === themeOption.id && styles.themeChipSelected,
                  selectedTheme === themeOption.id && { backgroundColor: themeOption.color, borderColor: themeOption.color },
                ]}
                onPress={() => setSelectedTheme(themeOption.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.themeEmoji}>{themeOption.emoji}</Text>
                <Text style={[
                  styles.themeLabel,
                  selectedTheme === themeOption.id && styles.themeLabelSelected,
                ]}>
                  {themeOption.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Animated.View style={{ transform: [{ scale: genBtnScale }] }}>
            <TouchableOpacity
              style={styles.genBtn}
              onPress={handleGenerate}
              activeOpacity={0.9}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={styles.genBtnText}>Creating your story...</Text>
                </>
              ) : (
                <Text style={styles.genBtnText}>🪄 Create My Story!</Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Saved stories */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>My Stories</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {state.savedStories.map(story => (
          <StoryCard key={story.id} story={story} onOpen={setSelectedStory} onPlay={playStory} />
        ))}

        <Modal visible={!!selectedStory} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>{selectedStory?.title}</Text>
              <Text style={styles.modalMeta}>Age {state.age} · {state.ageGroup} · {selectedStory?.duration}</Text>
              <ScrollView style={styles.modalContent}>
                <Text style={styles.modalText}>{selectedStory?.content}</Text>
              </ScrollView>
              <View style={styles.modalActions}>
                <TouchableOpacity style={[styles.modalButton, styles.modalActionPrimary]} onPress={() => selectedStory && playStory(selectedStory)}>
                  <Text style={styles.modalActionText}>{isPlaying ? 'Playing...' : '▶ Listen'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.modalActionSecondary]} onPress={() => { stopStory(); setSelectedStory(null); }}>
                  <Text style={styles.modalActionTextSecondary}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Bedtime mode banner */}
        <TouchableOpacity style={styles.bedtimeBanner} activeOpacity={0.85}>
          <Text style={styles.bedtimeEmoji}>🌙</Text>
          <View>
            <Text style={styles.bedtimeTitle}>Bedtime Story Mode</Text>
            <Text style={styles.bedtimeSub}>Calm, soothing stories for sleep</Text>
          </View>
          <Text style={styles.bedtimeArrow}>→</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNav active="stories" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff7ed' },
  header: {
    backgroundColor: Colors.amber600,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.five,
    borderBottomLeftRadius: Radius.xxl,
    borderBottomRightRadius: Radius.xxl,
    gap: Spacing.two,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { color: '#fff', fontSize: 18, fontWeight: '800' },
  headerTitle: { color: '#fff', fontSize: FontSize.xl, fontWeight: '800' },
  headerSub: { color: 'rgba(255,255,255,0.75)', fontSize: FontSize.xs, marginTop: 1 },
  starsChip: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  starsChipText: { color: '#fff', fontSize: FontSize.sm, fontWeight: '700' },
  scroll: { flex: 1 },
  content: { padding: Spacing.four, gap: Spacing.four },
  generatorCard: {
    backgroundColor: '#fff',
    borderRadius: Radius.xxl,
    padding: Spacing.four,
    shadowColor: Colors.amber600,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
    gap: Spacing.three,
  },
  genLabel: {
    color: Colors.amber900,
    fontSize: FontSize.xs,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  generatorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  genBadge: {
    backgroundColor: 'rgba(251,191,36,0.16)',
    color: Colors.amber700,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Radius.full,
    fontSize: FontSize.xs,
    fontWeight: '800',
  },
  genHint: { color: Colors.slate700, fontSize: FontSize.sm, fontWeight: '600', marginBottom: Spacing.four },
  themesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two, marginBottom: Spacing.four },
  themeChip: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.two,
    backgroundColor: '#fef3c7',
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderWidth: 1.5,
    borderColor: Colors.amber400,
    minWidth: 120,
    justifyContent: 'center',
  },
  themeChipSelected: {
    shadowColor: Colors.amber600,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 6,
  },
  themeEmoji: { fontSize: 18 },
  themeLabel: { color: Colors.amber900, fontSize: FontSize.sm, fontWeight: '700' },
  themeLabelSelected: { color: '#fff' },
  genBtn: {
    backgroundColor: Colors.amber600,
    borderRadius: Radius.xl,
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.five,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.two,
    shadowColor: Colors.amber600,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  genBtnText: { color: '#fff', fontSize: FontSize.lg, fontWeight: '800' },
  sectionRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  sectionTitle: { color: Colors.navy, fontSize: FontSize.lg, fontWeight: '800' },
  seeAll: { color: Colors.amber600, fontSize: FontSize.sm, fontWeight: '700' },
  storyCard: {
    backgroundColor: '#fff',
    borderRadius: Radius.xl,
    padding: Spacing.four,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  storyThumb: {
    width: 60, height: 60, borderRadius: Radius.lg,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  storyInfo: { flex: 1 },
  storyTitle: { color: Colors.navy, fontSize: FontSize.sm, fontWeight: '800' },
  storyMeta: { color: Colors.slate400, fontSize: FontSize.xs, marginTop: 2 },
  storyPreview: { color: Colors.slate500, fontSize: FontSize.xs, marginTop: 3 },
  storyPlayBtn: {
    backgroundColor: Colors.amber400,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  storyPlayBtnText: { color: Colors.amber900, fontSize: FontSize.sm, fontWeight: '800' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  modalCard: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: Radius.xxl,
    padding: Spacing.four,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 6,
  },
  modalTitle: { color: Colors.navy, fontSize: FontSize.xl, fontWeight: '800' },
  modalMeta: { color: Colors.slate400, fontSize: FontSize.xs, marginTop: Spacing.one },
  modalContent: { marginTop: Spacing.four },
  modalText: { color: Colors.slate700, fontSize: FontSize.sm, lineHeight: 22 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.four, gap: Spacing.three },
  modalButton: {
    flex: 1,
    borderRadius: Radius.xl,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalActionPrimary: { backgroundColor: Colors.amber600 },
  modalActionSecondary: { backgroundColor: Colors.slate100 },
  modalActionText: { color: '#fff', fontSize: FontSize.sm, fontWeight: '800' },
  modalActionTextSecondary: { color: Colors.slate700, fontSize: FontSize.sm, fontWeight: '800' },
  bedtimeBanner: {
    backgroundColor: Colors.purple100,
    borderRadius: Radius.xl,
    padding: Spacing.four,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderWidth: 1.5,
    borderColor: Colors.purple200,
  },
  bedtimeEmoji: { fontSize: 32 },
  bedtimeTitle: { color: Colors.purple700, fontSize: FontSize.md, fontWeight: '800' },
  bedtimeSub: { color: Colors.purple400, fontSize: FontSize.xs, fontWeight: '600', marginTop: 2 },
  bedtimeArrow: { color: Colors.purple600, fontSize: 20, fontWeight: '800', marginLeft: 'auto' },
});
