import { useWindowDimensions, View } from 'react-native';
import { MappedMovie } from '@/types';
import { styles } from '@/components/ProfileDisplay/ProfileDisplay.style';
import { MovieDetails } from '@/components/MovieDetails/MovieDetails';
import { HorizontalList } from '@/components/HorizontalList';

interface IEditCardsFormProps {
  data: MappedMovie[];
}

export const EditCardsForm = ({ data }: IEditCardsFormProps) => {
  const { width } = useWindowDimensions();
  const cardWidth = width * 0.7;
  const snapInterval = cardWidth + 12;

  return (
    <View>
      <HorizontalList
        data={data}
        renderItem={({ item: movie }) => (
          <View style={[styles.movieCard, { width: cardWidth }]}>
            <MovieDetails
              movie={movie}
              isRow={false}
              shouldShowOverview={false}
              shouldShowTitle
              customContainerStyle={styles.movieCardContainer}
              customImageStyle={styles.movieCardImage}
            />
          </View>
        )}
        keyExtractor={(movie) => movie.id.toString()}
        snapToInterval={snapInterval}
      />
    </View>
  );
};
