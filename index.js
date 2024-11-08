/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDQdkvvxKKx4-WrjLQoYf08GFARgi_qO4g',
  authDomain: 'ethora-668e9.firebaseapp.com',
  projectId: 'ethora-668e9',
  storageBucket: 'ethora-668e9.appspot.com',
  messagingSenderId: '972933470054',
  appId: '1:972933470054:web:d4682e76ef02fd9b9cdaa7',
  measurementId: 'G-WHM7XRZ4C8',
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

AppRegistry.registerComponent(appName, () => App);
