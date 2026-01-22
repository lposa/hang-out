import { useMovieDb } from '@/hooks/useMovieDb';
import { View, Image, Text } from 'react-native';
import { styles } from './MovieDetails.styles';

export const MovieDetails = ({ movieName }: { movieName: string | undefined }) => {
  const { movie } = useMovieDb({ movieName });

  if (!movie) {
    return null;
  }

  return (
    <View style={styles.movieDetailsContainer}>
      <Image source={{ uri: movie.image }} style={styles.movieDetailsPoster} resizeMode="cover" />
      <View style={styles.movieDetailsTextContainer}>
        <Text style={styles.movieDetailsOverview}>{movie.overview}</Text>
      </View>
    </View>
  );
};
