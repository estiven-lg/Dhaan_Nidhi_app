// src/screens/PointsScreen.js

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const PointsScreen = ({ navigation }) => {
  // Puntos simulados (luego los conectamos a backend o almacenamiento)
  const points = 120;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tus puntos</Text>
      <Text style={styles.points}>{points} ⭐</Text>

      <View style={{ marginTop: 30 }}>
        <Button title="Canjear puntos" onPress={() => navigation.navigate('Shop')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF9F6',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  points: {
    fontSize: 48,
    color: '#2D6A4F',
  },
});

export default PointsScreen;
