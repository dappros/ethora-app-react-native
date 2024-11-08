/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Box, HStack, Text, View } from "native-base";
import AntIcon from "react-native-vector-icons/AntDesign";
import { TouchableOpacity } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { appVersion, commonColors, textStyles } from "../../../docs/config";
import { HomeStackNavigationProp } from "../../navigation/types";
import { useStores } from "../../stores/context";
import { RoomHeaderIcon } from "./RoomHeaderIcon";

interface SecondaryHeaderProps {
  title: string;
  isQR?: boolean;
  type?: string;
  showVersion?: boolean;
  onQRPressed?: any;
  isChatRoomDetail?: boolean;
  roomJID?: string;
  onBackPress?: () => void;
}

const SecondaryHeader: React.FC<SecondaryHeaderProps> = ({
  title,
  isQR,
  type,
  showVersion,
  onQRPressed,
  isChatRoomDetail,
  roomJID,
  onBackPress,
}) => {
  const navigation = useNavigation<HomeStackNavigationProp>();
  const { chatStore } = useStores();

  const onArrowClick = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }
    navigation.goBack();
  };

  const handleGoToChatSettings = () => {
    navigation.navigate("ChatDetailsScreen", {
      roomName: title,
      roomJID: roomJID || "",
    });
  };

  const room = chatStore.roomList.find((item) => item.jid === roomJID);

  return (
    <Box
      h={67}
      justifyContent={"center"}
      bg={"white"}
      borderBottomRadius={15}
      overflow={"hidden"}
    >
      <HStack
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          paddingHorizontal: 28,
        }}
      >
        <TouchableOpacity
          accessibilityLabel="Back button"
          style={{
            display: "flex",
            justifyContent: "center",
          }}
          onPress={onArrowClick}
        >
          <AntIcon
            name={"arrowleft"}
            style={{ marginRight: 5, marginLeft: 5 }}
            size={hp("3%")}
            color={"#0052CD"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ width: widthPercentageToDP(60) }}
          accessibilityLabel="Screen title"
          activeOpacity={1}
          onPress={handleGoToChatSettings}
        >
          <Text
            fontFamily={textStyles.semiBoldFont}
            fontSize={hp("2.2%")}
            color={"black"}
            textAlign="center"
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text style={{ color: "#8F8F8F", textAlign: "center" }}>
            {room?.participants} {room?.participants > 1 ? "members" : "member"}
          </Text>
        </TouchableOpacity>

        <View style={{}}>
          {/* {isQR && (
            <TouchableOpacity
              accessibilityLabel="QR button"
              onPress={onQRPressed}
              style={{ marginRight: 10 }}
            >
              <FontAwesomeIcon name="qrcode" color="#FFFF" size={hp("3.7%")} />
            </TouchableOpacity>
          )}
          {type === "transaction" && (
            <TouchableOpacity
              style={{ flex: 0.2, alignItems: "flex-end", marginRight: 10 }}
            >
              <AntIcon name="filter" color="#FFFF" size={hp("3%")} />
            </TouchableOpacity>
          )}
          {showVersion && (
            <Text style={{ color: "white", position: "absolute", right: 30 }}>
              Version: {appVersion}
            </Text>
          )} */}
          <RoomHeaderIcon
            name={room?.name}
            jid={room?.jid}
            onClick={onQRPressed}
          />
        </View>
      </HStack>
    </Box>
  );
};

export default SecondaryHeader;
