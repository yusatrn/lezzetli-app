// src/screens/CartScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import useCartStore from '../state/cartStore';
import useUserStore from '../state/userStore';
import { db } from '../../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const CartScreen = ({ navigation }) => {
  const { items, increaseQuantity, decreaseQuantity, clearCart } = useCartStore();
  const user = useUserStore((state) => state.user);
  const [loading, setLoading] = useState(false);

  const totalPrice = items.reduce((total, item) => {
    const price = parseFloat(item.price.replace(' TL', ''));
    return total + price * item.quantity;
  }, 0);

  const handlePlaceOrder = async () => {
    if (!user) {
      Alert.alert("Hata", "Sipariş vermek için giriş yapmalısınız.");
      return;
    }

    if (items.length === 0) {
      Alert.alert("Hata", "Sepetinizde ürün bulunmuyor.");
      return;
    }

    setLoading(true);
    try {
      // 'orders' koleksiyonuna yeni bir döküman ekliyoruz.
      await addDoc(collection(db, "orders"), {
        userId: user.uid, // Siparişi veren kullanıcının ID'si
        items: items, // Sepetteki ürünler
        totalPrice: totalPrice, // Toplam Fiyat
        status: "Hazırlanıyor", // Sipariş durumu
        createdAt: serverTimestamp(), // Siparişin oluşturulma tarihi
      });

      Alert.alert("Başarılı!", "Siparişiniz başarıyla alınmıştır. Teşekkür ederiz!");
      clearCart(); // Sepeti temizle
      navigation.navigate("Menu"); // Kullanıcıyı ana menüye yönlendir

    } catch (error) {
      console.error("Sipariş verilirken hata oluştu: ", error);
      Alert.alert("Hata", "Sipariş verilirken bir sorun oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };
  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Sepetim</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Sepetiniz şu an boş.</Text>
          <Text style={styles.emptyDescription}>
            Menüden lezzetli ürünlerimizi sepetinize ekleyebilirsiniz.
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
      </View>      <TouchableOpacity 
        style={[styles.orderButton, loading && styles.orderButtonDisabled]} 
        onPress={handlePlaceOrder}
        disabled={loading}
      >
        <Text style={styles.orderButtonText}>
          {loading ? 'Sipariş Veriliyor...' : 'Siparişi Tamamla'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// stilleri de güncelleyelim
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    list: { width: '100%' },
    title: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        marginVertical: 20,
        textAlign: 'center',
        color: '#333'
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
        marginBottom: 8,
        textAlign: 'center'
    },
    emptyDescription: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20
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
    },
    cartItem: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        width: '90%', 
        padding: 15, 
        backgroundColor: 'white', 
        borderRadius: 12, 
        marginVertical: 5, 
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2
    },
    itemName: { 
        fontSize: 16, 
        flex: 1, 
        fontWeight: '500',
        color: '#333'
    },
    quantityContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginHorizontal: 10 
    },
    itemQuantity: { 
        fontSize: 16, 
        marginHorizontal: 12, 
        fontWeight: '600',
        minWidth: 20,
        textAlign: 'center'
    },
    itemPrice: { 
        fontSize: 16, 
        fontWeight: 'bold',
        color: 'tomato',
        minWidth: 70,
        textAlign: 'right'
    },
    button: { 
        paddingHorizontal: 12, 
        paddingVertical: 8, 
        backgroundColor: '#f0f0f0', 
        borderRadius: 6,
        minWidth: 32,
        alignItems: 'center'
    },
    buttonText: { 
        fontSize: 18, 
        color: '#333',
        fontWeight: '600'
    },
    totalContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        width: '90%', 
        padding: 20, 
        borderTopWidth: 1, 
        borderColor: '#eee',
        alignSelf: 'center',
        backgroundColor: 'white',
        marginTop: 8
    },
    totalText: { 
        fontSize: 18, 
        fontWeight: 'bold',
        color: '#333'
    },
    totalPrice: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: 'tomato' 
    },
    orderButton: {
        backgroundColor: 'tomato',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        margin: 20,
        width: '90%',
        alignSelf: 'center'
    },
    orderButtonDisabled: {
        backgroundColor: '#ccc'
    },
    orderButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    }
});

export default CartScreen;