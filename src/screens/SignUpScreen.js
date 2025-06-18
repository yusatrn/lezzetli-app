// src/screens/SignUpScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig'; // auth'u import et
// Not: Dosya yolu projenizin yapısına göre değişebilir.
// Eğer firebaseConfig.js ana dizindeyse, yol doğrudur.

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    if (email && password) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        // Başarılı kayıt sonrası state'i userStore güncelleyecek,
        // AppNavigator bizi otomatik olarak ana ekrana atacak.
      } catch (error) {
        Alert.alert('Kayıt Hatası', error.message);
      }
    }
  };

  // ... return ve styles kısmı aynı kalabilir ...
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kayıt Ol</Text>
      <TextInput style={styles.input} placeholder="E-posta" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Şifre" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Kayıt Ol" onPress={handleSignUp} />
       <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Zaten bir hesabın var mı? Giriş Yap</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 12, padding: 10, borderRadius: 5 },
  linkText: { color: 'blue', textAlign: 'center', marginTop: 20 },
});
export default SignUpScreen;