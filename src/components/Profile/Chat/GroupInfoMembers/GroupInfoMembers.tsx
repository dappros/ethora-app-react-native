import React, { FC, useState } from 'react';
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Components
import { ProfileModalUser, ProfileMemberUser } from '@components/Profile';

// Import Icons
import { ArrowRight, AddUser } from '@assets/icons';

// Styles
import { styles } from "./GroupInfoMembersStyle";

// Data
import { ExampleData } from '@constants/profileTab';

interface GroupInfoMembersProps {
  panY: Animated.Value;
  description?: string;
  members?: number;
  users: ExampleData[];
}

export const GroupInfoMembers: FC<GroupInfoMembersProps> = (props) => {
  const { panY, description, members, users } = props;

  const [showAddMembers, setShowAddMembers] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<ExampleData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const handleUserPress = (user: ExampleData) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  const tabsTranslateY = panY.interpolate({
    inputRange: [-hp('25%'), 0],
    outputRange: [-hp('33%'), 0],
    extrapolate: 'clamp',
  });

  const handleArrowPress = () => {
    setShowAddMembers((prev) => !prev);
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: tabsTranslateY }] }]}>
      {description && <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionTitle}>Description</Text>
        <Text style={styles.descriptionText}>{description}</Text>
      </View>}

      <View style={styles.tabsContainer}>
        {showAddMembers && (
          <View style={styles.addMembersContainer}>
            <AddUser />
            <Text style={styles.addMembersText}>Add Members</Text>
          </View>
        )}
        <View style={styles.memberContainer}>
          <Text style={styles.memberContainerText}>
            {members && members > 1  ? "Members" : "Member"}: {members}
          </Text>
          <TouchableOpacity style={styles.arrowButton} onPress={handleArrowPress}>
            <ArrowRight />
          </TouchableOpacity>
        </View>

        <FlatList
          data={users}
          renderItem={({ item }) => <ProfileMemberUser item={item} onPress={() => handleUserPress(item)} />}
          keyExtractor={(item: ExampleData) => item._id}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.userListContent}
          style={{ flexGrow: 1,paddingBottom: 10 }}
        />
      </View>

      <ProfileModalUser
        isModalVisible={isModalVisible}
        handleCloseModal={handleCloseModal}
        selectedUser={selectedUser}
      />
    </Animated.View>
  );
};
