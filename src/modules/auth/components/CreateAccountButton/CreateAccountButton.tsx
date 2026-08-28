import React, { FC } from "react";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { TouchableOpacity, Text } from "react-native";

interface CreateAccountButtonProps {
  navigateToRegisterScreen: any;
  color?: string;
}

export const CreateAccountButton: FC<CreateAccountButtonProps> = ({
  navigateToRegisterScreen,
  color = "#fff",
}) => {
  return (
    <TouchableOpacity
      style={{
        position: "relative",
        borderRadius: 15,
        height: 45,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: color,
      }}
      onPress={navigateToRegisterScreen}
    >
      <Text style={{ color, fontSize: 15 }}>Create an account</Text>
    </TouchableOpacity>
  );
};
