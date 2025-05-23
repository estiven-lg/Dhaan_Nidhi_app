// src/AppNavigator.js

import React from 'react';
import LoginScreen from './screens/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Pantallas
import HomeScreen from './screens/HomeScreen';
import PointsScreen from './screens/PointsScreen';
import ShopScreen from './screens/ShopScreen';
import CrearUsuarioScreen from './screens/CrearUsuarioScreen';
import ComprasScreen from './screens/ComprasScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Compras" component={ComprasScreen} />
        <Stack.Screen name="CrearUsuario" component={CrearUsuarioScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'NF Khoontee' }}
        />
        <Stack.Screen
          name="Points"
          component={PointsScreen}
          options={{ title: 'My Points' }}
        />
        <Stack.Screen
          name="Shop"
          component={ShopScreen}
          options={{ title: 'Shop' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
