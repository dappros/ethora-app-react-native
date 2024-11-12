import React, { FC, useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { View, Text, Image } from 'native-base';

// Components
import { ProfileChangeColor, ProfileWallpaper } from '@components/Profile';

// Import Icons
import { Arrow } from "@assets/icons";

interface ProfileModalBackgroundType {
  isModalChangeBackground: boolean;
  closeChangeBackground: () => void;
}

export const ProfileModalBackground: FC<ProfileModalBackgroundType> = (props) => {
  const { isModalChangeBackground, closeChangeBackground } = props;
  const [activeTab, setActiveTab] = useState("Wallpaper");
  const [tabLayouts, setTabLayouts] = useState<{ Wallpaper: number; Color: number }>({ Wallpaper: 0, Color: 0 });

  const translateX = useSharedValue(0);
  const indicatorWidth = 89;

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    translateX.value = withTiming(tab === "Wallpaper" ? tabLayouts.Wallpaper : tabLayouts.Color, { duration: 300 });
  };

  const onTabLayout = (tab: string, event: any) => {
    const { x, width } = event.nativeEvent.layout;
    const centeredPosition = x + width / 2 - indicatorWidth / 2;
    setTabLayouts((prevLayouts) => ({ ...prevLayouts, [tab]: centeredPosition }));
  };

  const indicatorStyle = useAnimatedStyle(() => ({
    width: indicatorWidth,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Modal
      isVisible={isModalChangeBackground}
      onSwipeComplete={closeChangeBackground}
      backdropOpacity={0.7}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      style={{ padding: 0, margin: 0 }}
      statusBarTranslucent={true}
    >
      <Image
        style={styles.headerImage}
        alt="Background"
        source={require("../../../../assets/temporary/example.webp")}
      />
      <View style={styles.header}>
        <TouchableOpacity onPress={closeChangeBackground}>
          <Arrow height={hp("4%")} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerText}>Change background</Text>
        </View>
        <View style={{ width: hp("4%"), height: hp("4%") }} />
      </View>

      <View style={styles.container}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => handleTabPress("Wallpaper")}
            style={styles.tab}
            onLayout={(event) => onTabLayout("Wallpaper", event)}
          >
            <Text style={[styles.tabText, activeTab === "Wallpaper" && styles.activeTabText]}>Wallpaper</Text>
            {activeTab === "Wallpaper" && <View style={styles.indicator} />}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleTabPress("Color")}
            style={styles.tab}
            onLayout={(event) => onTabLayout("Color", event)}
          >
            <Text style={[styles.tabText, activeTab === "Color" && styles.activeTabText]}>Color</Text>
            {activeTab !== "Wallpaper" && <View style={styles.indicator} />}
          </TouchableOpacity>
          {/* <Animated.View style={[styles.indicator, indicatorStyle]} /> */}
        </View>
        <View style={styles.content}>
          {activeTab === "Wallpaper" ? (
            <ProfileWallpaper />
          ) : (
            <ProfileChangeColor />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: hp("11%"),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp("9%"),
    paddingTop: hp("3%")
  },
  headerText: {
    fontSize: 18,
    color: "#FFFFFF"
  },
  headerImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#000000",
    opacity: 0.8
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: hp("2.8%"),
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingHorizontal: wp("9%"),
  },
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  tab: {
    marginRight: 24,
  },
  tabText: {
    fontSize: 14,
    color: "#0052CD",
  },
  activeTabText: {
    fontWeight: "800"
  },
  indicator: {
    bottom: -3,
    height: 2,
    backgroundColor: "#0052CD",
    borderRadius: 1.5,
  },
  content: {
    flex: 1,
    marginTop: 15,
  },
});
