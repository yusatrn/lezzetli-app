// src/navigation/AppNavigator.js
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import useUserStore from '../state/userStore';

// Ekranlar
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import MenuScreen from '../screens/MenuScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import { ActivityIndicator, View, Text } from 'react-native';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import OrderCancelScreen from '../screens/OrderCancelScreen';

const ProfileStack = createNativeStackNavigator();
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="ProfilePage" component={ProfileScreen} options={{ title: 'Profil' }} />
      <ProfileStack.Screen name="OrderHistory" component={OrderHistoryScreen} options={{ title: 'Sipariş Geçmişim' }} />
      <ProfileStack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ title: 'Sipariş Detayı' }} />
      <ProfileStack.Screen name="OrderCancel" component={OrderCancelScreen} options={{ title: 'Sipariş İptali' }} />
    </ProfileStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          try {
            let iconName;

            if (route.name === 'Menu') {
              iconName = focused ? 'restaurant' : 'restaurant-outline';
            } else if (route.name === 'Favoriler') {
              iconName = focused ? 'heart' : 'heart-outline';
            } else if (route.name === 'Sepet') {
              iconName = focused ? 'basket' : 'basket-outline';
            } else if (route.name === 'Profil') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          } catch (error) {
            // Yedek emoji ikonlar
            let emoji;
            if (route.name === 'Menu') {
              emoji = '🍽️';
            } else if (route.name === 'Favoriler') {
              emoji = focused ? '❤️' : '🤍';
            } else if (route.name === 'Sepet') {
              emoji = '🛒';
            } else if (route.name === 'Profil') {
              emoji = '👤';
            }
            
            return (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: size * 0.8 }}>{emoji}</Text>
              </View>
            );
          }
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
        },
      })}
    >
      <Tab.Screen name="Menu" component={MenuScreen} options={{headerShown: false, title: 'Menü'}} />
      <Tab.Screen name="Favoriler" component={FavoritesScreen} options={{headerShown: false, title: 'Favoriler'}} />
      <Tab.Screen name="Sepet" component={CartScreen} options={{title: 'Sepet'}} />
      {/* Profil sekmesi artık bir ekranı değil, bir Stack'i çağıracak */}
      <Tab.Screen 
        name="Profil" 
        component={ProfileStackNavigator} 
        options={{ headerShown: false, title: 'Profil' }} // Stack'in kendi başlığı olacağı için bunu kapattık
      />
    </Tab.Navigator>
  );
}

const AppNavigator = () => {
  // userStore'dan kullanıcı ve yüklenme durumunu alıyoruz
  const { user, isLoading, setUser, clearUser } = useUserStore();

  // useEffect ile uygulama ilk açıldığında Firebase'in auth durumunu dinliyoruz
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Kullanıcı giriş yapmışsa (veya önceden yapmışsa)
        setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
      } else {
        // Kullanıcı giriş yapmamışsa
        clearUser();
      }
    });

    // component kapandığında dinleyiciyi kaldır
    return () => unsubscribe();
  }, []);

  // İlk kontrol yapılırken yükleme ekranı göster
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          // user state'i doluysa ana uygulama ekranlarını göster
          <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        ) : (
          // user state'i boşsa giriş/kayıt ekranlarını göster
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Kayıt Ol' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;