// src/state/favoritesStore.js
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useFavoritesStore = create((set, get) => ({
  favorites: [],
  isLoading: false,

  // Favorileri AsyncStorage'dan yükle
  loadFavorites: async () => {
    set({ isLoading: true });
    try {
      const savedFavorites = await AsyncStorage.getItem('favorites');
      if (savedFavorites) {
        set({ favorites: JSON.parse(savedFavorites) });
      }
    } catch (error) {
      console.error('Favoriler yüklenirken hata:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Favorileri AsyncStorage'a kaydet
  saveFavorites: async (favorites) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
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
      await AsyncStorage.removeItem('favorites');
    } catch (error) {
      console.error('Favoriler temizlenirken hata:', error);
    }
  }
}));

export default useFavoritesStore;
