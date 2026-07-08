import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, Share, StyleSheet, Text, View } from 'react-native';

import { DARK, GREEN, GREEN_DARK, GREEN_LIGHT } from '@/constants/recycle-theme';

const SUMMARY: [string, string][] = [
  ['Kategori', 'Plastik 🧴'],
  ['Berat Aktual', '3.8 kg'],
  ['Nilai Rupiah', 'Rp 3.500'],
];

export default function Selesai() {
  const router = useRouter();
  const scale = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }).start();
    Animated.timing(fade, { toValue: 1, duration: 500, delay: 200, useNativeDriver: true }).start();
  }, [scale, fade]);

  const onShare = () => {
    Share.share({ message: 'Aku baru setor sampah dan dapat +350 Poin di RecyclePals! ♻️' });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <Animated.View style={[styles.iconCircle, { transform: [{ scale }] }]}>
          <Text style={{ fontSize: 52 }}>✅</Text>
        </Animated.View>

        <Animated.View style={{ alignItems: 'center', opacity: fade }}>
          <Text style={styles.title}>SETORAN SELESAI!</Text>
          <Text style={styles.subtitle}>
            Berat aktual sampah telah diverifikasi{'\n'}dan dikonfirmasi oleh kurir.
          </Text>
        </Animated.View>

        <Animated.View style={[styles.summaryCard, { opacity: fade }]}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryHeaderLabel}>POIN DITAMBAHKAN</Text>
            <Text style={styles.summaryPoin}>
              +350 <Text style={styles.summaryPoinUnit}>Poin</Text>
            </Text>
          </View>
          <View style={styles.summaryBody}>
            {SUMMARY.map(([k, v]) => (
              <View key={k} style={styles.summaryRow}>
                <Text style={styles.summaryKey}>{k}</Text>
                <Text style={styles.summaryValue}>{v}</Text>
              </View>
            ))}
            <View style={styles.summaryFooter}>
              <Text style={styles.summaryFooterText}>🔒 Transaksi aman via Firebase Cloud</Text>
            </View>
          </View>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.homeBtn} onPress={() => router.replace('/recycle')}>
          <Text style={styles.homeBtnText}>🏠 Kembali ke Dashboard</Text>
        </Pressable>
        <Pressable style={styles.shareBtn} onPress={onShare}>
          <Text style={styles.shareBtnText}>📤 Bagikan Pencapaian</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 24 },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: GREEN_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 28, fontWeight: '900', color: DARK, marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#888', lineHeight: 22, textAlign: 'center' },
  summaryCard: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: GREEN_LIGHT,
  },
  summaryHeader: {
    backgroundColor: GREEN_LIGHT,
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: GREEN,
    borderStyle: 'dashed',
  },
  summaryHeaderLabel: { fontSize: 12, fontWeight: '700', color: GREEN_DARK, letterSpacing: 1, marginBottom: 6 },
  summaryPoin: { fontSize: 48, fontWeight: '900', color: GREEN },
  summaryPoinUnit: { fontSize: 22 },
  summaryBody: { backgroundColor: '#fff', padding: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryKey: { fontSize: 13, color: '#888' },
  summaryValue: { fontSize: 13, fontWeight: '700', color: DARK },
  summaryFooter: { borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 10 },
  summaryFooterText: { fontSize: 12, color: '#aaa' },
  footer: { padding: 20, paddingBottom: 32, gap: 12 },
  homeBtn: {
    backgroundColor: GREEN,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: GREEN,
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  homeBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  shareBtn: {
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
  },
  shareBtnText: { color: '#888', fontSize: 14, fontWeight: '600' },
});
