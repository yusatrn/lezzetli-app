// src/screens/MenuScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, Button, ActivityIndicator } from 'react-native';
import useCartStore from '../state/cartStore';
import { db } from '../../firebaseConfig'; // Firebase bağlantımızı import ediyoruz
import { collection, getDocs } from 'firebase/firestore';

const MenuScreen = () => {
  const [menu, setMenu] = useState([]); // Başlangıçta menü boş
  const [loading, setLoading] = useState(true); // Yüklenme durumu için
  const addToCart = useCartStore((state) => state.addToCart);

  // useEffect hook'u, component ilk açıldığında sadece bir kez çalışır
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "menu"));
        const menuList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMenu(menuList);
      } catch (error) {
        console.error("Veri çekerken hata oluştu: ", error);
      } finally {
        setLoading(false); // Yükleme bitti
      }
    };

    fetchMenu();
  }, []); // Boş dizi, bu fonksiyonun sadece bir kez çalışmasını sağlar

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  const renderMenuItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemPrice}>{item.price}</Text>
      </View>
      <Button title="Sepete Ekle" onPress={() => addToCart(item)} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Lezzetli Menümüz</Text>
      <FlatList
        data={menu}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
    card: { backgroundColor: 'white', padding: 20, marginVertical: 8, marginHorizontal: 16, borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, flexDirection: 'row', alignItems: 'center' },
    itemName: { fontSize: 18, fontWeight: '600' },
    itemDescription: { fontSize: 14, color: '#666', marginTop: 4 },
    itemPrice: { fontSize: 16, fontWeight: 'bold', color: '#2e8b57', marginTop: 10 },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});


export default MenuScreen;