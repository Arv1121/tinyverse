import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

type Props = {
  visible: boolean;
  message?: string;
  stars?: number;
};

export function CelebrationBurst({ visible, message = '🎉 Amazing!', stars = 10 }: Props) {
  const scale  = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale,  { toValue: 1, useNativeDriver: true, tension: 80, friction: 6 }),
        Animated.timing(opacity,{ toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 80 }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scale,  { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(opacity,{ toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 20, duration: 150, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  return (
    <Animated.View style={[
      styles.container,
      { transform: [{ scale }, { translateY }], opacity },
    ]}>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.stars}>+{stars} ⭐</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignSelf: 'center',
    top: '40%',
    backgroundColor: 'rgba(0,0,0,0.82)',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 4,
    zIndex: 100,
  },
  message: { color: '#fff', fontSize: 20, fontWeight: '900' },
  stars:   { color: '#fbbf24', fontSize: 18, fontWeight: '800' },
});
