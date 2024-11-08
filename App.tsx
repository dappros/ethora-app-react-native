/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, useColorScheme} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import AppComponent from './src/App';
import {StoreProvider} from './src/stores/context';
import { View, Text } from 'react-native';

declare var global: any;
global.NetInfo = NetInfo;

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <StoreProvider>
        <AppComponent />
    </StoreProvider>
  );
}

export default App;
