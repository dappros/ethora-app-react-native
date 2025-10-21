import { router } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";

export default function Register() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text>Register</Text>
      <TouchableOpacity onPress={() => router.back()}>
        <Text>Back</Text>
      </TouchableOpacity>
    </View>
  );
}