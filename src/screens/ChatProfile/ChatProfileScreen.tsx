import React, { useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStores } from "@stores/context";

// Components
import { GroupHeaderContainer, GroupInfoMembers, ProfileContainer, ProfileEditChat } from "@components/Profile";

// Hooks
import { useProfileAnimation } from "@hooks/profile";

// Buttons
import { chatButtons } from "@constants/ProfileButtons";


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
  
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [description, setdescription] = useState("");
  const [chatInformation, setChatInformation] = useState(chatStore.roomsInfoMap[chatJid]);

  const room = chatStore.roomList.find((item) => item.jid === chatJid);

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
  console.log("chatStore--", chatStore);
  console.log("loginStore--", loginStore);

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
      chatJid={chatJid}
      headerHeight={headerHeight}
      imageOpacity={imageOpacity}
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
      background={room?.avatar}
      componentProp={
        <GroupHeaderContainer
          avatar={room?.avatar}
          name={room?.name}
          members={room?.participants}
          handleOpenEditModal={handleOpenEditModal}
          panY={panY} isEndReached={isEndReached}
        />}
    >
      <GroupInfoMembers
        panY={panY}
        description={chatInformation.roomDescription}
        members={room?.participants}
        users={users}
      />
      <ProfileEditChat isEditVisible={isEditVisible} handleCloseEdit={handleCloseEdit} />
    </ProfileContainer>
  );
});

export default ChatProfileScreen;
