import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BG, DARK, GREEN, GREEN_LIGHT } from '@/constants/recycle-theme';
import { useRecycleHistory } from '@/contexts/recycle-history-context';

export default function RecycleDashboard() {
  const router = useRouter();
  const scale = useRef(new Animated.Value(0.7)).current;
  const { history, totalPoin, loading } = useRecycleHistory();

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.subtleText}>Selamat datang kembali</Text>
            <Text style={styles.greeting}>Hi, Juli! ✨</Text>
          </View>
          <View style={styles.bell}>
            <Text style={{ fontSize: 18 }}>🔔</Text>
            <View style={styles.bellDot} />
          </View>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>SALDO TABUNGAN</Text>
          <View style={styles.balanceRow}>
            <Animated.Text style={[styles.balanceValue, { transform: [{ scale }] }]}>
              {totalPoin.toLocaleString('id-ID')}
            </Animated.Text>
            <Text style={styles.balanceUnit}>Poin</Text>
          </View>
          <Text style={styles.balanceSub}>
            Setara nilai: <Text style={styles.balanceSubStrong}>Rp {(totalPoin * 10).toLocaleString('id-ID')}</Text>
          </Text>
        </View>

        <Pressable style={styles.ctaButton} onPress={() => router.push('/recycle/form')}>
          <Text style={{ fontSize: 20 }}>♻️</Text>
          <Text style={styles.ctaText}>Setor Sampah Sekarang</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Aktivitas Terakhir</Text>
        {loading ? (
          <View style={styles.emptyCard}>
            <ActivityIndicator color={GREEN} />
            <Text style={[styles.emptyText, { marginTop: 8 }]}>Memuat aktivitas...</Text>
          </View>
        ) : history.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Belum ada aktivitas. Yuk setor sampah pertamamu!</Text>
          </View>
        ) : (
          <View style={styles.listCard}>
            {history.map((item, i) => (
              <View
                key={item.id}
                style={[styles.listItem, i < history.length - 1 && styles.listItemDivider]}>
                <View style={styles.listIcon}>
                  <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.listLabel}>{item.label}</Text>
                  <Text style={styles.listTime}>{item.time}</Text>
                </View>
                <Text style={styles.listPoin}>+{item.poin}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG },
  scrollContent: { padding: 20, paddingBottom: 40, gap: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  subtleText: { fontSize: 13, color: '#888' },
  greeting: { fontSize: 22, fontWeight: '700', color: DARK, marginTop: 2 },
  bell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: GREEN_LIGHT,
    borderWidth: 2,
    borderColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F08A9E',
    borderWidth: 2,
    borderColor: '#fff',
  },
  balanceCard: {
    backgroundColor: DARK,
    borderRadius: 24,
    padding: 24,
    elevation: 4,
    shadowColor: DARK,
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  balanceLabel: { fontSize: 12, color: 'rgba(255,255,255,0.6)', letterSpacing: 1.5, marginBottom: 4 },
  balanceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  balanceValue: { fontSize: 42, fontWeight: '800', color: '#fff' },
  balanceUnit: { fontSize: 18, color: GREEN, fontWeight: '700' },
  balanceSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  balanceSubStrong: { color: '#fff', fontWeight: '700' },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: GREEN,
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowColor: GREEN,
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: DARK },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  emptyText: { fontSize: 13, color: '#999', textAlign: 'center' },
  listCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  listItem: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  listItemDivider: { borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  listIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: GREEN_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listLabel: { fontSize: 14, fontWeight: '600', color: DARK },
  listTime: { fontSize: 12, color: '#999', marginTop: 2 },
  listPoin: {
    fontSize: 15,
    fontWeight: '800',
    color: GREEN,
    backgroundColor: GREEN_LIGHT,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
});