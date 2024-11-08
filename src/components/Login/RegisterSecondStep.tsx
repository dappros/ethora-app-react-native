import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { textStyles } from "../../../docs/config";

import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { View } from "native-base";
import { httpPost } from "../../config/apiService";
import {
  registerRegularEmailUrl,
  resetPasswordURL,
} from "../../config/routesConstants";
import { useStores } from "../../stores/context";
import { showSuccess, showError } from "../Toast/toast";

interface RegisterSecondStepProps {
  email: string;
  username: string;
}

function maskEmail(email: string): string {
  const [username, domain] = email.split("@");
  const maskedUsername = username[0] + "*".repeat(username.length - 1);
  return `${maskedUsername}@${domain}`;
}

const RegisterSecondStep = ({ email, username }: RegisterSecondStepProps) => {
  const { apiStore } = useStores();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let intervalId;

    if (countdown > 0) {
      intervalId = setInterval(() => {
        setCountdown((currentCountdown) => currentCountdown - 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [countdown]);

  const registerUser = async () => {
    setCountdown(30);
    setLoading(true);
    const nameAndSurname = username.split(" ");

    const body = {
      firstName: nameAndSurname[0],
      lastName: nameAndSurname[1],
      email,
    };
    try {
      await httpPost(registerRegularEmailUrl, body, apiStore.defaultToken);
      showSuccess(
        "Registration",
        "User registered successfully, please check your email"
      );
    } catch (error) {
      console.log(error.response.data);
      if (error?.response?.status === 400) {
        showError("Error", "Someone already has that username. Try another?");
      } else {
        showError("Error", "Something went wrong");
      }
    }
    setLoading(false);
  };
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
          Confirm your email address
        </Text>
        <Text
          style={{
            color: "8F8F8F",
            fontFamily: textStyles.regularFont,
            fontSize: 15,
            marginBottom: 24,
          }}
        >
          We sent a confirmation email to {maskEmail(email)}.
        </Text>
      </View>
      <View>
        <View style={{ flexDirection: "row", marginBottom: 15 }}>
          <Text
            style={{
              color: "#0052CD",
              fontFamily: textStyles.regularFont,
              fontSize: 15,
            }}
          >
            {"\u2022 "}
          </Text>
          <Text
            style={{
              color: "#0052CD",
              fontFamily: textStyles.regularFont,
              fontSize: 15,
            }}
          >
            Just click on the link in the email to continue the registration
            process.
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={{
              color: "#0052CD",
              fontFamily: textStyles.regularFont,
              fontSize: 15,
            }}
          >
            {"\u2022 "}
          </Text>
          <Text
            style={{
              color: "#0052CD",
              fontFamily: textStyles.regularFont,
              fontSize: 15,
            }}
          >
            If you don`t see it, check your spam folder.
          </Text>
        </View>
      </View>
      <View marginTop={"25%"}>
        <Text
          style={{
            color: "#0052CD",
            fontFamily: textStyles.regularFont,
            fontSize: 15,
            textAlign: "center",
          }}
        >
          Still can`t find the email?
        </Text>
        <TouchableOpacity
          onPress={registerUser}
          style={{
            borderRadius: 15,
            width: "100%",
            height: 45,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            marginTop: 20,
            backgroundColor: countdown > 0 ? "#8F8F8F" : "#0052CD",
          }}
          disabled={countdown > 0}
        >
          {loading ? (
            <ActivityIndicator
              size="small"
              color="#fff"
              style={{ marginRight: 10 }}
            />
          ) : (
            <Text style={{ fontSize: 18, color: "#fff" }}>
              {countdown > 0 ? `Wait ${countdown}s` : "Resend email"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
};

export default RegisterSecondStep;
