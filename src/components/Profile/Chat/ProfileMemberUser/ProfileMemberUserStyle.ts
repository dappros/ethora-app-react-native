import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

export const styles = StyleSheet.create({
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EDF2',
  },
  nonAvatar: {
    borderColor: "#8F8F8F",
    borderWidth: 1,
    borderRadius: hp("4.5%"),
    width: 50,
    height: 50,
    backgroundColor: "#0052CD",
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: 10,
  },
  userRole: {
    color: '#8F8F8F',
  },
});