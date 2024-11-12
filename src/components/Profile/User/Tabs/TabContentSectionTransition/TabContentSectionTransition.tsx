import React from 'react';

import { TabsContainer, TabsItems } from '@components/Profile';

// Data
import { tabsHeaderTransactions } from '@constants/profileTab';

export const TabContentSectionTransition = () => {
  return (
    <TabsContainer
      headerTabs={tabsHeaderTransactions}
      defaultTab="items"
    >
      <TabsItems />
    </TabsContainer>
  );
};
