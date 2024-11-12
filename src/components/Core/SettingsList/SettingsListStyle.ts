import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  optionsContainer: {
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 12,
    alignItems: "center",
  },
  option: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#CECECE",
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  optionText: {
    fontSize: 14,
    fontWeight: "400",
  },
});