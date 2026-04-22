import { Image, Pressable, Text, View } from 'react-native';
import PLACEHOLDER_IMAGE from '@/assets/images/general-placeholder.png';
import { styles } from './MovieScheduleList.styles';
import { ISelectedShowtimePayload } from '@/components/AddActivityForm/components/CurrentMoviesInTheaters/CurrentMoviesInTheaters';
import { mapMovieFromDB } from '@/helpers/movies';
import { IMovieDataDB } from '@/types/movies';

type MovieSchedule = {
  date: string | null;
  day: string | null;
  times: string[];
};

interface IMovieScheduleList {
  movies: IMovieDataDB[];
  onSelectShowtime?: (payload: ISelectedShowtimePayload) => void;
}

const getTimeEntries = (schedule: MovieSchedule[]) =>
  schedule.flatMap((entry) =>
    entry.times.map((time) => ({
      time,
      date: entry.date,
      day: entry.day,
    }))
  );

export function MovieScheduleList({ movies, onSelectShowtime }: IMovieScheduleList) {
  return (
    <View style={styles.container}>
      {movies.map((movie) => {
        const timeEntries = getTimeEntries(movie.schedule);

        return (
          <View key={movie.title} style={styles.card}>
            <Image
              source={movie.moviePoster ? { uri: movie.moviePoster } : PLACEHOLDER_IMAGE}
              style={styles.poster}
            />

            <View style={styles.content}>
              {movie.premiere && (
                <View style={styles.premiereBadge}>
                  <Text style={styles.premiereBadgeText}>Premiere</Text>
                </View>
              )}
              <Text style={styles.title}>{movie.title}</Text>

              {!!movie.description && (
                <Text style={styles.description} numberOfLines={3}>
                  {movie.description}
                </Text>
              )}

              <View style={styles.timesContainer}>
                {timeEntries.map((entry) => (
                  <Pressable
                    key={`${movie.title}-${entry.date ?? 'no-date'}-${entry.time}`}
                    style={styles.timePill}
                    onPress={() =>
                      onSelectShowtime?.({
                        movie: mapMovieFromDB(movie),
                        time: entry.time,
                        date: entry.date,
                        day: entry.day,
                        cinemaName: movie.cinema_name,
                      })
                    }
                  >
                    <Text style={styles.timeText}>{entry.time}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}
