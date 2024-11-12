import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

export const styles = StyleSheet.create({
  headerStar: {
    padding: hp("1%"),
    height: hp("4%"),
    width: wp("15%"),
    backgroundColor: "#50504E",
    opacity: 0.75,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center"
  },
})