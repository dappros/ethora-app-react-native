import { View, Image, Text, Box, FlatList } from 'native-base';
import React, { useState } from 'react';
import { EditChatModal } from '@components/Profile';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

// Icon
import { CheckCircle } from '@assets/icons';

const images = [
  require("../../../../assets/icons/example/back-1.png"),
  require("../../../../assets/icons/example/back-2.png"),
  require("../../../../assets/icons/example/back-3.png"),
  require("../../../../assets/icons/example/back-4.png"),
  require("../../../../assets/icons/example/back-5.png"),
  require("../../../../assets/icons/example/back-6.png"),
];

export const ProfileWallpaper = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handleImagePress = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handlePhotoPress = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const changeBackground = (uri: string) => {
    handleCloseModal();
  };

  return (
    <View>
      <TouchableOpacity onPress={handlePhotoPress}>
        <Box shadow={5} borderRadius="2xl" bg="white" style={styles.shadowContainer}>
          <View style={styles.card}>
            <Image
              alt="Background"
              source={require("../../../../assets/temporary/my-photo.png")}
              style={styles.image}
            />
            <View>
              <Text fontWeight="bold">My photos</Text>
              <Text color="gray.500">1 356</Text>
            </View>
          </View>
        </Box>
      </TouchableOpacity>

      <FlatList
        data={images}
        numColumns={3}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={styles.imageContainer} onPress={() => handleImagePress(index)}>
            <Image source={item} alt="Gallery Image" style={styles.galleryImage} />
            {selectedImageIndex === index && (
              <View style={styles.checkmarkContainer}>
                <CheckCircle />
              </View>
            )}
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.galleryContainer}
      />

      <EditChatModal
        isModalVisible={isModalVisible}
        handleCloseModal={handleCloseModal}
        changeImage={changeBackground}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    borderRadius: 20,
  },
  card: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 16,
    borderRadius: 20,
    backgroundColor: "white",
  },
  image: {
    width: wp("22%"),
    height: wp("22%"),
    borderRadius: 10,
  },
  galleryContainer: {
    paddingTop: 10,
  },
  imageContainer: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
  },
  galleryImage: {
    borderRadius: 10,
    position: "relative",
  },

  checkmarkContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});
