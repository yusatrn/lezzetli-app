// src/screens/MenuScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert, RefreshControl, TextInput } from 'react-native';
import useCartStore from '../state/cartStore';
import useFavoritesStore from '../state/favoritesStore';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

// İkon bileşeni - yedek emoji desteği ile
const IconComponent = ({ name, size, color, style }) => {
  try {
    return <Ionicons name={name} size={size} color={color} style={style} />;
  } catch (error) {
    // Yedek emoji ikonlar
    let emoji;
    switch (name) {
      case 'search':
        emoji = '🔍';
        break;
      case 'close-circle':
        emoji = '❌';
        break;
      case 'heart':
        emoji = '❤️';
        break;
      case 'heart-outline':
        emoji = '🤍';
        break;
      default:
        emoji = '⭐';
    }
    
    return (
      <Text style={[{ fontSize: size * 0.8 }, style]}>
        {emoji}
      </Text>
    );
  }
};

const MenuScreen = () => {
  const [menu, setMenu] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleFavorite, isFavorite, loadFavorites } = useFavoritesStore();

  const categories = ['Tümü', 'Ana Yemek', 'İçecek', 'Tatlı', 'Aperitif'];

  const fetchMenu = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const querySnapshot = await getDocs(collection(db, "menu"));
      const menuList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMenu(menuList);
      setFilteredMenu(menuList);
    } catch (error) {
      console.error("Veri çekerken hata oluştu: ", error);
      setError('Menü yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };  // useEffect hook'u, component ilk açıldığında sadece bir kez çalışır
  useEffect(() => {
    fetchMenu();
    loadFavorites(); // Favorileri yükle
  }, []); // Boş dizi, bu fonksiyonun sadece bir kez çalışmasını sağlar

  // Arama ve filtreleme için useEffect
  useEffect(() => {
    let filtered = menu;

    // Kategori filtresi
    if (selectedCategory !== 'Tümü') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Arama filtresi
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMenu(filtered);
  }, [menu, searchQuery, selectedCategory]);
  const handleAddToCart = (item) => {
    addToCart(item);
    Alert.alert('Başarılı!', `${item.name} sepete eklendi.`);
  };

  const handleToggleFavorite = (item) => {
    toggleFavorite(item);
    const message = isFavorite(item.id) ? 'Favorilerden çıkarıldı' : 'Favorilere eklendi';
    Alert.alert('', `${item.name} ${message}.`);
  };

  const onRefresh = () => {
    fetchMenu(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" style={styles.loader} />
        <Text style={styles.loadingText}>Menü yükleniyor...</Text>
      </SafeAreaView>
    );
  }
  if (error && menu.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Lezzetli Menümüz</Text>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchMenu()}>
            <Text style={styles.retryButtonText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderCategoryButton = (category) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryButton,
        selectedCategory === category && styles.categoryButtonActive
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text style={[
        styles.categoryButtonText,
        selectedCategory === category && styles.categoryButtonTextActive
      ]}>
        {category}
      </Text>
    </TouchableOpacity>
  );  const renderMenuItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemPrice}>{item.price}</Text>
      </View>
      <View style={styles.buttonsContainer}>        <TouchableOpacity 
          style={styles.favoriteButton} 
          onPress={() => handleToggleFavorite(item)}
        >
          <IconComponent 
            name={isFavorite(item.id) ? "heart" : "heart-outline"} 
            size={24} 
            color={isFavorite(item.id) ? "red" : "#666"} 
          />
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
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Lezzetli Menümüz</Text>
        {/* Arama Çubuğu */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <IconComponent name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Yemek ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#666"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <IconComponent name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Kategori Filtreleri */}
      <View style={styles.categoryContainer}>
        <FlatList
          data={categories}
          renderItem={({ item }) => renderCategoryButton(item)}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      {/* Sonuç Sayısı */}
      <Text style={styles.resultCount}>
        {filteredMenu.length} ürün bulundu
      </Text>

      <FlatList
        data={filteredMenu}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['tomato']}
            tintColor="tomato"
          />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aradığınız kriterlere uygun ürün bulunamadı</Text>
            <Text style={styles.emptyDescription}>Farklı bir arama terimi deneyin veya filtreleri sıfırlayın</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    title: { 
        fontSize: 28, 
        fontWeight: 'bold', 
        textAlign: 'center', 
        marginVertical: 20,
        color: '#333'
    },
    searchContainer: {
        paddingHorizontal: 16,
        marginBottom: 16
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2
    },
    searchIcon: {
        marginRight: 12
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333'
    },
    clearButton: {
        marginLeft: 8
    },
    categoryContainer: {
        marginBottom: 16
    },
    categoryList: {
        paddingHorizontal: 16
    },
    categoryButton: {
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0'
    },
    categoryButtonActive: {
        backgroundColor: 'tomato',
        borderColor: 'tomato'
    },
    categoryButtonText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500'
    },
    categoryButtonTextActive: {
        color: 'white'
    },
    resultCount: {
        fontSize: 14,
        color: '#666',
        marginHorizontal: 16,
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
    },    itemInfo: {
        flex: 1,
    },
    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 12
    },
    favoriteButton: {
        padding: 8,
        marginRight: 8
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
    addButton: {
        backgroundColor: 'tomato',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        marginLeft: 12
    },
    addButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14
    },
    loader: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
        textAlign: 'center'
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingVertical: 60
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 8,
        fontWeight: '500'
    },
    emptyDescription: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        lineHeight: 20
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32
    },
    errorText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 24
    },
    retryButton: {
        backgroundColor: 'tomato',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8
    },
    retryButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16
    }
});


export default MenuScreen;