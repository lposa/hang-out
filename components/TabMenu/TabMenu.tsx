import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';
import { styles } from './TabMenu.styles';
import { TAB_ENUM } from '@/constants/tabEnums';

interface ITabMenuProps {
  activeTab: TAB_ENUM;
  handleActiveTabPress: (tab: TAB_ENUM) => void;
  tabGroups: Partial<TAB_ENUM>[];
  customContainerStyle?: StyleProp<ViewStyle>;
}

export const TabMenu = ({
  activeTab,
  handleActiveTabPress,
  tabGroups,
  customContainerStyle,
}: ITabMenuProps) => {
  return (
    <View style={[styles.tabsContainer, customContainerStyle && customContainerStyle]}>
      {tabGroups.map((group) => (
        <Pressable
          key={group}
          style={[styles.tabButton, activeTab === group && styles.tabButtonActive]}
          onPress={() => handleActiveTabPress(group)}
        >
          <Text style={[styles.tabText, activeTab === group && styles.tabTextActive]}>
            {group.toUpperCase()}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};
