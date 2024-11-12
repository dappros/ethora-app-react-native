import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

export const styles = StyleSheet.create({
  buttonsGroup: {
    marginTop: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconButtons: {
    width: wp("15%"),
    height: wp("15%"),
    padding: hp("2%"),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    position: "relative",
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#50504E",
    opacity: 0.7,
    borderRadius: 15,
  },
  icon: {
    padding: 3,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBottom: {
    textAlign: "center",
    fontSize: 12,
    color: "#FFFFFF",
    paddingTop: 4,
  }
});
