import { TouchableOpacity, Text, View } from "react-native";

interface RegularLoginLabelProps {
  setOpen: () => void;
  textColor?: string;
  linkColor?: string;
}

export const RegularLoginLabel = ({
  setOpen,
  textColor = '#fff',
  linkColor = textColor,
}: RegularLoginLabelProps) => {
  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 32,
    }}>
      <Text
        className="text-sm mr-1"
        style={{
          color: textColor,
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
          className="text-sm"
          style={{
            color: linkColor,
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
