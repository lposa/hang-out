import { Pressable, Text, View } from 'react-native';
import { styles } from '@/components/EditCardsForm/EditCardsForm.styles';
import { TAB_ENUM } from '@/constants/tabEnums';

interface ITabMenuProps {
  activeTab: TAB_ENUM;
  handleActiveTabPress: (tab: TAB_ENUM) => void;
  tabGroups: Partial<TAB_ENUM>[];
}

export const TabMenu = ({ activeTab, handleActiveTabPress, tabGroups }: ITabMenuProps) => {
  return (
    <View style={styles.tabsContainer}>
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
