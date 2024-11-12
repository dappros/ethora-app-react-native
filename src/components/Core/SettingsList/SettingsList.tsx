import { Text, View } from 'native-base';
import React, { FC } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';


// Constant
import { OptionsType } from '@/constants/OptionsSettingProfile';

// Styles
import { styles } from "./SettingsListStyle";

interface ListSettingsProps {
  width: number;
  data: OptionsType[];
  actionInteractions: (type: string) => void;
}

export const ListSettings: FC<ListSettingsProps> = ({width, data, actionInteractions}) => (
  <View style={[styles.optionsContainer, { width: width}]}>
    {data.map(({ icon: Icon, ...option }, index) => (
      <TouchableOpacity
        key={option.id}
        style={[
          styles.option,
          index === data.length - 1 && styles.noBorder,
        ]}
        onPress={() => {
          console.log("option", option.id);
          actionInteractions(option.id);
          // setSelectedMessage(null);
        } }
      >
        <Text style={{ ...styles.optionText, color: option.color }}>
          {option.name}
        </Text>
        <Icon />
      </TouchableOpacity>
    ))}
    </View>
);
