// src/screens/OrderHistoryScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import { db } from '../../firebaseConfig';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import useUserStore from '../state/userStore';

const OrderHistoryScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        // 'orders' koleksiyonunda, 'userId' alanı bizim kullanıcımızın id'sine eşit olanları sorguluyoruz.
        const q = query(
          collection(db, "orders"), 
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc") // Siparişleri yeniden eskiye doğru sırala
        );

        const querySnapshot = await getDocs(q);
        const userOrders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(userOrders);
      } catch (error) {
        console.error("Siparişler çekilirken hata: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]); // user bilgisi değiştiğinde (örn: ilk yüklendiğinde) bu fonksiyon çalışır

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  if (orders.length === 0) {
      return (
          <SafeAreaView style={styles.container}>
              <Text style={styles.title}>Sipariş Geçmişim</Text>
              <Text>Daha önce hiç sipariş vermemişsiniz.</Text>
          </SafeAreaView>
      );
  }

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
        <Text style={styles.orderDate}>
            Tarih: {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : 'Bilinmiyor'}
        </Text>
        <Text style={styles.orderTotal}>Toplam: {item.totalPrice.toFixed(2)} TL</Text>
        <View style={styles.itemList}>
            {item.items.map(product => (
                <Text key={product.id} style={styles.productText}>- {product.name} (x{product.quantity})</Text>
            ))}
        </View>
        <Text style={styles.orderStatus}>Durum: {item.status}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sipariş Geçmişim</Text>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        style={{width: '100%'}}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
  orderCard: {
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 15,
      marginVertical: 8,
      marginHorizontal: 16,
      width: '90%',
      alignSelf: 'center',
  },
  orderDate: { fontSize: 14, color: '#666' },
  orderTotal: { fontSize: 18, fontWeight: 'bold', marginVertical: 5 },
  orderStatus: { fontSize: 14, fontStyle: 'italic', color: 'tomato', marginTop: 10, textAlign: 'right' },
  itemList: { marginTop: 10 },
  productText: { fontSize: 14, color: '#333' }
});

export default OrderHistoryScreen;