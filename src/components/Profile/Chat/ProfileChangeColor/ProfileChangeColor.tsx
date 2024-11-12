import { FlatList, View } from 'native-base';
import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

// Colors
import { colorsChat } from '@constants/colorsChat';

// Image
import { CheckCircle } from '@assets/icons';



export const ProfileChangeColor = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handleImagePress = (index: number) => {
    setSelectedImageIndex(index);
  };

  return (
    <FlatList
      data={colorsChat}
      numColumns={4}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => (
        <TouchableOpacity style={styles.imageContainer} onPress={() => handleImagePress(index)}>
          <View style={[styles.galleryImage, { backgroundColor: item }]}/>
          {selectedImageIndex === index && (
            <View style={styles.checkmarkContainer}>
              <CheckCircle />
            </View>
          )}
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.galleryContainer}
    />
  );
};

const styles = StyleSheet.create({
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
    width: wp("16.8%"),
    aspectRatio: 1/1,
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