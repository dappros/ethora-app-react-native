import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: hp('57%'),
    left: 0,
    right: 0,
    backgroundColor: '#E8EDF2',
    height: hp("100%"),
    paddingHorizontal: 30,
    zIndex: 101
  },
  descriptionContainer: {
    backgroundColor: '#FFFFFF',
    fontSize: 14,
    padding: 15,
    borderRadius: 15,
    marginVertical: 25,
  },
  descriptionTitle: {
    color: '#8F8F8F',
  },
  descriptionText: {},
  tabsContainer: {
    height: hp("57%"),
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    paddingBottom: 30,
  },
  addMembersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 7,
  },
  addMembersText: {
    fontSize: 14,
    color: '#000000',
  },
  memberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EDF2',
  },
  memberContainerText: {
    color: '#8F8F8F',
  },
  arrowButton: {
    width: 50,
    alignItems: 'flex-end',
  },
  userListContent: {
    minHeight: hp('30%'),
  },
});