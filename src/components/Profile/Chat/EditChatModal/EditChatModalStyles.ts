import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  containerModal: {
    width: "100%",
    alignItems: 'center',
  },
  headerText: {
    color: "#8F8F8F",
    fontSize: 12,
  },
  viewPhoto: {
    width: "100%",
    paddingVertical: 21,
    flexDirection: "row",
    gap: 10,
  },
  cameraContainer: {
    width: wp("21%"),
    aspectRatio: 1,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "black",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  cameraButton: {
    position: "relative",
    width: "100%",
    height: "100%",
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  cameraIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
  },
  photoPlaceholder: {
    width: wp("21%"),
    aspectRatio: 1,
    backgroundColor: "#d3d3d3",
    borderRadius: 10,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    width: "100%",
  },
  actionButtonProfile: {
    // borderBottomWidth: 1,
    // borderBottomColor: '#E8EDF2',
  },
  modalActionText: {
    color: "#0052CD",
    fontSize: 16,
    fontWeight: "600",
  },
});
