import { FlatList, ListRenderItem } from 'react-native';
import { styles } from './HorizontalList.styles';

interface IHorizontalListProps<T> {
  data: T[];
  renderItem: ListRenderItem<T>;
  keyExtractor?: (item: T, index: number) => string;
  snapToInterval?: number;
}

export const HorizontalList = <T,>({
  data,
  renderItem,
  keyExtractor,
  snapToInterval,
}: IHorizontalListProps<T>) => {
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.horizontalListContainer}
      snapToInterval={snapToInterval}
      decelerationRate="fast"
      snapToAlignment="start"
      pagingEnabled={false}
    />
  );
};
