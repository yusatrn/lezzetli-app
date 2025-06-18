// App.js
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);

  useEffect(() => {
    // Firebase servislerini lazy load ile başlat
    const initializeFirebase = async () => {
      try {
        // Firebase config'i dinamik olarak import et
        const { auth, db } = await import('./firebaseConfig');
        
        console.log('Firebase Auth initialized:', !!auth);
        console.log('Firebase DB initialized:', !!db);
        
        setIsFirebaseReady(true);
      } catch (error) {
        console.error('Firebase initialization error:', error);
        // Hata olsa bile uygulamayı başlat
        setIsFirebaseReady(true);
      }
    };

    initializeFirebase();
  }, []);

  if (!isFirebaseReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10 }}>Uygulama başlatılıyor...</Text>
      </View>
    );
  }

  return <AppNavigator />;
}