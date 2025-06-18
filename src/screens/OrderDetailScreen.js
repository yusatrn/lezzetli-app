// src/screens/OrderDetailScreen.js
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';

const OrderDetailScreen = ({ route, navigation }) => {
  const { order } = route.params;

  const canCancelOrder = () => {
    return order.status === 'Hazırlanıyor';
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Sipariş Detayı</Text>
        
        <View style={styles.section}>
          <Text style={styles.label}>Sipariş Tarihi:</Text>
          <Text style={styles.value}>
            {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleString('tr-TR') : 'Bilinmiyor'}
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.label}>Durum:</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
            <Text style={styles.statusText}>{order.status}</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.label}>Ürünler:</Text>
          <FlatList
            data={order.items}
            keyExtractor={(item, idx) => item.id + '-' + idx}
            renderItem={({ item }) => (
              <View style={styles.productRow}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productQty}>x{item.quantity}</Text>
                <Text style={styles.productPrice}>{item.price}</Text>
              </View>
            )}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.label}>Toplam Tutar:</Text>
          <Text style={[styles.value, { color: 'tomato', fontWeight: 'bold', fontSize: 18 }]}>
            {order.totalPrice.toFixed(2)} TL
          </Text>
        </View>

        {canCancelOrder() && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.navigate('OrderCancel', { order })}
          >
            <Text style={styles.cancelButtonText}>Siparişi İptal Et</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  content: {
    flex: 1,
    padding: 20
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 24, 
    color: '#333' 
  },
  section: { 
    marginBottom: 18,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  label: { 
    fontSize: 16, 
    color: '#666', 
    marginBottom: 8,
    fontWeight: '500'
  },
  value: { 
    fontSize: 16, 
    color: '#333' 
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start'
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600'
  },
  productRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 8, 
    borderBottomWidth: 1, 
    borderColor: '#f0f0f0' 
  },
  productName: { 
    fontSize: 15, 
    flex: 1,
    color: '#333'
  },
  productQty: { 
    fontSize: 15, 
    width: 40, 
    textAlign: 'center',
    color: '#666'
  },
  productPrice: { 
    fontSize: 15, 
    width: 70, 
    textAlign: 'right', 
    color: 'tomato',
    fontWeight: '500'
  },
  cancelButton: {
    backgroundColor: '#ff4444',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default OrderDetailScreen;
