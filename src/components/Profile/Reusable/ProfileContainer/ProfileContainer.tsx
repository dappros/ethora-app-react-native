import React, { FC, ReactNode, useState } from "react";
import { Animated, View, TouchableOpacity } from "react-native";
import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent, State } from "react-native-gesture-handler";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { NativeBaseProvider } from "native-base";
import { useNavigation } from "@react-navigation/native";

// Components
import {
  ProfileHeaderGroupButtons,
} from "@components/Profile";
import { QRModal } from "@components/Modals/QR/QRModal";

// Import Icons
import { Arrow, QRCode } from "@assets/icons";


// Styles
import { styles } from "./ProfileContainerStyle";

// Types
import { ProfileButtonType } from "@constants/ProfileButtons";
import { HomeStackNavigationProp } from "@/src/navigation/types";

// Buttons

interface ProfileContainerType {
  panY: Animated.Value;
  background?: string;
  chatJid: string;
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
    chatJid,
    headerHeight,
    imageOpacity,
    background,
    onGestureEvent,
    onHandlerStateChange,
    componentProp: ComponentProp,
    children
  } = props;
  const navigation = useNavigation<HomeStackNavigationProp>();

  const [isShowQrModal, setIsShowQrModal] = useState<boolean>(false);

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
                  <TouchableOpacity onPress={() => navigation.goBack()}><Arrow height={hp("4%")}/></TouchableOpacity>
                  <TouchableOpacity onPress={() => setIsShowQrModal(true)}><QRCode height={hp("4%")}/></TouchableOpacity>
                </View>
                <View style={{position: "relative"}}>
                  {ComponentProp}
                  <ProfileHeaderGroupButtons panY={panY} buttons={chatButtons} />
                </View>
              </Animated.View>

              <Animated.Image
                source={{ uri: background }}
                style={[styles.headerImage, { opacity: imageOpacity }]}
                resizeMode="cover"
              />

              {children}
            </Animated.View>
          </PanGestureHandler>
        </GestureHandlerRootView>

        <QRModal
          open={isShowQrModal}
          onClose={() => setIsShowQrModal(false)}
          title={"Chatroom"}
          link={chatJid}
        />
      </View>
    </NativeBaseProvider>
  );
};
