import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

export const styles = StyleSheet.create({
  groupHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 0,
    margin: 0,
    
  },
  userContainer: {
    flexDirection: "row",
    alignContent: "center",
  },
  avatar: {
    width: wp("18%"),
    aspectRatio: "1/1",
    borderRadius: 50,
    marginRight: 10,
    
  },
  userName: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  members: {
    fontSize:  wp("5%"),
    color: "#FFFFFF",
  },
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
  coinsContainer: {
    height: hp("7.1%"),
    backgroundColor: "#50504E",
    opacity: 0.75,
    borderRadius: 15,
    paddingHorizontal: 3,
  },
  coinsBlock: {
    flexDirection: "row",
    padding: 3,
    gap: 6
  },
  coinsText: {
    color: "#FFFFFF"
  }
})