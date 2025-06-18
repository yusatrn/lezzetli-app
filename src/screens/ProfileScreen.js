// src/screens/ProfileScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import useUserStore from '../state/userStore';

const ProfileScreen = () => {
  const user = useUserStore((state) => state.user);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Çıkış yaparken hata:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profilim</Text>
      {user && <Text style={styles.emailText}>{user.email}</Text>}

      {/* YENİ BUTON */}
      <View style={styles.buttonContainer}>
        <Button 
          title="Sipariş Geçmişim"
          onPress={() => navigation.navigate('OrderHistory')} // Yeni ekrana yönlendirme
        />
      </View>

      <Button title="Çıkış Yap" onPress={handleLogout} color="red" />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    emailText: { fontSize: 18, marginBottom: 20 },
    buttonContainer: { // Butonlar arasına boşluk koymak için
        marginVertical: 20,
        width: '60%'
    }
});
export default ProfileScreen;