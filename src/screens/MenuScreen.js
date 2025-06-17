import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';

// 1. Adım: Sahte menü verimizi oluşturalım
const DUMMY_MENU = [
  { id: '1', name: 'Mercimek Çorbası', description: 'Günün taze çorbası', price: '45 TL' },
  { id: '2', name: 'Adana Kebap', description: 'Acılı, bol salatasıyla', price: '180 TL' },
  { id: '3', name: 'İskender', description: 'Tereyağlı, yoğurtlu', price: '220 TL' },
  { id: '4', name: 'Künefe', description: 'Sıcak, peynirli şerbetli tatlı', price: '95 TL' },
];

const MenuScreen = () => {
  // 2. Adım: Verimizi component'in state'ine (hafızasına) alalım
  const [menu, setMenu] = useState(DUMMY_MENU);

  // 3. Adım: Her bir menü öğesinin nasıl görüneceğini belirleyen bir fonksiyon
  const renderMenuItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
      <Text style={styles.itemPrice}>{item.price}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Lezzetli Menümüz</Text>
      {/* 4. Adım: FlatList ile verilerimizi ekrana basalım */}
      <FlatList
        data={menu}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Arka plan rengi
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  // Kart stilleri
  card: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e8b57', // Yeşil renk
    marginTop: 10,
    textAlign: 'right',
  },
});

export default MenuScreen;