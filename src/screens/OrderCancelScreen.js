// src/screens/OrderCancelScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { db } from '../../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

const OrderCancelScreen = ({ route, navigation }) => {
  const { order } = route.params;
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const cancelReasons = [
    'Sipariş içeriğini değiştirmek istiyorum',
    'Teslimat süresi çok uzun',
    'Yanlış adres girişi',
    'Ödeme sorunu',
    'Diğer'
  ];

  const handleCancelOrder = async () => {
    if (!reason.trim()) {
      Alert.alert('Hata', 'Lütfen iptal nedeninizi seçin veya yazın.');
      return;
    }

    Alert.alert(
      'Siparişi İptal Et',
      'Bu siparişi iptal etmek istediğinizden emin misiniz?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'İptal Et',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await updateDoc(doc(db, 'orders', order.id), {
                status: 'İptal Edildi',
                cancelReason: reason,
                cancelledAt: new Date()
              });

              Alert.alert('Başarılı', 'Siparişiniz başarıyla iptal edildi.', [
                { text: 'Tamam', onPress: () => navigation.goBack() }
              ]);
            } catch (error) {
              console.error('Sipariş iptal edilirken hata:', error);
              Alert.alert('Hata', 'Sipariş iptal edilirken bir sorun oluştu.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Sipariş İptali</Text>
        <Text style={styles.subtitle}>Siparişinizi neden iptal etmek istiyorsunuz?</Text>
        
        <View style={styles.reasonsContainer}>
          {cancelReasons.map((cancelReason, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.reasonButton,
                reason === cancelReason && styles.reasonButtonSelected
              ]}
              onPress={() => setReason(cancelReason)}
            >
              <Text style={[
                styles.reasonText,
                reason === cancelReason && styles.reasonTextSelected
              ]}>
                {cancelReason}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Diğer (Opsiyonel):</Text>
        <TextInput
          style={styles.textInput}
          placeholder="İptal nedeninizi yazın..."
          value={reason === 'Diğer' ? '' : (cancelReasons.includes(reason) ? '' : reason)}
          onChangeText={(text) => setReason(text)}
          multiline
          numberOfLines={3}
          placeholderTextColor="#666"
        />

        <TouchableOpacity
          style={[styles.cancelButton, loading && styles.cancelButtonDisabled]}
          onPress={handleCancelOrder}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>
            {loading ? 'İptal Ediliyor...' : 'Siparişi İptal Et'}
          </Text>
        </TouchableOpacity>
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
    marginBottom: 8,
    color: '#333'
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30
  },
  reasonsContainer: {
    marginBottom: 20
  },
  reasonButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  reasonButtonSelected: {
    borderColor: 'tomato',
    backgroundColor: '#fff5f5'
  },
  reasonText: {
    fontSize: 16,
    color: '#333'
  },
  reasonTextSelected: {
    color: 'tomato',
    fontWeight: '500'
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333'
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 30,
    textAlignVertical: 'top'
  },
  cancelButton: {
    backgroundColor: '#ff4444',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 'auto'
  },
  cancelButtonDisabled: {
    backgroundColor: '#ccc'
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  }
});

export default OrderCancelScreen;
