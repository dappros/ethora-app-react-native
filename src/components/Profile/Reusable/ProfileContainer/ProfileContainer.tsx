import React, { FC, ReactNode } from "react";
import { Animated, View, TouchableOpacity } from "react-native";
import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent, State } from "react-native-gesture-handler";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { NativeBaseProvider } from "native-base";

// Components
import {
  ProfileHeaderGroupButtons,
} from "@components/Profile";

// Import Icons
import { Arrow, QRCode } from "@assets/icons";


// Styles
import { styles } from "./ProfileContainerStyle";

// Types
import { ProfileButtonType } from "@constants/ProfileButtons";

// Buttons

interface ProfileContainerType {
  panY: Animated.Value;
  background: string;
  children: ReactNode;
  chatButtons: ProfileButtonType[];
  headerHeight: Animated.AnimatedInterpolation<string | number>;
  imageOpacity: Animated.AnimatedInterpolation<string | number>;
  onGestureEvent: (...args: any[]) => void;
  onHandlerStateChange: (event: PanGestureHandlerGestureEvent) => void;
  componentProp: ReactNode;
}

export const ProfileContainer: FC<ProfileContainerType> = (props) => {
  const {
    panY,
    chatButtons,
    headerHeight,
    imageOpacity,
    onGestureEvent,
    onHandlerStateChange,
    componentProp: ComponentProp,
    children
  } = props;
  
  return (
    <NativeBaseProvider>
      <View style={{height: "100%"}}>
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: "black" }}>
          <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
          >
            <Animated.View style={{ flex: 1 }}>
              <Animated.View style={[styles.header, { height: headerHeight }]}>
                <View style={styles.headerButtons}>
                  <TouchableOpacity><Arrow height={hp("4%")}/></TouchableOpacity>
                  <TouchableOpacity><QRCode height={hp("4%")}/></TouchableOpacity>
                </View>
                <View style={{position: "relative"}}>
                  {ComponentProp}
                  <ProfileHeaderGroupButtons panY={panY} buttons={chatButtons} />
                </View>
              </Animated.View>

              <Animated.Image
                source={require("../../../../assets/temporary/example.webp")}
                style={[styles.headerImage, { opacity: imageOpacity }]}
                resizeMode="cover"
              />

              {children}
            </Animated.View>
          </PanGestureHandler>
        </GestureHandlerRootView>
      </View>
    </NativeBaseProvider>
  );
};
