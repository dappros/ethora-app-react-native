/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, useColorScheme} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import AppComponent from './src/App';
import {StoreProvider} from './src/stores/context';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <StoreProvider>
      <SafeAreaView style={backgroundStyle}>
        <AppComponent />
      </SafeAreaView>
    </StoreProvider>
  );
}

export default App;
