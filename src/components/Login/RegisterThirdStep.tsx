import React, { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { Input } from "native-base";
import { textStyles } from "../../../docs/config";
import EyeCrossedIcon from "../../assets/icons/eyeCrossed.svg";
import EyeOpenIcon from "../../assets/icons/eyeOpen.svg";
import StarIcon from "../../assets/icons/star.svg";

import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { View } from "native-base";
const RegisterThirdStep = () => {
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowPassword] = useState(false);
  const [newPasswordFocused, setNewPasswordFocused] = useState(false);
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [showTemporaryPassword, setShowTemporaryPassword] = useState(false);
  const [temporaryPasswordFocused, setTemporaryPasswordFocused] =
    useState(false);
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [repeatPasswordFocused, setRepeatPasswordFocused] = useState(false);

  return (
    <>
      <View>
        <Text
          style={{
            color: "#0052CD",
            fontFamily: textStyles.regularFont,
            fontSize: hp("4.5%"),
            marginBottom: 24,
          }}
        >
          Almost done!
        </Text>
        <Text
          style={{
            color: "#0052CD",
            fontFamily: textStyles.regularFont,
            fontSize: 15,
            marginBottom: 24,
          }}
        >
          Just specify a permanent password now and you'll be all set!
        </Text>
      </View>
      <View>
        <Input
          marginBottom={2}
          fontFamily={textStyles.regularFont}
          fontSize={hp("1.6%")}
          color={"black"}
          onFocus={() => setTemporaryPasswordFocused(true)}
          onBlur={() => setTemporaryPasswordFocused(false)}
          borderWidth={temporaryPasswordFocused ? 2 : 0}
          borderColor={temporaryPasswordFocused ? "#0052CD" : ""}
          backgroundColor={temporaryPasswordFocused ? "#fff" : "#E8EDF2"}
          secureTextEntry={!showTemporaryPassword}
          value={temporaryPassword}
          onChangeText={setTemporaryPassword}
          borderRadius={15}
          placeholder="Temporary password"
          leftElement={
            <View style={{ marginLeft: 15 }}>
              <StarIcon />
            </View>
          }
        />
        <Text
          style={{
            color: "#8F8F8F",
            fontFamily: textStyles.regularFont,
            fontSize: 12,
            marginBottom: 15,
            textAlign: "right",
          }}
        >
          You can find temporary password in the verification email.
        </Text>
        <Input
          marginBottom={2}
          fontFamily={textStyles.regularFont}
          fontSize={hp("1.6%")}
          color={"black"}
          onFocus={() => setNewPasswordFocused(true)}
          onBlur={() => setNewPasswordFocused(false)}
          borderWidth={newPasswordFocused ? 2 : 0}
          borderColor={newPasswordFocused ? "#0052CD" : ""}
          backgroundColor={newPasswordFocused ? "#fff" : "#E8EDF2"}
          secureTextEntry={!showNewPassword}
          value={newPassword}
          onChangeText={setNewPassword}
          borderRadius={15}
          placeholder="New password"
          leftElement={
            <View style={{ marginLeft: 15 }}>
              <StarIcon />
            </View>
          }
          rightElement={
            <TouchableOpacity
              onPress={() => setShowPassword(!showNewPassword)}
              style={{ marginRight: 15 }}
            >
              {showNewPassword ? <EyeOpenIcon /> : <EyeCrossedIcon />}
            </TouchableOpacity>
          }
        />
        <Input
          marginBottom={2}
          fontFamily={textStyles.regularFont}
          fontSize={hp("1.6%")}
          color={"black"}
          onFocus={() => setRepeatPasswordFocused(true)}
          onBlur={() => setRepeatPasswordFocused(false)}
          borderWidth={repeatPasswordFocused ? 2 : 0}
          borderColor={repeatPasswordFocused ? "#0052CD" : ""}
          backgroundColor={repeatPasswordFocused ? "#fff" : "#E8EDF2"}
          secureTextEntry={!showRepeatPassword}
          value={repeatPassword}
          onChangeText={setRepeatPassword}
          borderRadius={15}
          placeholder="Repeat password"
          leftElement={
            <View style={{ marginLeft: 15 }}>
              <StarIcon />
            </View>
          }
          rightElement={
            <TouchableOpacity
              onPress={() => setShowRepeatPassword(!showNewPassword)}
              style={{ marginRight: 15 }}
            >
              {showRepeatPassword ? <EyeOpenIcon /> : <EyeCrossedIcon />}
            </TouchableOpacity>
          }
        />
      </View>
      <View marginTop={"25%"}>
        <TouchableOpacity
          style={{
            backgroundColor: "#0052CD",
            borderRadius: 15,
            width: "100%",
            height: 45,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            marginTop: 20,
          }}

          // disabled={loading || !userName || !email}
        >
          {/* {loading && (
            <ActivityIndicator
              size="small"
              color="#fff"
              style={{ marginRight: 10 }}
            />
          )} */}
          <Text style={{ fontSize: 18, color: "#fff" }}>Create an account</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default RegisterThirdStep;
