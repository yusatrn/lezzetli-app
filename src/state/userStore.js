// src/state/userStore.js
import { create } from 'zustand';

const useUserStore = create((set) => ({
  user: null, // Başlangıçta kullanıcı yok
  isLoading: true, // Uygulama açılırken auth durumunu kontrol etmek için

  // Kullanıcı bilgisini state'e set etme
  setUser: (userData) => set({ user: userData, isLoading: false }),

  // Kullanıcıyı state'den temizleme (çıkış yapınca)
  clearUser: () => set({ user: null, isLoading: false }),
}));

export default useUserStore;