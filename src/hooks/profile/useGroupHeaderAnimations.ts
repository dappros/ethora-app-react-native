import { Animated } from 'react-native';
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

export const useGroupHeaderAnimations = (panY: Animated.Value) => {
  const avatarOpacity = panY.interpolate({
    inputRange: [-hp("55%"), 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const avatarTranslateX = panY.interpolate({
    inputRange: [-hp("25%"), 0],
    outputRange: [0, -80],
    extrapolate: "clamp",
  });

  const containerTranslateY = panY.interpolate({
    inputRange: [-hp("25%"), 0],
    outputRange: [hp("3%"), 0],
    extrapolate: "clamp",
  });

  return { avatarOpacity, avatarTranslateX, containerTranslateY };
};
