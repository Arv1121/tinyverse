import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, FontSize, Spacing, Radius } from '../constants/theme';

type TabId = 'index' | 'alphabet' | 'stories' | 'rewards';

const TABS: { id: TabId; label: string; emoji: string; icon: string; route: string; color: string }[] = [
  { id: 'index',   label: 'Home',    emoji: '🏡', icon: '🏠', route: '/', color: Colors.purple600 },
  { id: 'alphabet',label: 'Learn',   emoji: '🎓', icon: '📚', route: '/alphabet', color: Colors.teal600 },
  { id: 'stories', label: 'Stories', emoji: '📖', icon: '✨', route: '/stories', color: Colors.amber600 },
  { id: 'rewards', label: 'Rewards', emoji: '🎁', icon: '🏆', route: '/rewards', color: Colors.green600 },
];

const NAV_GRADIENT_BG = '#ffffff';

type Props = {
  active: TabId;
};

function NavItem({ tab, isActive, onPress }: { tab: typeof TABS[0]; isActive: boolean; onPress: () => void }) {
  const scale = useRef(new Animated.Value(isActive ? 1.06 : 1)).current;

  return (
    <TouchableOpacity
      key={tab.id}
      onPress={() => {
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.12, duration: 100, useNativeDriver: true }),
          Animated.timing(scale, { toValue: isActive ? 1.06 : 1, duration: 150, useNativeDriver: true }),
        ]).start();
        onPress();
      }}
      activeOpacity={0.8}
      style={styles.navItemWrapper}
    >
      <Animated.View style={[styles.navItem, { transform: [{ scale }] }, isActive && styles.navItemActive]}>
        <View style={[styles.iconBubble, isActive && { backgroundColor: tab.color, shadowColor: tab.color }]} />
        <Text style={[styles.navEmoji, isActive && styles.navEmojiActive]}>{tab.emoji}</Text>
        <Text style={[styles.navLabel, isActive ? styles.navLabelActive : styles.navLabelInactive]}>
          {tab.label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

export function BottomNav({ active }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.nav, { paddingBottom: insets.bottom + Spacing.three }]}> 
      <View style={styles.navContainer}>
        {TABS.map(tab => (
          <NavItem
            key={tab.id}
            tab={tab}
            isActive={tab.id === active}
            onPress={() => router.push(tab.route as any)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: NAV_GRADIENT_BG,
    paddingTop: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 10,
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  navItemWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  navItem: {
    width: '92%',
    borderRadius: Radius.xl,
    paddingVertical: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  navItemActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 6,
  },
  iconBubble: {
    width: 46,
    height: 46,
    borderRadius: 26,
    backgroundColor: 'rgba(243,244,246,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  navEmoji: {
    fontSize: 24,
  },
  navEmojiActive: {
    fontSize: 26,
  },
  navLabel: {
    marginTop: 2,
    textAlign: 'center',
  },
  navLabelActive: {
    color: '#111827',
    fontWeight: '800',
    fontSize: FontSize.xs,
  },
  navLabelInactive: {
    color: Colors.slate400,
    fontWeight: '700',
    fontSize: FontSize.xs,
  },
});
