import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import userData from '../UserData';

const HomeScreen = ({ navigation }) => {
  const [language, setLanguage] = useState('en');
  const [balance, setBalance] = useState(1250);

  const handleSetLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const handleRedeem = () => {
    navigation.navigate('Shop');
  };

  const handleViewHistory = () => {
    navigation.navigate('Compras');
  };

  useEffect(() => {
    console.log('User Data:', userData);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

      {/* Header con idioma y carrito */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.languageSelector} onPress={handleSetLanguage}>
          <Text style={styles.languageText}>
            {language === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleViewHistory} style={styles.cartButton}>
          <Icon name="shopping-cart" size={24} color="#2e7d32" />
        </TouchableOpacity>
      </View>

      <Text style={styles.welcomeText}>
        Bienvenido {userData.user.nombre} 👋
      </Text>

      {/* Balance con degradado */}
      <LinearGradient colors={['#A8E063', '#56AB2F']} style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>
          {language === 'hi' ? 'कुल शेष' : 'Total Balance'}
        </Text>
        <Text style={styles.balanceAmount}>{userData.user.puntos}</Text>
        <Text style={styles.balancePoints}>
          {language === 'hi' ? 'पॉइंट्स' : 'Points'} ⭐
        </Text>
      </LinearGradient>

      {/* Botón de canjear puntos */}
      <TouchableOpacity style={styles.redeemButton} onPress={handleRedeem}>
        <Text style={styles.redeemButtonText}>
          {language === 'hi' ? 'पॉइंट्स रिडीम करें' : 'Redeem Points'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  languageSelector: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  languageText: {
    fontSize: 14,
    fontWeight: '600',
  },
  cartButton: {
    padding: 8,
  },
  welcomeText: {
    fontSize: 20, 
    textAlign: 'center', 
    marginTop: 20,
    color: '#333',
  },
  balanceCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    marginTop: 40,
  },
  balanceLabel: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 10,
    fontWeight: '600',
  },
  balanceAmount: {
    color: '#fff',
    fontSize: 60,
    fontWeight: 'bold',
  },
  balancePoints: {
    color: '#fff',
    fontSize: 18,
    marginTop: 8,
  },
  redeemButton: {
    backgroundColor: '#2e7d32',
    marginHorizontal: 40,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  redeemButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;