import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

export const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    height: "100%",
    margin: 0,
    padding: 0,
    position: "relative",
  },
  modalContent: {
    // borderTopWidth: 1,
    // borderBottomColor: '#E8EDF2',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 32,
    alignItems: 'flex-start',
  },
  verticalComponent: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  bannedInfo: {
    fontSize: 12,
    color: "#9F0000",
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
  userDetailsContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: 10,
  },
  userInfoName: {
    fontSize: 14,
  },
  userInfoStatus: {
    fontSize: 12,
    color: "#8F8F8F",
  },
  modalActions: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingHorizontal: 15,
    width: '100%',
    marginTop: 15,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButtonProfile: {
    paddingTop: 15,
    paddingBottom: 21,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EDF2',
  },
  actionButtonOther: {
    paddingVertical: 21,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EDF2',
  },
  actionButtonOut: {
    paddingTop: 21,
    paddingBottom: 15,
  },
  modalActionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  closeButtonText: {
    color: 'red',
    marginTop: 20,
  },
})