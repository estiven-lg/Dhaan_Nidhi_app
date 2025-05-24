import React, { useState } from 'react';
import userData from '../UserData';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert
} from 'react-native';
import { getHostname } from '../utils';
import { useTranslation } from 'react-i18next';




const LoginScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isFocusedUser, setIsFocusedUser] = useState(false);
  const [isFocusedPass, setIsFocusedPass] = useState(false);

  const handleLogin = async () => {
    try {

      const res = await fetch(getHostname() + 'api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: username,
          password: password,
        }),
      });


      if (res.status === 200) {
        Alert.alert('Éxito', 'Inicio de sesión exitoso');
        const data = await res.json();
        console.log('User Data:', data);
        userData.user = data.user;
        navigation.replace('Home');
      } else {
        Alert.alert('Error', res.json().message || 'Credenciales inválidas');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Error', 'Error de conexión');
      return;
    }
  };

  const handleSetLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang); // Use i18n's language change function
  };

  const handleCreateAccount = () => {
    navigation.navigate('CrearUsuario');
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.background}>
        <View style={styles.innerContainer}>
          <TouchableOpacity style={styles.languageSelector} onPress={handleSetLanguage}>
            <Text style={styles.languageText}>
              {i18n.language === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}
            </Text>
          </TouchableOpacity>
          <Image
            source={require('../assets/farmer.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>{t('welcome_farmer')}</Text>
          <Text style={styles.subtitle}>{t('login_to_continue')}</Text>

          <TextInput
            placeholder={t('username')}
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
            style={[styles.input, isFocusedUser && styles.inputFocused]}
            onFocus={() => setIsFocusedUser(true)}
            onBlur={() => setIsFocusedUser(false)}
            autoCapitalize="none"
          />

          <TextInput
            placeholder={t('password')}
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={[styles.input, isFocusedPass && styles.inputFocused]}
            onFocus={() => setIsFocusedPass(true)}
            onBlur={() => setIsFocusedPass(false)}
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>{t('login')}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleCreateAccount}>
            <Text style={styles.forgotPassword}>{t('create_account')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};



const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: '#4caf50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#f5f5f5',
    color: '#333',
  },
  inputFocused: {
    borderColor: '#4caf50',
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#4caf50',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#4caf50',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;