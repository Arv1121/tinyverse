import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Mascots } from '../constants/theme';

type MascotId = typeof Mascots[number]['id'];

type Props = {
  mascotId?: MascotId;
  message: string;
  size?: 'sm' | 'md' | 'lg';
};

const SIZE_MAP = { sm: 56, md: 72, lg: 88 };
const FONT_MAP = { sm: 28, md: 36, lg: 44 };

export function MascotBubble({ mascotId = 'ollie', message, size = 'md' }: Props) {
  const mascot = Mascots.find(m => m.id === mascotId) ?? Mascots[0];
  const bounceY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceY, { toValue: -8, duration: 900, useNativeDriver: true }),
        Animated.timing(bounceY, { toValue: 0,  duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const circleSize = SIZE_MAP[size];
  const emojiSize  = FONT_MAP[size];

  return (
    <View style={styles.row}>
      <View style={[styles.bubble, { borderBottomRightRadius: 4 }]}>
        <Text style={styles.bubbleText}>{message}</Text>
      </View>
      <Animated.View style={[
        styles.mascotCircle,
        { width: circleSize, height: circleSize, borderRadius: circleSize / 2, backgroundColor: mascot.color },
        { transform: [{ translateY: bounceY }] },
      ]}>
        <Text style={{ fontSize: emojiSize }}>{mascot.emoji}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    gap: 8,
  },
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  bubbleText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  mascotCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
    flexShrink: 0,
  },
});
