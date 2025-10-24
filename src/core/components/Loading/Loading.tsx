import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';

interface LoadingProps {
  size?: number;
  color?: string;
  backgroundColor?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 30,
  color = '#0052CD',
  backgroundColor = '#000000',
}) => {
  const outerRotation = useRef(new Animated.Value(0)).current;
  const innerRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Анимация внешнего круга (синий) - по часовой стрелке
    const outerAnimation = Animated.loop(
      Animated.timing(outerRotation, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // Анимация внутреннего круга (черный) - против часовой стрелки
    const innerAnimation = Animated.loop(
      Animated.timing(innerRotation, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    outerAnimation.start();
    innerAnimation.start();

    return () => {
      outerAnimation.stop();
      innerAnimation.stop();
    };
  }, []);

  const outerSpin = outerRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const innerSpin = innerRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });

  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${circumference * 0.75} ${circumference * 0.25}`;

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      {/* Внешний круг (синий) */}
      <Animated.View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          transform: [{ rotate: outerSpin }],
        }}
      >
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: 'transparent',
            borderTopColor: color,
            borderRightColor: color,
            borderBottomColor: color,
          }}
        />
      </Animated.View>

      {/* Внутренний круг (черный) */}
      <Animated.View
        style={{
          position: 'absolute',
          width: size * 0.8,
          height: size * 0.8,
          transform: [{ rotate: innerSpin }],
        }}
      >
        <View
          style={{
            width: size * 0.8,
            height: size * 0.8,
            borderRadius: (size * 0.8) / 2,
            borderWidth: strokeWidth * 0.8,
            borderColor: 'transparent',
            borderBottomColor: backgroundColor,
            borderLeftColor: backgroundColor,
            borderTopColor: backgroundColor,
          }}
        />
      </Animated.View>
    </View>
  );
};

export default Loading;
