import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { BG, DARK, GREEN, GREEN_DARK, GREEN_LIGHT } from '@/constants/recycle-theme';

export default function Tracking() {
  const router = useRouter();
  const [eta, setEta] = useState(12);
  const truckX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setInterval(() => setEta((p) => Math.max(0, p - 1)), 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(truckX, { toValue: 10, duration: 1000, useNativeDriver: true }),
        Animated.timing(truckX, { toValue: -10, duration: 1000, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [truckX]);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Lacak Posisi Kurir</Text>
      </View>

      <View style={styles.mapArea}>
        <View style={styles.mapGrid}>
          {Array.from({ length: 4 }).map((_, r) => (
            <View key={r} style={styles.mapRow}>
              {Array.from({ length: 5 }).map((_, c) => (
                <View
                  key={c}
                  style={[
                    styles.mapBlock,
                    (r + c) % 2 === 0 ? styles.mapBlockA : styles.mapBlockB,
                  ]}
                />
              ))}
            </View>
          ))}
        </View>
        <View style={styles.roadHorizontal} />
        <View style={styles.roadVertical} />

        <View style={styles.pin}>
          <Text style={{ fontSize: 24 }}>📍</Text>
        </View>

        <Animated.View style={[styles.truck, { transform: [{ translateX: truckX }] }]}>
          <View style={styles.truckGlow} />
          <Text style={{ fontSize: 28 }}>🚛</Text>
        </Animated.View>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View>
              <Text style={styles.infoLabel}>ESTIMASI PENJEMPUTAN</Text>
              <Text style={styles.infoValue}>{eta} Menit Lagi</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.infoLabel}>ARMADA</Text>
              <Text style={styles.fleetName}>Truk Mini 04</Text>
              <Text style={styles.fleetPlate}>B 1234 GH</Text>
            </View>
          </View>
          <View style={styles.banner}>
            <Text style={{ color: GREEN, fontSize: 18 }}>✅</Text>
            <View>
              <Text style={styles.bannerTitle}>Posisi Truk: Menuju Jl. Bojongsoang Raya</Text>
              <Text style={styles.bannerSub}>Update terakhir: barusan</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={styles.chatBtn}
          onPress={() => Alert.alert('Chat Driver', 'Fitur chat akan segera hadir.')}>
          <Text style={styles.chatBtnText}>💬 Chat Driver</Text>
        </Pressable>
        <Pressable style={styles.confirmBtn} onPress={() => router.push('/recycle/selesai')}>
          <Text style={styles.confirmBtnText}>✅ Konfirmasi Selesai</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    paddingTop: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: GREEN_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: { fontSize: 18, color: GREEN_DARK, fontWeight: '700' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: DARK },
  mapArea: {
    height: 220,
    backgroundColor: '#e8f0e8',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  mapGrid: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'space-evenly' },
  mapRow: { flexDirection: 'row', justifyContent: 'space-evenly' },
  mapBlock: { width: 50, height: 24, borderRadius: 4 },
  mapBlockA: { backgroundColor: '#d4e6d4' },
  mapBlockB: { backgroundColor: '#c8dcc8' },
  roadHorizontal: { position: 'absolute', left: 0, right: 0, top: '48%', height: 26, backgroundColor: '#e8f0e8', opacity: 0.9 },
  roadVertical: { position: 'absolute', top: 0, bottom: 0, left: '48%', width: 26, backgroundColor: '#e8f0e8', opacity: 0.9 },
  pin: {
    position: 'absolute',
    right: '30%',
    top: '28%',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(239,68,68,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  truck: {
    alignSelf: 'center',
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  truckGlow: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: GREEN,
    opacity: 0.15,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginTop: -20,
    gap: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  infoLabel: { fontSize: 11, color: '#999', fontWeight: '600', marginBottom: 4 },
  infoValue: { fontSize: 26, fontWeight: '800', color: DARK },
  fleetName: { fontSize: 18, fontWeight: '700', color: DARK },
  fleetPlate: { fontSize: 11, color: GREEN, marginTop: 2 },
  banner: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: GREEN_LIGHT,
    borderRadius: 12,
    padding: 12,
  },
  bannerTitle: { fontSize: 13, fontWeight: '600', color: GREEN_DARK },
  bannerSub: { fontSize: 12, color: '#888', marginTop: 2 },
  footer: { flexDirection: 'row', gap: 12, padding: 20, paddingBottom: 32 },
  chatBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: GREEN,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  chatBtnText: { color: GREEN, fontSize: 14, fontWeight: '700' },
  confirmBtn: {
    flex: 2,
    padding: 14,
    borderRadius: 16,
    backgroundColor: DARK,
    alignItems: 'center',
  },
  confirmBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
