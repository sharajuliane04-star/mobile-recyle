import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { BG, DARK, GREEN, GREEN_DARK, GREEN_LIGHT } from '@/constants/recycle-theme';

const CATEGORIES = [
  { label: 'Plastik', icon: '🧴' },
  { label: 'Kardus', icon: '📦' },
  { label: 'Logam', icon: '🥫' },
  { label: 'Kaca', icon: '🪟' },
  { label: 'Elektronik', icon: '📱' },
];

const WEIGHT_PRESETS = ['1', '2.5', '3.5', '5', '10'];
const DEFAULT_ADDRESS = 'Jl. Telekomunikasi No. 1,\nBojongsoang, Bandung';

export default function FormPenjemputan() {
  const router = useRouter();
  const [category, setCategory] = useState('Plastik');
  const [weight, setWeight] = useState('3.5');
  const [address, setAddress] = useState(DEFAULT_ADDRESS);
  const [photo, setPhoto] = useState<ImagePicker.ImagePickerAsset | null>(null);

  const pickImage = async (source: 'camera' | 'library') => {
    const permission =
      source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Izin Dibutuhkan',
        source === 'camera'
          ? 'Aplikasi butuh izin kamera untuk mengambil foto.'
          : 'Aplikasi butuh izin galeri untuk memilih foto.',
      );
      return;
    }

    const result =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync({ quality: 0.7, allowsEditing: true })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.7,
            allowsEditing: true,
          });

    if (!result.canceled && result.assets?.[0]) {
      setPhoto(result.assets[0]);
    }
  };

  const onAttachPhoto = () => {
    Alert.alert('Lampirkan Foto', 'Pilih sumber foto', [
      { text: 'Kamera', onPress: () => pickImage('camera') },
      { text: 'Galeri', onPress: () => pickImage('library') },
      { text: 'Batal', style: 'cancel' },
    ]);
  };

  const onSubmit = async () => {
    if (!photo) {
      Alert.alert('Foto Belum Ada', 'Silakan lampirkan foto kondisi sampah terlebih dahulu.');
      return;
    }
    if (!address.trim()) {
      Alert.alert('Alamat Kosong', 'Silakan isi alamat penjemputan.');
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Permintaan Pickup Diterima 🚛',
        body: `Kurir akan menjemput ${category.toLowerCase()} kamu sebentar lagi.`,
      },
      trigger: null,
    });

    router.push({
      pathname: '/recycle/tracking',
      params: { category, weight },
    });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Form Penjemputan</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>PILIH KATEGORI SAMPAH</Text>
          <View style={styles.chipRow}>
            {CATEGORIES.map((c) => {
              const active = category === c.label;
              return (
                <Pressable
                  key={c.label}
                  onPress={() => setCategory(c.label)}
                  style={[styles.chip, active && styles.chipActive]}>
                  <Text>{c.icon}</Text>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{c.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>PERKIRAAN BERAT BERSIH (KG)</Text>
          <View style={{ position: 'relative' }}>
            <TextInput
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              style={styles.weightInput}
            />
            <Text style={styles.weightUnit}>kg</Text>
          </View>
          <View style={styles.presetRow}>
            {WEIGHT_PRESETS.map((v) => {
              const active = weight === v;
              return (
                <Pressable
                  key={v}
                  onPress={() => setWeight(v)}
                  style={[styles.presetChip, active && styles.presetChipActive]}>
                  <Text style={[styles.presetChipText, active && styles.presetChipTextActive]}>{v}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>ALAMAT LENGKAP RUMAH</Text>
          <TextInput
            value={address}
            onChangeText={setAddress}
            multiline
            placeholder="Masukkan alamat penjemputan"
            style={styles.addressBox}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>LAMPIRKAN FOTO KONDISI SAMPAH</Text>
          <Pressable style={styles.photoBox} onPress={onAttachPhoto}>
            {photo ? (
              <>
                <Image source={{ uri: photo.uri }} style={styles.photoPreview} />
                <Text style={styles.photoName}>Foto siap diupload</Text>
                <Text style={styles.photoMeta}>Ketuk untuk ganti foto</Text>
                <View style={styles.photoCheck}>
                  <Text style={{ color: '#fff', fontSize: 14 }}>✓</Text>
                </View>
              </>
            ) : (
              <>
                <Text style={{ fontSize: 36 }}>🖼️</Text>
                <Text style={styles.photoName}>Ketuk untuk lampirkan foto</Text>
                <Text style={styles.photoMeta}>Ambil dari kamera atau galeri</Text>
              </>
            )}
          </Pressable>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.submitBtn} onPress={onSubmit}>
          <Text style={styles.submitBtnText}>🚛 Request Pickup</Text>
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
  scrollContent: { padding: 20, gap: 16, paddingBottom: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    gap: 12,
  },
  cardLabel: { fontSize: 13, fontWeight: '700', color: '#888' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: GREEN_LIGHT,
  },
  chipActive: { backgroundColor: GREEN },
  chipText: { fontWeight: '600', fontSize: 14, color: GREEN_DARK },
  chipTextActive: { color: '#fff' },
  weightInput: {
    borderWidth: 2,
    borderColor: GREEN,
    borderRadius: 12,
    backgroundColor: GREEN_LIGHT,
    padding: 14,
    paddingRight: 48,
    fontSize: 16,
    fontWeight: '600',
    color: DARK,
  },
  weightUnit: {
    position: 'absolute',
    right: 16,
    top: 16,
    color: '#999',
    fontSize: 14,
  },
  presetRow: { flexDirection: 'row', gap: 8 },
  presetChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  presetChipActive: { borderColor: GREEN, backgroundColor: GREEN_LIGHT },
  presetChipText: { fontSize: 12, fontWeight: '600', color: '#999' },
  presetChipTextActive: { color: GREEN_DARK },
  addressBox: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: DARK,
    backgroundColor: '#f9f9f9',
    lineHeight: 22,
    minHeight: 70,
    textAlignVertical: 'top',
  },
  photoBox: {
    borderWidth: 2,
    borderColor: GREEN,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    backgroundColor: GREEN_LIGHT,
    position: 'relative',
    overflow: 'hidden',
  },
  photoPreview: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 4,
  },
  photoName: { fontSize: 13, fontWeight: '600', color: GREEN_DARK },
  photoMeta: { fontSize: 11, color: '#999' },
  photoCheck: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    padding: 20,
    paddingBottom: 28,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  submitBtn: {
    backgroundColor: GREEN,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: GREEN,
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});