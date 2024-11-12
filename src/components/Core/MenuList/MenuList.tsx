import React, { FC } from 'react';
import { Menu, Pressable } from 'native-base';
import { SvgProps } from 'react-native-svg';

// Components
import { ListSettings } from '@components/Core/SettingsList';

// Styles
import { styles } from "./MenuListStyle";

// Data
import { OptionsSettingProfile } from '@constants/OptionsSettingProfile';

interface MenuListType {
  isOpen: boolean;
  setIsOpen: (type: boolean) => void;
  image: FC<SvgProps>;
  actionInteractions: (type: string) => void;
}

export const MenuList: FC<MenuListType> = (props) => {
  const {
    isOpen,
    setIsOpen,
    actionInteractions,
    image: Image,
  } = props;
  return (
    <Menu
      isOpen={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      borderRadius={12}
      padding={0}
      placement="bottom right"
      trigger={triggerProps => {
        return <Pressable style={styles.headerStar} accessibilityLabel="More options menu" {...triggerProps}>
          <Image />
        </Pressable>;
    }}>
      <ListSettings
        width={180}
        data={OptionsSettingProfile}
        actionInteractions={actionInteractions}
      />
    </Menu>
  );
};
