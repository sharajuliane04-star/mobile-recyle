import { Link, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

import { SOFT } from '@/constants/soft-theme';
import { auth } from '@/lib/firebase';

export default function RegisterScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) router.replace('/recycle');
    });
    return unsubscribe;
  }, [router]);

  const onCreateAccount = async () => {
    if (!fullName.trim() || !normalizedEmail || !password || !confirmPassword) {
      Alert.alert('Validasi', 'Semua field wajib diisi.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Validasi', 'Password minimal harus 6 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Validasi', 'Konfirmasi password tidak cocok.');
      return;
    }
    if (!agree) {
      Alert.alert('Validasi', 'Kamu harus menyetujui Syarat & Ketentuan dulu.');
      return;
    }

    setIsLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
      await updateProfile(credential.user, { displayName: fullName.trim() });
      router.replace('/recycle');
    } catch (e: any) {
      const code = typeof e?.code === 'string' ? e.code : '';
      if (code === 'auth/email-already-in-use') {
        Alert.alert('Register Gagal', 'Email sudah terdaftar. Silakan gunakan email lain atau login.');
      } else if (code === 'auth/invalid-email') {
        Alert.alert('Register Gagal', 'Format email tidak valid.');
      } else if (code === 'auth/weak-password') {
        Alert.alert('Register Gagal', 'Password terlalu lemah.');
      } else {
        Alert.alert('Register Gagal', e?.message ?? 'Terjadi kesalahan saat membuat akun.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.logoCircle}>
            <Text style={{ fontSize: 30 }}>♻️</Text>
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>Buat Akun</Text>
            <Text style={styles.subtitle}>Daftar untuk mulai menabung poin dari sampahmu</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nama Lengkap</Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Nama kamu"
                editable={!isLoading}
                placeholderTextColor={SOFT.muted}
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                placeholder="nama@email.com"
                editable={!isLoading}
                placeholderTextColor={SOFT.muted}
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Minimal 6 karakter"
                editable={!isLoading}
                placeholderTextColor={SOFT.muted}
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Konfirmasi Password</Text>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholder="Ulangi password"
                editable={!isLoading}
                placeholderTextColor={SOFT.muted}
                style={styles.input}
              />
            </View>

            <Pressable style={styles.checkboxRow} onPress={() => setAgree((v) => !v)} disabled={isLoading}>
              <View style={[styles.checkbox, agree && styles.checkboxChecked]}>
                {agree && <Text style={styles.checkboxMark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>
                Saya menyetujui Syarat & Ketentuan yang berlaku
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.primaryButton, { opacity: pressed || isLoading ? 0.85 : 1 }]}
              onPress={onCreateAccount}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>Daftar Sekarang</Text>
              )}
            </Pressable>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Sudah punya akun?{' '}
                <Link href="/login" asChild>
                  <Text style={styles.linkText}>Masuk di sini</Text>
                </Link>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, backgroundColor: SOFT.bg },
  container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: SOFT.mintLight,
    borderWidth: 2,
    borderColor: SOFT.mint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  header: { marginBottom: 24, alignItems: 'center', width: '100%' },
  title: { fontSize: 26, fontWeight: '800', textAlign: 'center', color: SOFT.ink },
  subtitle: { fontSize: 14, textAlign: 'center', marginTop: 4, color: SOFT.muted },
  card: {
    backgroundColor: SOFT.card,
    borderRadius: 28,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    gap: 16,
    elevation: 4,
    shadowColor: SOFT.mintDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  inputContainer: { gap: 8 },
  label: { fontSize: 14, fontWeight: '700', marginLeft: 4, color: SOFT.ink },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 15,
    backgroundColor: SOFT.mintLight,
    borderColor: SOFT.border,
    color: SOFT.ink,
  },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: SOFT.mint,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: { backgroundColor: SOFT.mint },
  checkboxMark: { color: '#fff', fontSize: 13, fontWeight: '800' },
  checkboxLabel: { flex: 1, fontSize: 13, color: SOFT.ink },
  primaryButton: {
    borderRadius: 16,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: SOFT.mint,
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  footer: { marginTop: 4, alignItems: 'center' },
  footerText: { fontSize: 14, color: SOFT.muted },
  linkText: { fontWeight: 'bold', color: SOFT.mintDark },
});
