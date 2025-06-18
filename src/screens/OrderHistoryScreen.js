// src/screens/OrderHistoryScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { db } from '../../firebaseConfig';
import { collection, query, where, getDocs, orderBy, onSnapshot } from 'firebase/firestore';
import useUserStore from '../state/userStore';/screens/OrderHistoryScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { db } from '../../firebaseConfig';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import useUserStore from '../state/userStore';

const OrderHistoryScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const user = useUserStore((state) => state.user);

  const fetchOrders = async (isRefresh = false) => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
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
      setRefreshing(false);
    }
  };
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Real-time listener oluştur
    const q = query(
      collection(db, "orders"), 
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userOrders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(userOrders);
      setLoading(false);
    }, (error) => {
      console.error("Siparişler dinlenirken hata: ", error);
      setLoading(false);
    });

    // Component unmount olduğunda listener'ı temizle
    return () => unsubscribe();
  }, [user]);

  const onRefresh = () => {
    fetchOrders(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Hazırlanıyor':
        return '#FF9500';
      case 'Yolda':
        return '#007AFF';
      case 'Teslim Edildi':
        return '#34C759';
      case 'İptal Edildi':
        return '#FF3B30';
      default:
        return 'tomato';
    }
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" style={styles.loader} />
        <Text style={styles.loadingText}>Siparişleriniz yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  if (orders.length === 0) {
      return (
          <SafeAreaView style={styles.container}>
              <Text style={styles.title}>Sipariş Geçmişim</Text>
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Henüz sipariş vermemişsiniz</Text>
                <Text style={styles.emptyDescription}>
                  İlk siparişinizi vermek için menüye göz atın!
                </Text>
              </View>
          </SafeAreaView>
      );
  }
  const renderOrderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('OrderDetail', { order: item })} activeOpacity={0.8}>
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderDate}>
              {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : 'Bilinmiyor'}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        <View style={styles.itemList}>
            {item.items.map((product, index) => (
                <Text key={`${product.id}-${index}`} style={styles.productText}>
                  • {product.name} x{product.quantity}
                </Text>
            ))}
        </View>
        <View style={styles.orderFooter}>
          <Text style={styles.orderTotal}>Toplam: {item.totalPrice.toFixed(2)} TL</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sipariş Geçmişim</Text>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
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
  list: {
    flex: 1,
    paddingHorizontal: 16
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
    lineHeight: 20
  },
  orderCard: {
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 20,
      marginVertical: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  orderDate: { 
    fontSize: 14, 
    color: '#666',
    flex: 1,
    marginRight: 12
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center'
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600'
  },
  itemList: { 
    marginBottom: 16
  },
  productText: { 
    fontSize: 14, 
    color: '#333',
    marginBottom: 4,
    lineHeight: 20
  },
  orderFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12
  },
  orderTotal: { 
    fontSize: 18, 
    fontWeight: 'bold',
    color: 'tomato',
    textAlign: 'right'
  }
});

export default OrderHistoryScreen;