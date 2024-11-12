import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

export const styles = StyleSheet.create({
  containerAnimation: {
    position: 'absolute',
    top: hp('57%'),
    left: 0,
    right: 0,
    backgroundColor: '#E8EDF2',
    height: hp("100%"),
    zIndex: 101
  },
  aboutContainer: {
    marginHorizontal: wp("7.5%"),
    backgroundColor: '#FFFFFF',
    fontSize: 14,
    padding: 15,
    borderRadius: 15,
    marginVertical: 25,
  },
  aboutTitle: {
    color: '#8F8F8F',
  },
  aboutText: {},
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
  listContainer: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
});