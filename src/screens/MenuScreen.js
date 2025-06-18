// src/screens/MenuScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import useCartStore from '../state/cartStore';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const MenuScreen = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const addToCart = useCartStore((state) => state.addToCart);

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
    } catch (error) {
      console.error("Veri çekerken hata oluştu: ", error);
      setError('Menü yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // useEffect hook'u, component ilk açıldığında sadece bir kez çalışır
  useEffect(() => {
    fetchMenu();
  }, []); // Boş dizi, bu fonksiyonun sadece bir kez çalışmasını sağlar

  const handleAddToCart = (item) => {
    addToCart(item);
    Alert.alert('Başarılı!', `${item.name} sepete eklendi.`);
  };

  const onRefresh = () => {
    fetchMenu(true);
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
  const renderMenuItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemPrice}>{item.price}</Text>
      </View>
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => handleAddToCart(item)}
      >
        <Text style={styles.addButtonText}>Sepete Ekle</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Lezzetli Menümüz</Text>
      <FlatList
        data={menu}
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
        flex: 1,
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