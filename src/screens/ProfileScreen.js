// src/screens/ProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import useUserStore from '../state/userStore';

const ProfileScreen = ({ navigation }) => {
  const user = useUserStore((state) => state.user);

  const handleLogout = async () => {
    Alert.alert(
      "Çıkış Yap",
      "Hesabınızdan çıkış yapmak istediğinizden emin misiniz?",
      [
        {
          text: "İptal",
          style: "cancel"
        },
        {
          text: "Çıkış Yap",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
            } catch (error) {
              console.error("Çıkış yaparken hata:", error);
              Alert.alert("Hata", "Çıkış yaparken bir sorun oluştu.");
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <Text style={styles.title}>Profilim</Text>
          {user && <Text style={styles.emailText}>{user.email}</Text>}
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('OrderHistory')}
          >
            <Text style={styles.menuItemText}>📋 Sipariş Geçmişim</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
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
        paddingHorizontal: 20
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 40,
        backgroundColor: 'white',
        marginTop: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'tomato',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white'
    },
    title: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        marginBottom: 8,
        color: '#333'
    },
    emailText: { 
        fontSize: 16, 
        color: '#666',
        textAlign: 'center'
    },
    menuSection: {
        marginTop: 30
    },
    menuItem: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2
    },
    menuItemText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333'
    },
    menuArrow: {
        fontSize: 20,
        color: '#ccc',
        fontWeight: '300'
    },
    logoutButton: {
        backgroundColor: '#ff4444',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 'auto',
        marginBottom: 40
    },
    logoutButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    }
});

export default ProfileScreen;