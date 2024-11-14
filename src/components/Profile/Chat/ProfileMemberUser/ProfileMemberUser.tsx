import React from 'react';
import { Avatar, View, Text, Box } from 'native-base';
import { TouchableOpacity } from 'react-native';

import { styles } from "./ProfileMemberUserStyle";

// Data
import { ExampleData } from '@constants/profileTab';

// Config
import { textStyles } from '../../../../../docs/config';

interface ProfileMemberUserProps {
  item: ExampleData;
  onPress: () => void;
}

export const ProfileMemberUser = (props: ProfileMemberUserProps) => {
  const { item, onPress } = props;

  return (
    <TouchableOpacity style={styles.userRow} onPress={onPress}>
      <View style={styles.userDetails}>
        {item.avatar
          ? <Avatar source={item.avatar ? { uri: item.avatar } : undefined} />
          : <Box
              style={styles.nonAvatar}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: textStyles.boldFont,
                  textTransform: "uppercase",
                  textAlign: "center",
                }}
              >
                {item.name && item.name[0] + (item.name[1] ? item.name[1] : "")}
              </Text>
            </Box>
        }
        <View style={styles.userInfo}>
          <Text>{item.name}</Text>
          <Text>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.userRole}>{item.role}</Text>
    </TouchableOpacity>
  );
};
