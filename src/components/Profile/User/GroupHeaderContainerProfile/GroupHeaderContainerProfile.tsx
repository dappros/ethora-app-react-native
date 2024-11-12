import React, { FC } from 'react';
import { View, Text, Animated } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

// Images
import { Coin, SecondCoin } from '@assets/icons';

// Hooks
import { useGroupHeaderAnimations } from '@hooks/profile';
// Style
import { styles } from "./GroupHeaderContainerProfileStyle";


interface GroupHeaderContainerProfileType {
  panY: Animated.Value;
  numberCoin: number;
  secondNumberCoin: number;
  onTransaction: () => void;
};

export const GroupHeaderContainerProfile: FC<GroupHeaderContainerProfileType> = (props) => {
  const { panY, numberCoin, secondNumberCoin, onTransaction } = props;
  const { avatarOpacity, avatarTranslateX, containerTranslateY } = useGroupHeaderAnimations(panY);

  return (
    <Animated.View style={[styles.groupHeaderContainer, { transform: [{ translateY: containerTranslateY }] }]}>
    <View style={styles.userContainer}>
      <Animated.Image
        source={require("../../../../assets/temporary/example.webp")}
        style={[
          styles.avatar,
          {
            opacity: avatarOpacity,
            transform: [{ translateX: avatarTranslateX }],
          },
        ]} />
      <Animated.View style={[{ transform: [{ translateX: avatarTranslateX }], justifyContent: "center" }]}>
        <Text style={styles.userName}>User name</Text>
      </Animated.View>
    </View>
    
    <TouchableOpacity style={styles.coinsContainer} onPress={onTransaction}>
      <View style={styles.coinsBlock}>
        <Coin />
        <Text style={styles.coinsText}>{numberCoin}</Text>
      </View>

      <View style={styles.coinsBlock}>
        <SecondCoin />
        <Text style={styles.coinsText}>{secondNumberCoin}</Text>
      </View>
    </TouchableOpacity>
  </Animated.View>
  );
};
