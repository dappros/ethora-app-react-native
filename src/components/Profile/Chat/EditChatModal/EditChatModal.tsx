import React, { FC, useState, useEffect, useRef } from 'react';
import { View, Text, Image, Button, Divider } from 'native-base';
import { TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { request, PERMISSIONS, RESULTS, check, openSettings } from 'react-native-permissions';

// Components
import { ModalBox } from '@components/Core';

// Hooks
import { useGalleryPhotos } from '@hooks/profile/useGalleryPhotos';

// Styles
import { styles } from './EditChatModalStyles';

// Images
import { Camera as CameraIcon } from "@assets/icons";

interface EditChatModalProps {
  isModalVisible: boolean;
  handleCloseModal: () => void;
  changeImage: (uri: string) => void;
}

export const EditChatModal: FC<EditChatModalProps> = ({ isModalVisible, handleCloseModal, changeImage }) => {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const cameraRef = useRef<RNCamera | null>(null);

  const { images, hasPermission: hasGalleryPermission, openGallery, setImages } = useGalleryPhotos(isModalVisible);

  const requestCameraPermission = async () => {
    const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
    const currentStatus = await check(permission);

    if (currentStatus === RESULTS.GRANTED) {
      setHasCameraPermission(true);
    } else if (currentStatus === RESULTS.BLOCKED) {
      setHasCameraPermission(false);
      Alert.alert(
        'Permission Blocked',
        'Camera access is blocked. Please enable permissions from settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => openSettings() }
        ]
      );
    } else {
      const status = await request(permission);
      setHasCameraPermission(status === RESULTS.GRANTED);
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const handleTakePicture = async () => {
    if (cameraRef.current && hasCameraPermission) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        changeImage(data.uri);
        setImages([data.uri, ...images.slice(0, 2)]);
      } catch (error) {
        console.log('Error taking picture:', error);
      }
    } else {
      console.log('Camera is not ready or permission is not granted.');
    }
  };

  if (hasCameraPermission === null || hasGalleryPermission === null) return <View />;

  if (!hasCameraPermission || !hasGalleryPermission) {
    return (
      <View>
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestCameraPermission}>Grant Permission</Button>
      </View>
    );
  }

  return (
    <ModalBox
      isModalVisible={isModalVisible}
      handleCloseModal={handleCloseModal}
      styleModal={{ paddingHorizontal: 10, paddingBottom: 16 }}
    >
      <View style={styles.containerModal}>
        <Text style={styles.headerText}>The app can only access the photos you select</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator
          style={styles.viewPhoto}
          contentContainerStyle={{ alignItems: 'center', justifyContent: 'flex-start', gap: 10 }}
        >
          <View style={styles.cameraContainer}>
            <RNCamera
              ref={cameraRef}
              style={styles.camera}
              type={RNCamera.Constants.Type.back}
              captureAudio={false}
            />
            <TouchableOpacity style={styles.cameraButton} onPress={handleTakePicture}>
              <CameraIcon style={styles.cameraIcon} />
            </TouchableOpacity>
          </View>

          {images.slice(-3).map((image) => (
            <TouchableOpacity
              key={image}
              style={styles.photoPlaceholder}
              onPress={() => changeImage(image)}
            >
              <Image source={{ uri: image }} alt="Selected Image" style={styles.previewImage} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity onPress={openGallery} style={styles.actionButton}>
          <Text style={styles.modalActionText}>Open Gallery</Text>
        </TouchableOpacity>

        <Divider my={2} bg="#E8EDF2" />

        <TouchableOpacity onPress={() => setImages(images.slice(0, -1))} style={styles.actionButton}>
          <Text style={styles.modalActionText}>Remove Photo</Text>
        </TouchableOpacity>

        <Divider my={2} bg="#E8EDF2" />

        <TouchableOpacity onPress={handleCloseModal} style={styles.actionButton}>
          <Text style={[styles.modalActionText, { color: '#9F0000' }]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ModalBox>
  );
};
