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
import { signInWithEmailAndPassword } from 'firebase/auth';

import { SOFT } from '@/constants/soft-theme';
import { auth } from '@/lib/firebase';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) router.replace('/recycle');
    });
    return unsubscribe;
  }, [router]);

  const onLogin = async () => {
    if (!normalizedEmail || !password) {
      Alert.alert('Validasi', 'Email dan password wajib diisi ya.');
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, normalizedEmail, password);
      router.replace('/recycle');
    } catch (e: any) {
      const code = typeof e?.code === 'string' ? e.code : '';
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        Alert.alert('Gagal Login', 'Email atau password salah.');
      } else {
        Alert.alert('Gagal login', e?.message ?? 'Terjadi kesalahan.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onGoogleSSO = () => {
    Alert.alert('Google Sign-In', 'Login dengan Google belum tersedia. Silakan pakai email & password dulu ya.');
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
            <Text style={styles.title}>Selamat Datang ✨</Text>
            <Text style={styles.subtitle}>Masuk untuk melanjutkan ke RecyclePals</Text>
          </View>

          <View style={styles.card}>
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

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="••••••••"
                editable={!isLoading}
                placeholderTextColor={SOFT.muted}
                style={styles.input}
              />
            </View>

            <Pressable onPress={() => router.push('/forgot-password')} disabled={isLoading}>
              <Text style={styles.forgotLink}>Lupa password?</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.primaryButton, { opacity: pressed || isLoading ? 0.85 : 1 }]}
              onPress={onLogin}
              disabled={isLoading}
            >
              {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Login</Text>}
            </Pressable>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>atau</Text>
              <View style={styles.dividerLine} />
            </View>

            

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Belum punya akun?{' '}
                <Link href="/register" asChild>
                  <Text style={styles.linkText}>Daftar</Text>
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
  forgotLink: { fontSize: 13, fontWeight: '600', color: SOFT.mintDark, textAlign: 'right' },
  primaryButton: {
    borderRadius: 16,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: SOFT.mint,
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: SOFT.border },
  dividerText: { fontSize: 12, color: SOFT.muted },
  ssoButton: {
    flexDirection: 'row',
    gap: 8,
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: SOFT.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  ssoButtonText: { fontSize: 14, fontWeight: '600', color: SOFT.ink },
  footer: { marginTop: 4, alignItems: 'center' },
  footerText: { fontSize: 14, color: SOFT.muted },
  linkText: { fontWeight: 'bold', color: SOFT.mintDark },
});
