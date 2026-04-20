import { View, Text } from 'react-native';
import { useEffect, useState } from 'react';
import latestShowTimes from '../../scripts/scrapers/output/latest-showtimes.json';
import { styles } from './RealDataForm.styles';
import { DatePillPicker } from './components/DatePillPicker';
import { movieDB } from '@/services';
import { getMoviePoster } from '@/helpers';
import { MovieScheduleList } from './components/MovieScheduleList';

interface IScrappedMovieData {
  cinema_name: string;
  title: string;
  source_title: string;
  source_url: string;
  confidence: number;
  notes: string;
  date: string | null;
  day: string | null;
  times: string[];
  schedule: {
    date: string | null;
    day: string | null;
    times: string[];
  }[];
  moviePoster?: string | null;
}

interface IMovieData {
  title: string;
  schedule: {
    date: string | null;
    times: string[];
    day: string | null;
  }[];
  moviePoster?: string | null;
}

const getNextDays = (daysAhead = 7) => {
  const today = new Date();
  return Array.from({ length: daysAhead + 1 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);

    return {
      date,
      iso: date.toISOString().slice(0, 10),
      short: date.toLocaleDateString('en-GB'),
      day: date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase(),
    };
  });
};

const mapMovieData = (data: IScrappedMovieData): IMovieData => {
  return {
    title: data.title,
    schedule: data.schedule,
    moviePoster: getMoviePoster(data?.moviePoster || ''),
  };
};

export const RealDataForm = () => {
  const [movieData, setMovieData] = useState<IMovieData[] | null>(null);
  const [activeDate, setActiveDate] = useState<string | null>(null);

  useEffect(() => {
    const normalizeMovieData = async () => {
      const nowPlayingAndUpcomingMovies = await movieDB.getNowPlayingAndUpcoming();

      const data = await Promise.all(
        latestShowTimes.items.map(async (item) => {
          const matchingMovie = nowPlayingAndUpcomingMovies?.results.find((movie) =>
            movie.original_title.includes(item.title)
          );

          const movieToBeMapped = {
            ...item,
            moviePoster: matchingMovie?.poster_path,
          };
          return mapMovieData(movieToBeMapped);
        })
      );
      setMovieData(data);
    };

    normalizeMovieData();
  }, []);

  const days = getNextDays().map((day) => ({
    id: day.iso,
    day: day.day,
    shortDate: day.short,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.helperText}>
        * The data can be wrong, so we strongly suggest to double check the dates and times on your
        local movie theaters website.
      </Text>
      <DatePillPicker days={days} activeDateId={activeDate} onSelectDate={setActiveDate} />

      {movieData && movieData.length > 0 && <MovieScheduleList movies={movieData} />}
    </View>
  );
};
