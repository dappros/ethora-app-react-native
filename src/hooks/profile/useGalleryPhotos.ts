import { useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { request, PERMISSIONS, RESULTS, openSettings, check } from 'react-native-permissions';

export const useGalleryPhotos = (isModalVisible: boolean) => {
  const [images, setImages] = useState<string[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const getGalleryPhotos = async () => {
      const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
      const status = await request(permission);

      const initialStatus = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
      console.log('Initial READ_EXTERNAL_STORAGE status:', initialStatus);
      console.log("status!!!!!!!!!!!!!!!!", status);

      if (status === RESULTS.GRANTED) {
        setHasPermission(true);
      } else if (status === RESULTS.BLOCKED) {
        setHasPermission(false);
        Alert.alert(
          'Permission Blocked',
          'Access to gallery is blocked. Please enable permissions from settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => openSettings() }
          ]
        );
      } else {
        setHasPermission(false);
        Alert.alert('Permission Denied', 'Access to gallery is required to view photos.');
      }
    };

    if (isModalVisible) {
      getGalleryPhotos();
    }
  }, [isModalVisible]);

  const openCamera = async () => {
    const cameraPermission = Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
    const status = await request(cameraPermission);

    if (status !== RESULTS.GRANTED) {
      Alert.alert('Permission Denied', 'Camera permission is required to use this feature.');
      return;
    }

    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
        quality: 1,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error:', response.errorMessage);
        } else if (response.assets && response.assets[0].uri) {
          setImages([response.assets[0].uri, ...images.slice(0, 2)]);
        }
      }
    );
  };

  const openGallery = async () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error:', response.errorMessage);
        } else if (response.assets && response.assets[0].uri) {
          setImages([response.assets[0].uri, ...images.slice(0, 2)]);
        }
      }
    );
  };

  return { images, hasPermission, openCamera, openGallery, setImages };
};
