import React, { FC, ReactNode, useState } from 'react';
import { View, Text } from 'native-base';
import { TouchableOpacity } from 'react-native';

// Types
import { AlternateType, DefaultType } from '@/app/(tabs)/data';

// Styles
import { styles } from "./TabsContainerStyle";

interface TabsContainerType<T> {
  children: ReactNode;
  headerTabs: Array<T>;
  defaultTab: "all" | "items";
}

export const TabsContainer: FC<TabsContainerType<DefaultType | AlternateType>> = (props) => {
  const { children, headerTabs, defaultTab } = props;

  const [activeTab, setActiveTab] = useState<DefaultType | AlternateType>(defaultTab);

  return (
    <View style={styles.tabsContainer}>
      <View style={styles.tabContainer}>
        {headerTabs.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {children}
  </View>
  );
};
