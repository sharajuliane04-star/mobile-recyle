// Palet "soft & cute" — dipakai di Splash, Login, Register, dan Lupa Password
// biar satu alur auth punya identitas visual yang konsisten dan senada
// dengan tema hijau lembut di fitur Recycle.

export const SOFT = {
  bg: '#FFF9F3',        // krem lembut, background utama
  card: '#FFFFFF',      // putih untuk card/form
  mint: '#7FD1B2',       // hijau pastel — warna utama/CTA
  mintLight: '#EAF8F1',  // hijau pastel sangat muda — chip/badge/bg lembut
  mintDark: '#4C9C80',   // hijau pastel gelap — teks di atas mintLight
  peach: '#FFD9B8',      // peach lembut — aksen hangat
  peachDark: '#E39B63',
  pink: '#FFC6D6',       // pink lembut — aksen "cute" (badge, dot, dsb)
  pinkDark: '#E5799B',
  ink: '#3B3A36',        // teks utama (coklat gelap lembut, bukan hitam pekat)
  muted: '#A79F97',      // teks sekunder
  border: '#F1E8DE',      // border lembut
};

export type SoftTheme = typeof SOFT;
