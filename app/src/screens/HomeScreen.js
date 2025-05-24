import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import userData from '../UserData';
import { useTranslation } from 'react-i18next'; // Importa el hook useTranslation
import getHostname from '../utils';

const HomeScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation(); // Get i18n instance
  const [loading, setLoading] = useState(false);


  const handleSetLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang); // Use i18n's language change function
  };

  const handleRedeem = () => {
    navigation.navigate('Shop');
  };

  const handleViewHistory = () => {
    navigation.navigate('Compras');
  };

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await fetch(getHostname() + 'api/usuarios/' + userData.user.id_usuario);
      const data = await response.json();
      userData.user = data;
    } catch (error) {
      console.error(t('fetch_user_error'), error);
      return userData.user.puntos;
    }
    finally {
      setLoading(false);
    }
  };



  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

      {/* Header con idioma y carrito */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.languageSelector} onPress={handleSetLanguage}>
          <Text style={styles.languageText}>
            {i18n.language === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={fetchUserData} style={styles.cartButton}>
          <Icon name="refresh" size={24} color="#2e7d32" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleViewHistory} style={styles.cartButton}>
          <Icon name="shopping-cart" size={24} color="#2e7d32" />
        </TouchableOpacity>
      </View>

      <Text style={styles.welcomeText}>
        {t('welcome_message', { name: userData.user.nombre })} 👋
      </Text>


      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>{t('loading_products')}</Text>
        </View>
      )
        :
        <LinearGradient colors={['#A8E063', '#56AB2F']} style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>{t('total_balance')}</Text>
          <Text style={styles.balanceAmount}>{userData.user.puntos}</Text>
          <Text style={styles.balancePoints}>{t('points')} ⭐</Text>
        </LinearGradient>
      }

      {/* Botón de canjear puntos */}
      <TouchableOpacity style={styles.redeemButton} onPress={handleRedeem}>
        <Text style={styles.redeemButtonText}>{t('redeem_points')}</Text>
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