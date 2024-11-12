import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

// Components
import { GroupHeaderContainer, GroupInfoMembers, ProfileContainer, ProfileEditChat } from "@components/Profile";

// Hooks
import { useProfileAnimation } from "@hooks/profile";

// Buttons
import { chatButtons } from "@constants/ProfileButtons";

// Data
import { data } from "@constants/profileTab";


const ChatProfileScreen = () => {
  const {
    panY,
    isEndReached,
    headerHeight,
    imageOpacity,
    onGestureEvent,
    onHandlerStateChange,
  } = useProfileAnimation();
  
  const [isEditVisible, setIsEditVisible] = useState(false);

  const handleCloseEdit = () => {
    setIsEditVisible(false);
  };

  const handleOpenEditModal = () => {
    setIsEditVisible(true);
  };

  return (
    <ProfileContainer
      panY={panY}
      chatButtons={chatButtons}
      headerHeight={headerHeight}
      imageOpacity={imageOpacity}
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
      background="../../assets/images/example.webp"
      componentProp={<GroupHeaderContainer handleOpenEditModal={handleOpenEditModal} panY={panY} isEndReached={isEndReached} />}
    >
      <GroupInfoMembers
        panY={panY}
        description="TextTextTextTextTextTextTextTextTextTextTextTextTextTextTextTextTextTextText"
        members={3}
        users={data}
      />
      <ProfileEditChat isEditVisible={isEditVisible} handleCloseEdit={handleCloseEdit} />
    </ProfileContainer>
  );
};

export default ChatProfileScreen;
