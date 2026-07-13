import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  Timestamp,
  where,
} from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';

import { auth, db } from '@/lib/firebase';

export type RecycleEntry = {
  id: string;
  icon: string;
  label: string;
  time: string;
  poin: number;
};

type NewEntryInput = {
  icon: string;
  label: string;
  poin: number;
};

type RecycleHistoryContextValue = {
  history: RecycleEntry[];
  totalPoin: number;
  loading: boolean;
  addEntry: (entry: NewEntryInput) => Promise<void>;
};

const RecycleHistoryContext = createContext<RecycleHistoryContextValue | null>(null);

function formatTimestamp(ts: Timestamp | null | undefined) {
  if (!ts) return 'Baru saja';
  const date = ts.toDate();
  const now = new Date();
  const jam = date.getHours().toString().padStart(2, '0');
  const menit = date.getMinutes().toString().padStart(2, '0');

  if (date.toDateString() === now.toDateString()) {
    return `Hari ini, ${jam}:${menit} WIB`;
  }
  const tanggal = date.getDate();
  const bulan = date.toLocaleDateString('id-ID', { month: 'long' });
  return `${tanggal} ${bulan}, ${jam}:${menit} WIB`;
}

export function RecycleHistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<RecycleEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | undefined;

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      unsubscribeSnapshot?.();
      unsubscribeSnapshot = undefined;

      if (!user) {
        setHistory([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const historyQuery = query(
        collection(db, 'recycleHistory'),
        where('userId', '==', user.uid),
      );

      unsubscribeSnapshot = onSnapshot(
        historyQuery,
        (snapshot) => {
          const items = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            const createdAt: Timestamp | undefined = data.createdAt;
            return {
              id: docSnap.id,
              icon: data.icon,
              label: data.label,
              poin: data.poin,
              time: formatTimestamp(createdAt),
              _sortKey: createdAt ? createdAt.toMillis() : Date.now(),
            };
          });

          items.sort((a, b) => b._sortKey - a._sortKey);

          setHistory(items.map(({ _sortKey, ...rest }) => rest));
          setLoading(false);
        },
        (error) => {
          console.log('Gagal memuat riwayat dari Firestore:', error);
          setLoading(false);
          Alert.alert(
            'Gagal Memuat Riwayat',
            `${error.message}\n\nCek Firestore Rules atau koneksi internet kamu.`,
          );
        },
      );
    });

    return () => {
      unsubscribeAuth();
      unsubscribeSnapshot?.();
    };
  }, []);

  const addEntry = async (entry: NewEntryInput) => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      Alert.alert('Belum Login', 'Tidak bisa menyimpan riwayat karena kamu belum login.');
      return;
    }

    try {
      await addDoc(collection(db, 'recycleHistory'), {
        ...entry,
        userId: uid,
        createdAt: serverTimestamp(),
      });
    } catch (error: any) {
      console.log('Gagal menyimpan riwayat ke Firestore:', error);
      Alert.alert('Gagal Menyimpan', error?.message ?? 'Terjadi kesalahan saat menyimpan riwayat.');
    }
  };

  const totalPoin = useMemo(
    () => history.reduce((sum, item) => sum + item.poin, 0),
    [history],
  );

  const value = useMemo(
    () => ({ history, totalPoin, loading, addEntry }),
    [history, totalPoin, loading],
  );

  return <RecycleHistoryContext.Provider value={value}>{children}</RecycleHistoryContext.Provider>;
}

export function useRecycleHistory() {
  const ctx = useContext(RecycleHistoryContext);
  if (!ctx) {
    throw new Error('useRecycleHistory harus dipakai di dalam RecycleHistoryProvider');
  }
  return ctx;
}