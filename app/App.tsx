// App.js

import React from 'react';
import AppNavigator from './src/AppNavigator';
import { enableScreens } from 'react-native-screens';
enableScreens();

const App = () => {
  return <AppNavigator />;
};

export default App;
