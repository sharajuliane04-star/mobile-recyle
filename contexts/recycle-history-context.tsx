import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
} from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

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

  // [Firestore] Dengerin realtime data history milik user yang lagi login
  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      setHistory([]);
      setLoading(false);
      return;
    }

    const historyQuery = query(
      collection(db, 'recycleHistory'),
      where('userId', '==', uid),
      orderBy('createdAt', 'desc'),
    );

    const unsubscribe = onSnapshot(
      historyQuery,
      (snapshot) => {
        const items: RecycleEntry[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            icon: data.icon,
            label: data.label,
            poin: data.poin,
            time: formatTimestamp(data.createdAt),
          };
        });
        setHistory(items);
        setLoading(false);
      },
      (error) => {
        console.log('Gagal memuat riwayat dari Firestore:', error);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const addEntry = async (entry: NewEntryInput) => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      console.log('Tidak bisa menyimpan riwayat: user belum login.');
      return;
    }

    await addDoc(collection(db, 'recycleHistory'), {
      ...entry,
      userId: uid,
      createdAt: serverTimestamp(),
    });
    // Tidak perlu update state manual, onSnapshot di atas otomatis nangkep data baru
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