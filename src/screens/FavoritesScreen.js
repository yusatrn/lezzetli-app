// src/screens/FavoritesScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import useFavoritesStore from '../state/favoritesStore';
import useCartStore from '../state/cartStore';
import Ionicons from '@expo/vector-icons/Ionicons';

const FavoritesScreen = ({ navigation }) => {
  const { favorites, toggleFavorite, loadFavorites } = useFavoritesStore();
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleAddToCart = (item) => {
    addToCart(item);
    Alert.alert('Başarılı!', `${item.name} sepete eklendi.`);
  };

  const handleRemoveFavorite = (item) => {
    Alert.alert(
      'Favorilerden Çıkar',
      `${item.name} favorilerden çıkarılsın mı?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkar',
          style: 'destructive',
          onPress: () => toggleFavorite(item)
        }
      ]
    );
  };

  const renderFavoriteItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemPrice}>{item.price}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.removeButton} 
          onPress={() => handleRemoveFavorite(item)}
        >
          <Ionicons name="heart" size={24} color="red" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => handleAddToCart(item)}
        >
          <Text style={styles.addButtonText}>Sepete Ekle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Favorilerim</Text>
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Henüz favori ürününüz yok</Text>
          <Text style={styles.emptyDescription}>
            Menüden beğendiğiniz ürünleri favorilere ekleyebilirsiniz
          </Text>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => navigation.navigate('Menu')}
          >
            <Text style={styles.menuButtonText}>Menüye Git</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Favorilerim</Text>
      <Text style={styles.subtitle}>{favorites.length} favori ürün</Text>
      <FlatList
        data={favorites}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333'
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemInfo: {
    flex: 1
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'tomato'
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12
  },
  removeButton: {
    padding: 8,
    marginRight: 8
  },
  addButton: {
    backgroundColor: 'tomato',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center'
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24
  },
  menuButton: {
    backgroundColor: 'tomato',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8
  },
  menuButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16
  }
});

export default FavoritesScreen;
