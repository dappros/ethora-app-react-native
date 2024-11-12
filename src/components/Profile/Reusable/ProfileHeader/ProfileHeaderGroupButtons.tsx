import React, { FC, useEffect, useState } from 'react';
import { Animated, TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { TouchableHighlight } from 'react-native-gesture-handler';

// import Icons
import {
  Bell,
  MuteBell,
  Search,
  Leave,
  Report,
} from "@assets/icons";

// Hooks
import { useAnimatedButtonStyles } from '@hooks/profile';

// Styles
import { styles } from "./ProfileHeaderGroupButtonsStyle";

// Data
import { ProfileButtonType, chatButtons } from '@constants/ProfileButtons';

interface ProfileHeaderGroupButtonsProps {
  panY: Animated.Value;
  mute?: boolean;
  buttons: ProfileButtonType[];
};

export const ProfileHeaderGroupButtons: FC<ProfileHeaderGroupButtonsProps> = (props) => {
  const { panY, mute = true, buttons } = props;
  const { buttonHeight, opacity, iconScale, isVisible } = useAnimatedButtonStyles(panY);

  return (
    <Animated.View style={[styles.buttonsGroup, { opacity }]}>
      {isVisible && <>
        {buttons.map(({id, image: Image, imageMute: ImageMuted, name, nameMuted}) => (
          <View key={id}>
            <TouchableHighlight
              style={[styles.iconButtons, { height: buttonHeight }]}
              onPress={() => console.log("mute")}
            >
              <>
                <View style={[styles.backgroundLayer, { backgroundColor: mute && id === "muted"  ? "#0052CD" : "#50504E" }]} />
                <Animated.View style={[styles.icon, { transform: [{ scale: iconScale }] }]}>
                  {mute && id === "muted" && ImageMuted ? <ImageMuted /> : <Image />}
                </Animated.View>
              </>
            </TouchableHighlight>
            <Text style={styles.textBottom}>
              {mute && id === "muted" ? nameMuted : name}
            </Text>
          </View>
        ))}
      </>}
  </Animated.View>
  );
};
