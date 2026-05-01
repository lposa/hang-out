import { Animated, Image, StyleProp, View, Text } from 'react-native';
import { MappedMovie } from '@/types';
import { styles } from './ActivityDetailsMovie.styles';
import PLACEHOLDER_IMAGE from '@/assets/images/general-placeholder.png';
import { useEffect, useRef, useState } from 'react';
import { ImageStyle } from 'expo-image';

interface IActivityDetailsMovie {
  movie: MappedMovie | undefined | null;
  customImageStyle?: StyleProp<ImageStyle>;
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

export const ActivityDetailsMovie = ({ movie, customImageStyle }: IActivityDetailsMovie) => {
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const lastLoadedImageKey = useRef<string | null>(null);
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
  const imageKey = movie?.image ?? 'placeholder';
  const year = movie.releaseDate ? movie.releaseDate.split('-')[0] : null;
  const runtime = formatRuntime(movie.runtime);
  const primaryGenre = movie.genre && movie.genre.length > 0 ? movie.genre[0] : null;

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
  });

  return (
    <View style={styles.container}>
      <View style={[styles.imageContainer, customImageStyle && { width: '100%' }]}>
        <Image
          source={imageSource}
          style={[styles.movieDetailsPoster, customImageStyle]}
          resizeMode="cover"
          onLoadStart={() => {
            if (lastLoadedImageKey.current !== imageKey) {
              setIsLoadingImage(true);
            }
          }}
          onLoadEnd={() => {
            lastLoadedImageKey.current = imageKey;
            setIsLoadingImage(false);
          }}
          onError={(error) => {
            lastLoadedImageKey.current = imageKey;
            setIsLoadingImage(false);
            console.warn('Image load error:', error.nativeEvent?.error || error);
          }}
        />
        {isLoadingImage && (
          <Animated.View style={[styles.skeleton, customImageStyle, { opacity: shimmerOpacity }]} />
        )}
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.movieTitle}>{movie.title}</Text>
        <View style={styles.movieDescriptionContainer}>
          <Text style={styles.movieDescription} numberOfLines={8}>
            {movie.overview}
          </Text>
        </View>
      </View>
    </View>
  );
};
