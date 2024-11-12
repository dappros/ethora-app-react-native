import React, { FC, ReactNode } from 'react';
import Modal from 'react-native-modal';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { View } from 'native-base';

interface ModalBoxProps {
  isModalVisible: boolean;
  handleCloseModal: () => void;
  isBanned?: boolean;
  styleModal?: StyleProp<ViewStyle>;
  children: ReactNode;
}

export const ModalBox: FC<ModalBoxProps> = (props) => {
  const { isModalVisible, handleCloseModal, children, isBanned, styleModal } = props;
  return (
    <Modal
      isVisible={isModalVisible}
      onBackdropPress={handleCloseModal}
      onSwipeComplete={handleCloseModal}
      swipeDirection="down"
      style={styles.modal}
      backdropOpacity={0.7}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      statusBarTranslucent={true}
    >
      <View style={[styleModal, styles.modalContent, { backgroundColor: isBanned ? "#F5E5E5" : "#F5F7F9"}]}>
        <View style={[styles.verticalContent, { backgroundColor: isBanned ? "#9F0000" : "#C9E0FA"}]}/>
        {children}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    position: "relative",
    justifyContent: 'flex-end',
    height: "100%",
    margin: 0,
    padding: 0,
  },
  modalContent: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingTop: 32,
  },
  verticalContent: {
    position: "absolute",
    top: 16,
    alignSelf: 'center',
    marginBottom: 16,
    height: 3,
    width: 45,
    borderRadius: 3,
    opacity: 0.9
  },
})