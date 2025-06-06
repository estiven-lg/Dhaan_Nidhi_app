import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  SafeAreaView,
  ActivityIndicator,
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import getHostname from '../utils';
import userData from '../UserData';

import { useTranslation } from 'react-i18next';

/**
 * Registra una nueva compra de producto en el sistema
 * @param {number} id_producto - ID del producto comprado
 * @param {number} cantidad - Cantidad de unidades compradas
 * @param {number} puntos_usados - Puntos totales utilizados en la compra
 * @returns {Promise<Object>} - Respuesta del servidor
 */
const createProductPurchase = async (id_producto, cantidad, puntos_usados) => {
  try {
    const currentDate = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

    const response = await fetch(getHostname() + 'api/compra_producto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Aquí puedes agregar headers de autenticación si es necesario
      },
      body: JSON.stringify({
        id_usuario: userData.user.id_usuario,
        id_producto,
        fecha: currentDate,
        cantidad,
        puntos_usados
      })
    });


    if (!response.status === 201) {
      Alert.alert(
        'Error',
        'Ocurrió un error al registrar la compra. Por favor, inténtalo de nuevo.'
      );
      throw new Error('Error en la respuesta del servidor');
    }

    Alert.alert(
      'Compra Exitosa',
      `Has canjeado ${cantidad} unidades de producto por ${puntos_usados} puntos.`
    );
    // return await response.text();
  } catch (error) {
    console.log('Error en createProductPurchase:', error);
    throw error; // Re-lanzamos el error para manejarlo en el componente
  }
};

const ShopScreen = ({ navigation }) => {
  const { t } = useTranslation(); // Add this line
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(getHostname() + 'api/usuarios/' + userData.user.id_usuario);
      const data = await response.json();
      userData.user = data;
    } catch (error) {
      console.error(t('fetch_user_error'), error);
      return userData.user.puntos;
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(getHostname() + 'api/producto');
      const data = await response.json();
      return data.map(product => ({
        ...product,
        quantity: 1
      }));
    } catch (error) {
      console.error(t('fetch_products_error'), error);
      return products;
    }
  };

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [newPoints, newProducts] = await Promise.all([
        fetchUserData(),
        fetchProducts()
      ]);
      setProducts(newProducts);
    } catch (error) {
      Alert.alert(t('error'), t('refresh_error'));
    } finally {
      setLoading(false);
    }
  }, []);
  // Carga inicial
  useEffect(() => {
    const loadData = async () => {
      // setLoading(true);
      await refreshData();
      // setLoading(false);
    };
    loadData().then(console.log).catch(console.error);
  }, [refreshData]);
  
  const handleQuantityChange = (id, value) => {
    const newQuantity = parseInt(value) || 1;
    if (newQuantity < 1) return;

    setProducts(products.map(product =>
      product.id_producto === id
        ? { ...product, quantity: Math.min(newQuantity, product.stock) }
        : product
    ));
  };
  const handleRedeem = async (product) => {
    if (product.stock <= 0) {
      Alert.alert(t('out_of_stock'), t('product_unavailable'));
      return;
    }

    const totalPoints = product.precio_puntos * product.quantity;

    if (userData.user.puntos >= totalPoints) {
      try {
        Alert.alert(
          t('confirm_redeem'),
          t('redeem_confirmation_message', {
            quantity: product.quantity,
            name: product.nombre,
            points: totalPoints
          }),
          [
            {
              text: t('cancel'),
              style: 'cancel'
            },
            {
              text: t('confirm'),
              onPress: async () => {
                await createProductPurchase(
                  product.id_producto,
                  product.quantity,
                  totalPoints
                );
                refreshData();
                Alert.alert(
                  t('redeem_success'),
                  t('redeem_success_message', {
                    quantity: product.quantity,
                    name: product.nombre,
                    points: userData.user.puntos
                  }),
                  [{ text: t('ok') }]
                );
              }
            }
          ]
        );
      } catch (error) {
        Alert.alert(t('error'), t('purchase_error') + error.message);
      }
    } else {
      Alert.alert(
        t('insufficient_points'),
        t('points_needed_message', {
          needed: totalPoints - userData.user.puntos,
          quantity: product.quantity,
          name: product.nombre
        }),
        [{ text: t('understand') }]
      );
    }
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.productCard}>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.nombre}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.descripcion}
        </Text>

        <View style={styles.productDetails}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(item.id_producto, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Icon name="remove" size={20} color={item.quantity <= 1 ? '#ccc' : '#4CAF50'} />
            </TouchableOpacity>

            <TextInput
              style={styles.quantityInput}
              value={item.quantity.toString()}
              onChangeText={(text) => handleQuantityChange(item.id_producto, text)}
              keyboardType="numeric"
              maxLength={3}
            />

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(item.id_producto, item.quantity + 1)}
              disabled={item.quantity >= item.stock}
            >
              <Icon name="add" size={20} color={item.quantity >= item.stock ? '#ccc' : '#4CAF50'} />
            </TouchableOpacity>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>{item.precio_puntos * item.quantity} {t('points')}</Text>
            <Text style={styles.productStock}>
              {item.stock > 0 ? `${t('available')}: ${item.stock}` : t('sold_out')}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.redeemButton,
          (userData.user.puntos < item.precio_puntos * item.quantity || item.stock <= 0) && styles.disabledButton
        ]}
        onPress={() => handleRedeem(item)}
        disabled={userData.user.puntos < item.precio_puntos * item.quantity || item.stock <= 0}
      >
        <Icon name="shopping-cart" size={20} color="white" />
        <Text style={styles.redeemButtonText}>{t('redeem')}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('product_store')}</Text>
        <TouchableOpacity onPress={refreshData}>
          <Icon name="refresh" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      <View style={styles.pointsContainer}>
        <View style={styles.pointsHeader}>
          <Text style={styles.pointsText}>{t('your_points')}:</Text>
          <TouchableOpacity onPress={refreshData}>
            <Icon name="refresh" size={20} color="#4CAF50" />
          </TouchableOpacity>
        </View>
        <View style={styles.pointsValue}>
          <Icon name="star" size={24} color="#FFD700" />
          <Text style={styles.pointsNumber}>{userData.user.puntos}</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>{t('loading_products')}</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id_producto.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>{t('no_products')}</Text>
          }
        />
      )}
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  pointsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pointsText: {
    fontSize: 18,
    color: '#555',
  },
  pointsValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginLeft: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    padding: 8,
  },
  quantityInput: {
    width: 40,
    textAlign: 'center',
    fontSize: 16,
    padding: 4,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  productStock: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  redeemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  disabledButton: {
    backgroundColor: '#BDBDBD',
  },
  redeemButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#666',
  },
});

export default ShopScreen;