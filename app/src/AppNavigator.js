import React from 'react';
import LoginScreen from './screens/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next'; // Asegúrate de instalar react-i18next

// Pantallas
import HomeScreen from './screens/HomeScreen';
import PointsScreen from './screens/PointsScreen';
import ShopScreen from './screens/ShopScreen';
import CrearUsuarioScreen from './screens/CrearUsuarioScreen';
import ComprasScreen from './screens/ComprasScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { t } = useTranslation();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Compras" component={ComprasScreen} options={{ title: t('purchases') }} />
        <Stack.Screen name="CrearUsuario" component={CrearUsuarioScreen} options={{ title: t('create_user') }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: t('login') }} />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: t('app_name') }}
        />
        <Stack.Screen
          name="Points"
          component={PointsScreen}
          options={{ title: t('my_points') }}
        />
        <Stack.Screen
          name="Shop"
          component={ShopScreen}
          options={{ title: t('shop') }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;