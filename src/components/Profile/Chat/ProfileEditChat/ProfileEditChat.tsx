import React, { FC, useState } from 'react';
import { VStack, HStack, Box, Text, Input, Switch, Button, Center, Divider, NativeBaseProvider, Image } from 'native-base';
// import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import Icon from "react-native-vector-icons/FontAwesome";
import { Keyboard, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import Modal from 'react-native-modal';

// Components
import { EditChatModal, ProfileModalBackground } from '@components/Profile';

// Images
import { Photo } from "@assets/icons";

interface ProfileEditChatProps {
  isEditVisible: boolean;
  handleCloseEdit: () => void;
}


export const ProfileEditChat: FC<ProfileEditChatProps> = (props) => {
  const { isEditVisible, handleCloseEdit } = props;

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isModalChangeBackground, setIsModalChangeBackground] = useState<boolean>(false);
  const [avatarChat, setAvatarChat] = useState<string>("");
  
  const handlePhotoPress = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const changeAvatarChat = (uri: string) => {
    setAvatarChat(uri);
    handleCloseModal();
  };

  const openChangeBackground = () => {
    setIsModalChangeBackground(true);
  };

  const closeChangeBackground = () => {
    setIsModalChangeBackground(false);
  };

  return (
    <NativeBaseProvider>
      <Modal
        isVisible={isEditVisible}
        swipeDirection={undefined}
        onSwipeComplete={undefined}
        backdropOpacity={0.7}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        style={{padding: 0, margin: 0}}
        statusBarTranslucent={true}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} style={{flex: 1}}>
          <Center flex={1} bg="#e9eff6">
            <Box
              bg="white"
              w="83%"
              h="80%"
              p={hp("2%")}
              borderRadius="2xl"
              shadow={2}
              style={{flexDirection: "column", justifyContent: "space-between"}}
            >
              <Text fontSize="md" fontWeight="bold" textAlign="center">
                Edit
              </Text>

              <TouchableOpacity onPress={handlePhotoPress}>
                <Center> 
                  {avatarChat
                    ? <Image size={hp("8%")} borderRadius="full" source={{ uri: avatarChat }} alt="Avatar"/> 
                    : <Box bg="blue.600" size={hp("8%")} borderRadius="full" justifyContent="center" alignItems="center">
                        {/* <Icon as={<Ionicons name="camera" />} size="lg" color="white" /> */}
                        <Icon name="camera" size={9} color="#fff" />
                      </Box>
                  }
                  <Text fontSize="md" mt={hp("1.1%")} color="#000000">
                    Set a new photo
                  </Text>
                </Center>
              </TouchableOpacity>

              <VStack space={hp("2.5%")}>
                <Input
                  placeholder="Chat name"
                  placeholderTextColor="#8F8F8F"
                  variant="Filled"
                  bg="#F5F7F9"
                  borderRadius="lg"
                  fontSize="md"
                  height={hp("5%")}
                  _focus={{ borderColor: 'blue.500' }}
                />
                <Input
                  placeholder="Description (optional)"
                  placeholderTextColor="#8F8F8F"
                  variant="Filled"
                  bg="#F5F7F9"
                  borderRadius="lg"
                  fontSize="md"
                  _focus={{ borderColor: 'blue.500' }}
                  height={hp("9%")}
                  multiline
                />

                <HStack alignItems="center" justifyContent="space-between">
                  <Text color="gray.500" fontSize="xs">
                    Make chat private{'\n'}
                    (requires an invitation to join)
                  </Text>
                  <Switch size="md" offTrackColor="#F5F7F9"/>
                </HStack>
              </VStack>

              <Divider />

   
              <VStack space={4}>
                <TouchableOpacity onPress={openChangeBackground}>
                  <HStack alignItems="center" justifyContent="space-between">
                    <HStack space={2} alignItems="center">
                      {/* <Icon as={<FontAwesome name="image" />} size="md" color="blue.600" /> */}
                      <Icon name="image" size={9} color="blue.600" />
                      <Text fontSize="md">Set a Wallpaper</Text>
                    </HStack>
                    {/* <Icon as={<MaterialIcons name="arrow-forward-ios" />} size="xs" color="gray.400" /> */}
                    <Icon name="arrow" size={9} color="gray.400" />
                      </HStack>
                </TouchableOpacity>
    

                <Divider />
                
                <HStack alignItems="center" justifyContent="space-between">
                  <HStack space={2} alignItems="center">
                    {/* <Icon as={<Ionicons name="musical-notes" />} size="md" color="blue.600" /> */}
                    <Icon name="musical" size={9} color="blue.600" />
                    <Text fontSize="md">Set a Soundtrack</Text>
                  </HStack>
                  {/* <Icon as={<MaterialIcons name="arrow-forward-ios" />} size="xs" color="gray.400" /> */}
                  <Icon name="arrow" size={9} color="gray.400" />

                </HStack>

                <Divider />
                
                <HStack alignItems="center" justifyContent="space-between">
                  <HStack space={2} alignItems="center">
                    {/* <Icon as={<Ionicons name="chatbox-ellipses" />} size="md" color="blue.600" /> */}
                    <Icon name="message" size={9} color="blue.600" />
                    <Text fontSize="md">Set a Chat Bot</Text>
                  </HStack>
                  {/* <Icon as={<MaterialIcons name="arrow-forward-ios" />} size="xs" color="gray.400" /> */}
                  <Icon name="arrow" size={9} color="gray.400" />
                  </HStack>
              </VStack>

              <HStack space={5} justifyContent="center">
                <TouchableOpacity
                  style={{
                    borderRadius: 20,
                    backgroundColor: "#CDCDCD",
                    paddingHorizontal: hp("2%"),
                    paddingVertical: hp("1%")
                  }}
                  onPress={handleCloseEdit}
                >
                  <Text fontSize="md" color="white">
                    Cancel
                  </Text>
                  </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    borderRadius: 20,
                    backgroundColor: "#0052CD",
                    paddingHorizontal: hp("2%"),
                    paddingVertical: hp("1%")
                  }}
                >
                  <Text fontSize="md" color="white">
                    Set changes
                  </Text>
                </TouchableOpacity>
              </HStack>
            </Box>
          </Center>
        </TouchableWithoutFeedback>

        <EditChatModal
          isModalVisible={isModalVisible}
          handleCloseModal={handleCloseModal}
          changeImage={changeAvatarChat}
        />

        <ProfileModalBackground
          closeChangeBackground={closeChangeBackground}
          isModalChangeBackground={isModalChangeBackground}
        />
      </Modal>
    </NativeBaseProvider>
  );
};
