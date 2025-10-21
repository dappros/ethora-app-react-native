import { TouchableOpacity, Text, View } from "react-native";

interface RegularLoginLabelProps {
  setOpen: () => void;
}

export const RegularLoginLabel = ({ setOpen }: RegularLoginLabelProps ) => {
  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 32,
    }}>
      <Text
        className="text-white text-xs mr-1"
        style={{
          fontFamily: 'VarelaRound-Regular',
        }}
      >
        Already have an account?{' '}
      </Text>
      <TouchableOpacity
        testID="login-with-cred"
        accessibilityLabel="Log in with password"
        onPress={setOpen}
      >
        <Text
          className="text-white text-xs"
          style={{
            fontFamily: 'Poppins-SemiBold',
            textDecorationLine: 'underline',
          }}
        >
          Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}
