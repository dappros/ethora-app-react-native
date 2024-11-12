import React, { FC, useMemo } from 'react';
import Modal from 'react-native-modal';
import {
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Avatar, View, Text } from 'native-base';

// Components
import { ModalBox } from '@components/Core';

// Icons
import {
  Profile,
  Administrator,
  Ban,
  Unban,
  KickOut
} from "@assets/icons";

// Styles
import { styles } from "./ProfileModalUserStyle";

// Data
import { ExampleData } from '@constants/profileTab';

// Types Data

interface ProfileModalUserProps {
  isModalVisible: boolean;
  handleCloseModal: () => void;
  selectedUser: ExampleData | null;
  isAdmin?: boolean;
}

export const ProfileModalUser:FC<ProfileModalUserProps> = (props) => {
  const {
    isModalVisible,
    handleCloseModal,
    selectedUser,
    isAdmin = true,
  } = props;

  const isBanned = useMemo(() => {
    return selectedUser?.role === "banner";
  }, [selectedUser?.role])

  return (
    <ModalBox
      isModalVisible={isModalVisible}
      handleCloseModal={handleCloseModal}
      isBanned={isBanned}
      styleModal={{
        paddingHorizontal: 16,
        paddingBottom: 16,
        alignItems: 'flex-start',
      }}
    >
      {selectedUser && (
        <>
          <View style={[styles.userDetailsContainer, { justifyContent: isBanned ? "space-between" : "flex-start" }]}>
            <View style={styles.userDetails}>
              <Avatar source={selectedUser.avatar ? { uri: selectedUser.avatar } : undefined} />
              <View style={styles.userInfo}>
                <Text style={styles.userInfoName}>{selectedUser.name}</Text>
                <Text style={styles.userInfoStatus}>{selectedUser.status}</Text>
              </View>
            </View>
            {isBanned && <View style={{ maxWidth: 130}}>
              <Text style={styles.bannedInfo}>banned by {selectedUser.name} till 12 Aug 2024</Text>  
            </View>}
          </View>


          <View style={styles.modalActions}>
            <TouchableOpacity style={[styles.actionButton, styles.actionButtonProfile]}>
              <Profile />
              <Text style={styles.modalActionText}>Profile</Text>
            </TouchableOpacity>
            {isAdmin && <>
              <TouchableOpacity style={[styles.actionButton, styles.actionButtonOther]}>
                <Administrator />
                <Text style={styles.modalActionText}>Appoint as an administrator</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.actionButtonOther]}>
                {isBanned? <Unban /> : <Ban />}
                <Text style={[styles.modalActionText, { color: isBanned? "#12B829" : "#9F0000"}]}>
                  {isBanned? "Unban" : "Ban"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.actionButtonOut]}>
                <KickOut />
                <Text style={[styles.modalActionText, { color: "#9F0000"}]}>Kick out</Text>
              </TouchableOpacity>
            </>}
          </View>
        </>
      )}
  </ModalBox>
  );
};
