// src/state/favoritesStore.js
import { create } from 'zustand';

const useFavoritesStore = create((set, get) => ({
  favorites: [],
  isLoading: false,

  // Favorileri localStorage'dan yükle (web için) 
  loadFavorites: async () => {
    set({ isLoading: true });
    try {
      if (typeof window !== 'undefined') {
        // Web platformu için localStorage kullan
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
          set({ favorites: JSON.parse(savedFavorites) });
        }
      }
    } catch (error) {
      console.error('Favoriler yüklenirken hata:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Favorileri localStorage'a kaydet
  saveFavorites: async (favorites) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('favorites', JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Favoriler kaydedilirken hata:', error);
    }
  },

  // Favori ekle/çıkar
  toggleFavorite: (item) => {
    const { favorites, saveFavorites } = get();
    const isAlreadyFavorite = favorites.some(fav => fav.id === item.id);
    
    let newFavorites;
    if (isAlreadyFavorite) {
      newFavorites = favorites.filter(fav => fav.id !== item.id);
    } else {
      newFavorites = [...favorites, item];
    }
    
    set({ favorites: newFavorites });
    saveFavorites(newFavorites);
  },

  // Bir öğenin favori olup olmadığını kontrol et
  isFavorite: (itemId) => {
    const { favorites } = get();
    return favorites.some(fav => fav.id === itemId);
  },

  // Tüm favorileri temizle
  clearFavorites: async () => {
    set({ favorites: [] });
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('favorites');
      }
    } catch (error) {
      console.error('Favoriler temizlenirken hata:', error);
    }
  }
}));

export default useFavoritesStore;
