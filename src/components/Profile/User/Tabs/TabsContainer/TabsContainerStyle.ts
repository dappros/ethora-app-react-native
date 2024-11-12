import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

export const styles = StyleSheet.create({
  tabsContainer: {
    height: hp("57%"),
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingTop: 24,
    paddingBottom: 30,
    paddingHorizontal: wp("7.5%"),
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: wp("5%"),
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#E8EDF2',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  activeTab: {
    borderBottomColor: '#0052CD',
  },
  tabText: {
    color: '#0052CD',
    fontWeight: '500',
    fontSize: hp("1.6%%")
  },
});