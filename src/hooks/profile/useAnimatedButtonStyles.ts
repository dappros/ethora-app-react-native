import { useEffect, useState } from 'react';
import { Animated } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

export const useAnimatedButtonStyles = (panY: Animated.Value) => {
  const [isVisible, setIsVisible] = useState(true);

  const buttonHeight = panY.interpolate({
    inputRange: [-hp("15%"), 0],
    outputRange: [0, wp("15%")],
    extrapolate: "clamp",
  });

  const opacity = panY.interpolate({
    inputRange: [-hp("24%"), 0],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const iconScale = panY.interpolate({
    inputRange: [-hp("15%"), 0],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  useEffect(() => {
    const opacityListener = opacity.addListener(({ value }) => {
      setIsVisible(value > 0);
    });
  
    return () => {
      opacity.removeListener(opacityListener);
    };
  }, [opacity]);

  return { buttonHeight, opacity, iconScale, isVisible };
};
