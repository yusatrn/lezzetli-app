// src/screens/CartScreen.js
import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, Button, TouchableOpacity, Alert } from 'react-native';
import useCartStore from '../state/cartStore';
import useUserStore from '../state/userStore'; // Kullanıcıyı almak için
import { db } from '../../firebaseConfig'; // Veritabanını almak için
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Firestore fonksiyonları

const CartScreen = ({ navigation }) => {
  const { items, increaseQuantity, decreaseQuantity, clearCart } = useCartStore();
  const user = useUserStore((state) => state.user);

  const totalPrice = items.reduce((total, item) => {
    const price = parseFloat(item.price.replace(' TL', ''));
    return total + price * item.quantity;
  }, 0);

  const handlePlaceOrder = async () => {
    if (!user) {
      Alert.alert("Hata", "Sipariş vermek için giriş yapmalısınız.");
      return;
    }

    try {
      // 'orders' koleksiyonuna yeni bir döküman ekliyoruz.
      await addDoc(collection(db, "orders"), {
        userId: user.uid, // Siparişi veren kullanıcının ID'si
        items: items, // Sepetteki ürünler
        totalPrice: totalPrice, // Toplam Fiyat
        status: "Hazırlanıyor", // Sipariş durumu
        createdAt: serverTimestamp(), // Siparişin oluşturulma tarihi
      });

      Alert.alert("Başarılı!", "Siparişiniz başarıyla alınmıştır.");
      clearCart(); // Sepeti temizle
      navigation.navigate("Menu"); // Kullanıcıyı ana menüye yönlendir

    } catch (error) {
      console.error("Sipariş verilirken hata oluştu: ", error);
      Alert.alert("Hata", "Sipariş verilirken bir sorun oluştu.");
    }
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Sepetim</Text>
        <Text>Sepetiniz şu an boş.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sepetim</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <View style={styles.cartItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => decreaseQuantity(item.id)} style={styles.button}>
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.itemQuantity}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => increaseQuantity(item.id)} style={styles.button}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.itemPrice}>{(parseFloat(item.price.replace(' TL', '')) * item.quantity).toFixed(2)} TL</Text>
          </View>
        )}
        style={styles.list}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Toplam Tutar:</Text>
        <Text style={styles.totalPrice}>{totalPrice.toFixed(2)} TL</Text>
      </View>
      <TouchableOpacity style={styles.orderButton} onPress={handlePlaceOrder}>
        <Text style={styles.orderButtonText}>Siparişi Tamamla</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// stilleri de güncelleyelim
const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', backgroundColor: '#f5f5f5' },
    list: { width: '100%' },
    title: { fontSize: 24, fontWeight: 'bold', marginVertical: 20 },
    cartItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '90%', padding: 15, backgroundColor: 'white', borderRadius: 8, marginVertical: 5, alignSelf: 'center' },
    itemName: { fontSize: 16, flex: 1, fontWeight: '500' },
    quantityContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 },
    itemQuantity: { fontSize: 16, marginHorizontal: 10, fontWeight: '600' },
    itemPrice: { fontSize: 16, fontWeight: 'bold' },
    button: { paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#ddd', borderRadius: 5 },
    buttonText: { fontSize: 18, color: '#333' },
    totalContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '90%', padding: 20, borderTopWidth: 1, borderColor: '#eee' },
    totalText: { fontSize: 18, fontWeight: 'bold' },
    totalPrice: { fontSize: 18, fontWeight: 'bold', color: 'tomato' },
    orderButton: {
        backgroundColor: 'tomato',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        margin: 20,
        width: '90%'
    },
    orderButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    }
});

export default CartScreen;