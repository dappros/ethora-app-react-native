import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RootStack from './navigation/RootStack';
import {NativeBaseProvider} from 'native-base';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StatusBar} from 'react-native';

const AppComponent = () => {
  return (
    <NativeBaseProvider>
      <StatusBar />
      <NavigationContainer>
        <GestureHandlerRootView style={{flex: 1}}>
          <RootStack />
        </GestureHandlerRootView>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default AppComponent;
