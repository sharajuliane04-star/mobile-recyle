import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { SOFT } from '@/constants/soft-theme';

export default function SplashScreenView() {
  const scale = useRef(new Animated.Value(0.85)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 6, tension: 70, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [scale, opacity]);

  return (
    <View style={styles.screen}>
      <Animated.View style={{ alignItems: 'center', transform: [{ scale }], opacity }}>
        <View style={styles.logoCircle}>
          <Text style={{ fontSize: 40 }}>♻️</Text>
        </View>
        <Text style={styles.title}>RecyclePals</Text>
        <Text style={styles.tagline}>Setor sampah, dapat poin, selamatkan bumi</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: SOFT.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: SOFT.mintLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: SOFT.mint,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: SOFT.ink,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 13,
    color: SOFT.muted,
    textAlign: 'center',
  },
});
