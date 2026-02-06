import PLACEHOLDER_IMAGE from '@/assets/images/general-placeholder.png';
import { GenreTag } from '@/components/elements';
import { MappedMovie } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ImageStyle } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleProp, Text, View, ViewStyle } from 'react-native';
import { styles } from './MovieDetails.styles';

interface IMovieDetailsProps {
  movie: MappedMovie | undefined | null;
  isRow?: boolean;
  shouldShowOverview?: boolean;
  shouldShowTitle?: boolean;
  customContainerStyle?: StyleProp<ViewStyle>;
  customImageStyle?: StyleProp<ImageStyle>;
  isEditMode?: boolean;
}

const formatRuntime = (minutes?: number): string => {
  if (!minutes) return '';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

export const MovieDetails = ({
  movie,
  isRow = true,
  shouldShowOverview = true,
  shouldShowTitle = false,
  customContainerStyle,
  customImageStyle,
  isEditMode = false,
}: IMovieDetailsProps) => {
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLoadingImage) {
      shimmerAnim.setValue(0);
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => {
        animation.stop();
      };
    } else {
      shimmerAnim.setValue(0);
    }
  }, [isLoadingImage, shimmerAnim]);

  if (!movie) {
    return null;
  }

  const imageSource = movie?.image ? { uri: movie.image } : PLACEHOLDER_IMAGE;
  const year = movie.releaseDate ? movie.releaseDate.split('-')[0] : null;
  const runtime = formatRuntime(movie.runtime);
  const primaryGenre = movie.genre && movie.genre.length > 0 ? movie.genre[0] : null;

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
  });

  return (
    <View
      style={[
        styles.movieDetailsContainer,
        isRow && { flexDirection: 'row' },
        customContainerStyle,
      ]}
    >
      {movie.review && parseFloat(movie.review) !== 0 && (
        <View style={[styles.reviewContainer, styles.imageBadge]}>
          <Ionicons name="star" size={14} color="#eab308" />
          <Text style={styles.reviewText}>{movie?.review}</Text>
        </View>
      )}

      {isEditMode && (
        <View style={[styles.removeIcon, styles.imageBadge]}>
          <MaterialIcons name="delete" size={24} color="#FFF" />
        </View>
      )}

      <View style={[styles.imageContainer, customImageStyle && { width: '100%' }]}>
        <Image
          source={imageSource}
          style={[styles.movieDetailsPoster, customImageStyle]}
          resizeMode="cover"
          onLoadStart={() => {
            setIsLoadingImage(true);
          }}
          onLoadEnd={() => {
            setIsLoadingImage(false);
          }}
          onError={(error) => {
            setIsLoadingImage(false);
            console.warn('Image load error:', error.nativeEvent?.error || error);
          }}
        />
        {isLoadingImage && (
          <Animated.View style={[styles.skeleton, customImageStyle, { opacity: shimmerOpacity }]} />
        )}
      </View>
      {shouldShowTitle && (
        <View style={styles.movieInfoSection}>
          <Text style={styles.movieTitle} numberOfLines={2} ellipsizeMode="tail">
            {movie.title}
          </Text>
          <View style={styles.movieMetadataRow}>
            {year && <Text style={styles.metadataText}>{year}</Text>}
            {runtime && (
              <>
                {year && <Text style={styles.metadataSeparator}> • </Text>}
                <Ionicons name="time-outline" size={14} color="#666" />
                <Text style={styles.metadataText}>{runtime}</Text>
              </>
            )}
            {primaryGenre && (
              <>
                {(year || runtime) && <Text style={styles.metadataSeparator}> • </Text>}
                <GenreTag text={primaryGenre} />
              </>
            )}
          </View>
        </View>
      )}
      {shouldShowOverview && (
        <View style={styles.movieDetailsTextContainer}>
          <Text style={styles.movieDetailsOverview} numberOfLines={10}>
            {movie.overview}
          </Text>
        </View>
      )}
    </View>
  );
};
