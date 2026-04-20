import { Image, Pressable, Text, View } from 'react-native';
import PLACEHOLDER_IMAGE from '@/assets/images/general-placeholder.png';
import { styles } from './MovieScheduleList.styles';

type MovieSchedule = {
  date: string | null;
  day: string | null;
  times: string[];
};

type MovieScheduleItem = {
  title: string;
  moviePoster?: string | null;
  schedule: MovieSchedule[];
};

interface IMovieScheduleList {
  movies: MovieScheduleItem[];
}

const getUniqueTimes = (schedule: MovieSchedule[]) =>
  Array.from(new Set(schedule.flatMap((entry) => entry.times)));

export const MovieScheduleList = ({ movies }: IMovieScheduleList) => (
  <View style={styles.container}>
    {movies.map((movie) => {
      const times = getUniqueTimes(movie.schedule);

      return (
        <View key={movie.title} style={styles.card}>
          <Image
            source={movie.moviePoster ? { uri: movie.moviePoster } : PLACEHOLDER_IMAGE}
            style={styles.poster}
          />

          <View style={styles.content}>
            <Text style={styles.title}>{movie.title}</Text>

            <View style={styles.timesContainer}>
              {times.map((time) => (
                <Pressable key={`${movie.title}-${time}`} style={styles.timePill}>
                  <Text style={styles.timeText}>{time}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      );
    })}
  </View>
);
