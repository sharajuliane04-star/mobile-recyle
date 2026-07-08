import { Link, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
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
import { sendPasswordResetEmail } from 'firebase/auth';

import { SOFT } from '@/constants/soft-theme';
import { auth } from '@/lib/firebase';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);

  const onSubmit = async () => {
    if (!normalizedEmail) {
      Alert.alert('Validasi', 'Masukkan email kamu dulu ya.');
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, normalizedEmail);
      setSent(true);
    } catch (e: any) {
      const code = typeof e?.code === 'string' ? e.code : '';
      if (code === 'auth/invalid-email') {
        Alert.alert('Gagal', 'Format email tidak valid.');
      } else if (code === 'auth/user-not-found') {
        Alert.alert('Gagal', 'Email tidak ditemukan.');
      } else {
        Alert.alert('Gagal', e?.message ?? 'Terjadi kesalahan.');
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
            <Text style={{ fontSize: 30 }}>🔑</Text>
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>Lupa Password</Text>
            <Text style={styles.subtitle}>
              Masukkan email kamu, kami kirimkan link untuk atur ulang password
            </Text>
          </View>

          <View style={styles.card}>
            {sent ? (
              <View style={{ gap: 12, alignItems: 'center' }}>
                <Text style={{ fontSize: 36 }}>📩</Text>
                <Text style={styles.successText}>
                  Link reset password sudah dikirim ke {normalizedEmail}. Cek inbox (atau folder spam) kamu ya.
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="email@contoh.com"
                    editable={!isLoading}
                    placeholderTextColor={SOFT.muted}
                    style={styles.input}
                  />
                </View>

                <Pressable
                  style={({ pressed }) => [styles.primaryButton, { opacity: pressed || isLoading ? 0.85 : 1 }]}
                  onPress={onSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Kirim Link Reset</Text>
                  )}
                </Pressable>
              </>
            )}

            <View style={styles.footer}>
              <Pressable onPress={() => router.replace('/login')}>
                <Text style={styles.footerText}>
                  Ingat password kamu? <Text style={styles.linkText}>Masuk di sini</Text>
                </Text>
              </Pressable>
            </View>
          </View>

          <Link href="/register" style={{ marginTop: 16 }}>
            <Text style={styles.smallLink}>Belum punya akun? Daftar</Text>
          </Link>
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
    backgroundColor: SOFT.peach,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  header: { marginBottom: 24, alignItems: 'center', width: '100%' },
  title: { fontSize: 26, fontWeight: '800', textAlign: 'center', color: SOFT.ink },
  subtitle: { fontSize: 14, textAlign: 'center', marginTop: 4, color: SOFT.muted, paddingHorizontal: 12 },
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
  primaryButton: {
    borderRadius: 16,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: SOFT.mint,
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  successText: { fontSize: 14, color: SOFT.ink, textAlign: 'center', lineHeight: 20 },
  footer: { marginTop: 4, alignItems: 'center' },
  footerText: { fontSize: 14, color: SOFT.muted, textAlign: 'center' },
  linkText: { fontWeight: 'bold', color: SOFT.mintDark },
  smallLink: { fontSize: 13, color: SOFT.muted, textDecorationLine: 'underline' },
});
