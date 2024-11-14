import React, { FC, useEffect, useMemo, useState } from 'react';
import { Animated, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Box, Menu, Pressable } from 'native-base';

// Components
import { ListSettings } from '@components/Core/SettingsList';
import { MenuList } from '@components/Core/MenuList';

// Hooks
import { useGroupHeaderAnimations } from '@hooks/profile';

// Import Icons
import { StarIcon, Favorite, Dots } from "@assets/icons";

// Styles
import { styles } from "./GroupHeaderContainerStyle";
import { textStyles } from '../../../../../docs/config';

// Data
import { OptionsSettingProfile } from '@constants/OptionsSettingProfile';

interface GroupHeaderContainerProps {
  name?: string;
  avatar?: string;
  members?: number;
  panY: Animated.Value;
  isEndReached: boolean;
  handleOpenEditModal?: () => void;
}

export const GroupHeaderContainer: FC<GroupHeaderContainerProps> = (props) => {
  const {
    name,
    members,
    panY,
    isEndReached,
    avatar,
    handleOpenEditModal,
  } = props;
  const { avatarOpacity, avatarTranslateX, containerTranslateY } = useGroupHeaderAnimations(panY);

  const [isFavorite, setIsFavorite] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const favoriteIcon = useMemo(() => {
    return isFavorite
      ? <Favorite height={hp("3%")} width={hp("3%")} />
      : <StarIcon height={hp("3%")} width={hp("3%")} />;
  }, [isFavorite]);

  const handlePress = () => {
    if (!isEndReached) {
      console.log("Star pressed");
      setIsFavorite(!isFavorite);
    }
  };

  const actionInteractions = (type: string) => {
    switch (type) {
      case "edit":
        console.log( "edit");
        handleOpenEditModal && handleOpenEditModal();
        setIsOpen(false);
        break;
      case "mute":
        console.log( "mute");
        setIsOpen(false);
        break;
      case "search":
        console.log( "search");
        break;
      case "favourites":
        console.log( "favourites");
        break;
      case "report":
        console.log( "report");
        break;
      case "delete":
        console.log( "delete");
        break;
      default:
        console.log( "default");
    }
  };

  return (
    <Animated.View style={[styles.groupHeaderContainer, { transform: [{ translateY: containerTranslateY }] }]}>
      <View style={styles.userContainer}>
        {avatar
          ? <Animated.Image
              source={{ uri: avatar }}
              style={[
              styles.avatar, {
                opacity: avatarOpacity,
                transform: [{ translateX: avatarTranslateX }]},
                ]}
            />
          : <Animated.View
              style={[styles.nonAvatar, {
                opacity: avatarOpacity,
                transform: [{ translateX: avatarTranslateX }]},
              ]}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: textStyles.boldFont,
                  textTransform: "uppercase",
                  textAlign: "center",
                }}
              >
                {name && name[0] + (name[1] ? name[1] : "")}
              </Text>
            </Animated.View>
        }
        <Animated.View style={[{ transform: [{ translateX: avatarTranslateX }], justifyContent: "center" }]}>
          <Text style={styles.userName}>{name ? name : "Chat name"}</Text>
          <Text style={styles.members}>
            {members} {members && members > 1  ? "members" : "member"}
          </Text>
        </Animated.View>
      </View>
      {isEndReached
        ? <MenuList
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            image={Dots}
            actionInteractions={actionInteractions}
          />
        : <TouchableOpacity style={styles.headerStar} onPress={handlePress}>{favoriteIcon}</TouchableOpacity>}
    </Animated.View>
  )

};
