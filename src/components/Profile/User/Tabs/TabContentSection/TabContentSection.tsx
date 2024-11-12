// TabContentSection.tsx
import React, { FC, ReactNode, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Animated } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

// Components
import { TabsContainer, TabsItems } from '@components/Profile';

// Types
import { AlternateType, dataUserProfileAllType, DefaultType, tabsHeaderDefault } from '@constants/profileTab';

// Styles
import { styles } from "./TabContentSectionStyle";

interface TabContentSectionProps<T> {
  panY: Animated.Value;
  about: string;
  isTransform: boolean;
  data: dataUserProfileAllType<T>[];
  defaultTab: "all" | "items";
}

export const TabContentSection: FC<TabContentSectionProps<DefaultType | AlternateType>> = (props) => {
  const { panY, about, isTransform } = props;

  const transformTransition = useMemo(() => {
    return isTransform ? '27.5%' : '33%';
  }, [isTransform])

  const tabsTranslateY = panY.interpolate({
    inputRange: [-hp('25%'), 0],
    outputRange: [-hp(transformTransition), 0],
    extrapolate: 'clamp',
  });

  const containerOpacity = panY.interpolate({
    inputRange: [-hp("25%"), 0],
    outputRange: [0.4, 1],
    extrapolate: "clamp",
  });

  return (
    <Animated.View style={[
      styles.containerAnimation,
      { transform: [{ translateY: tabsTranslateY }], opacity: isTransform ? containerOpacity : 1 }
    ]}>
      <View style={styles.aboutContainer}>
        <Text style={styles.aboutTitle}>Description</Text>
        <Text style={styles.aboutText}>{about}</Text>
      </View>

      <TabsContainer
        headerTabs={tabsHeaderDefault}
        defaultTab="items"
      >
        <TabsItems />
      </TabsContainer>
    </Animated.View>
  );
};
