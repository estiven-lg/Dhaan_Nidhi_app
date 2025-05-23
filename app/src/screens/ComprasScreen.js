import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import getHostname from '../utils';
import userData from '../UserData';

const ComprasScreen = () => {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCompras = async () => {
    try {
      
      const response = await fetch(getHostname() + 'api/compra_producto/usuario/' + userData.user.id_usuario); // <-- ajusta URL
      const data = await response.json();
      setCompras(data);
    } catch (error) {
      console.error('Error cargando compras:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompras();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.row}>
        <Icon name="person" size={18} color="#555" />
        <Text style={styles.label}> Usuario ID: </Text>
        <Text style={styles.value}>{item.id_usuario}</Text>
      </View>
      <View style={styles.row}>
        <Icon name="shopping-cart" size={18} color="#555" />
        <Text style={styles.label}> Producto ID: </Text>
        <Text style={styles.value}>{item.id_producto}</Text>
      </View>
      <View style={styles.row}>
        <Icon name="calendar-today" size={18} color="#555" />
        <Text style={styles.label}> Fecha: </Text>
        <Text style={styles.value}>{new Date(item.fecha).toLocaleDateString()}</Text>
      </View>
      <View style={styles.row}>
        <Icon name="inventory" size={18} color="#555" />
        <Text style={styles.label}> Cantidad: </Text>
        <Text style={styles.value}>{item.cantidad}</Text>
      </View>
      <View style={styles.row}>
        <Icon name="loyalty" size={18} color="#555" />
        <Text style={styles.label}> Puntos usados: </Text>
        <Text style={styles.value}>{item.puntos_usados}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Compras</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={compras}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    alignSelf: 'center',
  },
  item: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontWeight: '600',
    marginLeft: 6,
    color: '#555',
  },
  value: {
    marginLeft: 4,
    color: '#333',
  },
});

export default ComprasScreen;
