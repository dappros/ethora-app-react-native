import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  header: {
    paddingHorizontal: wp("9%"),
    paddingBottom: hp("5%"),
    paddingTop: hp("5%"),
    width: "100%",
    overflow: "hidden",
    justifyContent: "space-between",
    zIndex: 100,
    borderStartColor: "transparent",
  },
  headerButtons: {
    margin: 0,
    padding: 0,
    height: hp("4%"),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerImageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
  },
  headerImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#8F8F8F"
  },
})