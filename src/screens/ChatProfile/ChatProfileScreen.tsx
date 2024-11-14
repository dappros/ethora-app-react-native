import React, { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStores } from "@stores/context";

// Components
import { GroupHeaderContainer, GroupInfoMembers, ProfileContainer, ProfileEditChat } from "@components/Profile";

// Hooks
import { useProfileAnimation } from "@hooks/profile";

// Buttons
import { chatButtons } from "@constants/ProfileButtons";


import { changeRoomDescription, getRoomMemberInfo, roomConfig, roomConfigurationForm } from "../../xmpp/stanzas";


const ChatProfileScreen = observer(({route}: any) => {
  const { chatStore, loginStore } = useStores();
  const { chatJid } = route.params;
 
  const {
    panY,
    isEndReached,
    headerHeight,
    imageOpacity,
    onGestureEvent,
    onHandlerStateChange,
  } = useProfileAnimation();

  const room = chatStore.getRoomDetails(chatJid);
  
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [textDescription, setTextDescription] = useState<string>("description new example hello");
  const [nameChat, setNameChat] = useState<string>("Y Chat Example");

  const chatInformation = useMemo(() => {
    return chatStore.roomsInfoMap[chatJid];
  }, [chatStore.roomsInfoMap[chatJid]])


  const users = useMemo(() => {
    const messagesRoom = chatStore.messages.filter((item) => (
      item.roomJid === chatJid)).map((chat) => chat.user);

    return messagesRoom.filter((item, index, self) =>
      index === self.findIndex((t) => t._id === item._id)
    );
  }, [chatStore.messages]);


  const snapshot = JSON.parse(JSON.stringify(users));
  console.log("chatInformation--", chatInformation);
  console.log("snapshot: ", snapshot);
  console.log("room--", room);
  console.log("roles--", chatStore.roomRoles[chatJid]);
  console.log("chatStore--", chatStore);

  const handleCloseEdit = () => {
    setIsEditVisible(false);
  };

  const handleOpenEditModal = () => {
    setIsEditVisible(true);
  };

  const setChangeChat = () => {
    roomConfigurationForm(
      "",
      room!.jid,
      {roomName: nameChat},
      chatStore.xmpp
    )
    changeRoomDescription(
      "",
      room!.jid,
      textDescription,
      chatStore.xmpp
    );
  };

  return (
    <ProfileContainer
      panY={panY}
      chatButtons={chatButtons}
      chatJid={chatJid}
      headerHeight={headerHeight}
      imageOpacity={imageOpacity}
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
      background={room?.roomThumbnail}
      componentProp={
        <GroupHeaderContainer
          avatar={room?.roomThumbnail}
          name={room?.name}
          members={room?.participants}
          handleOpenEditModal={handleOpenEditModal}
          panY={panY} isEndReached={isEndReached}
        />}
    >
      <GroupInfoMembers
        panY={panY}
        description={chatInformation?.roomDescription}
        members={room?.participants}
        users={users}
      />
      <ProfileEditChat
        avatar={room?.roomThumbnail}
        isEditVisible={isEditVisible}
        handleCloseEdit={handleCloseEdit}
        chatName={room?.name}
        setChangeChat={setChangeChat}
      />
    </ProfileContainer>
  );
});

export default ChatProfileScreen;
