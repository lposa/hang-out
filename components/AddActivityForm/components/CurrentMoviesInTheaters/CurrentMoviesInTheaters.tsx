import { Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import latestShowTimes from '../../../../scripts/scrapers/output/latest-showtimes.json';
import { styles } from './CurrentMoviesInTheaters.styles';
import { DatePillPicker } from '../DatePillPicker';
import { movieDB, tavilyService } from '@/services';
import { getMoviePoster } from '@/helpers';
import { MovieScheduleList } from '../MovieScheduleList/MovieScheduleList';
import { LoaderSpinner } from '@/components/elements/LoaderSpinner';
import { FormSelect } from '@/components/elements';
import { supabase } from '@/services/Supabase';
import { useToast } from '@/context/ToastContext';
import { TABLE_ENUM } from '@/constants';
import { useForm } from 'react-hook-form';
import { MappedMovie } from '@/types';
import { IMovieDataDB } from '@/types/movies';

export interface ISelectedShowtimePayload {
  movie: MappedMovie;
  time: string;
  date: string | null;
  day: string | null;
  cinemaName: string;
}

interface ICurrentMoviesFilters {
  cinemaName: string;
}

interface ICurrentMoviesInTheatersProps {
  onSelectShowtime?: (payload: ISelectedShowtimePayload) => void;
}

//TODO: this will have to be generated using a location service
const cinemaOptions = [
  { label: 'Cinestar', value: 'Cinestar' },
  { label: 'Cinestar Zrenjanin', value: 'Cinestar Zrenjanin' },
  { label: 'Cinestar Novi Sad', value: 'Cinestar Novi Sad' },
  { label: 'Cinestar Pancevo', value: 'Cinestar Pancevo' },
  { label: 'Cinestar Beograd', value: 'Cinestar Beograd' },
];

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

export const CurrentMoviesInTheaters = ({ onSelectShowtime }: ICurrentMoviesInTheatersProps) => {
  const [movieData, setMovieData] = useState<IMovieDataDB[] | null>(null);
  const [activeDate, setActiveDate] = useState<string | null>(getNextDays(0)[0]?.iso ?? null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingToDb, setIsSavingToDb] = useState(false);
  const { showToast } = useToast();
  const { control, watch } = useForm<ICurrentMoviesFilters>({
    defaultValues: {
      cinemaName: 'Cinestar',
    },
  });

  //TODO: This will be a edge function instead, that runs every week once!
  const saveCurrentMoviesToDb = async () => {
    setIsSavingToDb(true);
    try {
      const tavilyShowtimes = await tavilyService.getLocalShowtimes();
      const showtimeItems = tavilyShowtimes ?? latestShowTimes.items;

      let syncedMoviesCount = 0;
      let syncedSchedulesCount = 0;

      for (const item of showtimeItems) {
        const { data: existingShowtime } = await supabase
          .from(TABLE_ENUM.CINEMA_SHOWTIMES)
          .select('id')
          .eq('cinema_name', item.cinema_name)
          .eq('title', item.title)
          .eq('source_url', item.source_url)
          .maybeSingle();

        const showtimePayload = {
          cinema_name: item.cinema_name,
          title: item.title,
          source_title: item.source_title,
          source_url: item.source_url,
          confidence: item.confidence,
          notes: item.notes,
          date: item.date,
          day: item.day,
          premiere: item.premiere ?? false,
          genre: item.genre ?? null,
          runtime: item.runtime ?? null,
          description: item.description ?? null,
        };

        let cinemaShowtimeId = existingShowtime?.id;

        if (cinemaShowtimeId) {
          const { error: updateError } = await supabase
            .from(TABLE_ENUM.CINEMA_SHOWTIMES)
            .update(showtimePayload)
            .eq('id', cinemaShowtimeId);

          if (updateError) {
            throw updateError;
          }
        } else {
          const { data: insertedShowtime, error: insertError } = await supabase
            .from(TABLE_ENUM.CINEMA_SHOWTIMES)
            .insert(showtimePayload)
            .select('id')
            .single();

          if (insertError) {
            throw insertError;
          }
          cinemaShowtimeId = insertedShowtime.id;
        }

        syncedMoviesCount += 1;

        const { error: deleteScheduleError } = await supabase
          .from(TABLE_ENUM.CINEMA_SHOWTIME_SCHEDULE_ENTRIES)
          .delete()
          .eq('cinema_showtime_id', cinemaShowtimeId);

        if (deleteScheduleError) {
          throw deleteScheduleError;
        }

        const scheduleRows =
          item.schedule?.map((entry) => ({
            cinema_showtime_id: cinemaShowtimeId,
            date: entry.date,
            day: entry.day,
            times: entry.times ?? [],
            premiere: entry.premiere ?? item.premiere ?? false,
          })) ?? [];

        if (scheduleRows.length > 0) {
          const { error: insertScheduleError } = await supabase
            .from(TABLE_ENUM.CINEMA_SHOWTIME_SCHEDULE_ENTRIES)
            .insert(scheduleRows);

          if (insertScheduleError) {
            throw insertScheduleError;
          }
          syncedSchedulesCount += scheduleRows.length;
        }
      }

      showToast(
        `Synced ${syncedMoviesCount} movies and ${syncedSchedulesCount} schedule entries`,
        'success'
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown DB save error';
      showToast(`Failed to save showtimes: ${message}`, 'error');
    } finally {
      setIsSavingToDb(false);
    }
  };

  const getCinemShowtimesFromDB = async (): Promise<IMovieDataDB[] | undefined> => {
    try {
      const { data: cinemaShowtimes, error: cinemaShowtimesError } = await supabase
        .from(TABLE_ENUM.CINEMA_SHOWTIMES)
        .select('*');

      const { data: cinemaShowtimesSchedules, error: cinemaShowtimesSchedulesError } =
        await supabase.from(TABLE_ENUM.CINEMA_SHOWTIME_SCHEDULE_ENTRIES).select('*');

      if (cinemaShowtimesError || cinemaShowtimesSchedulesError) {
        throw new Error('Failed to fetch cinema showtimes');
      }

      return cinemaShowtimes?.map((movie) => {
        const schedule = cinemaShowtimesSchedules?.filter(
          (showtime) => showtime.cinema_showtime_id === movie.id
        );

        return {
          ...movie,
          schedule: schedule,
        };
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown DB error';
      showToast(`Failed to fetch showtimes: ${message}`, 'error');
    }
  };

  useEffect(() => {
    const normalizeMovieData = async () => {
      setIsLoading(true);
      try {
        const showtimeItems = await getCinemShowtimesFromDB();
        const nowPlayingAndUpcomingMovies = await movieDB.getNowPlayingAndUpcoming();

        if (showtimeItems?.length === 0 || !showtimeItems) {
          console.error('No showtimes found in the database');
          return;
        }

        const data = await Promise.all(
          showtimeItems.map(async (item) => {
            let matchingMovie = nowPlayingAndUpcomingMovies?.results.find((movie) =>
              movie.original_title.includes(item.title)
            );

            if (!matchingMovie) {
              const backupMatchingMovie = await movieDB.getMoviesByName(item.title);
              matchingMovie = backupMatchingMovie?.results[0];
            }

            return {
              ...item,
              moviePoster: getMoviePoster(matchingMovie?.poster_path || ''),
            };
          })
        );

        setMovieData(data);
      } finally {
        setIsLoading(false);
      }
    };

    normalizeMovieData();
  }, []);

  const days = getNextDays().map((day) => ({
    id: day.iso,
    day: day.day,
    shortDate: day.short,
  }));
  const selectedCinema = watch('cinemaName');
  const filteredMovieData = movieData?.filter(
    (movie) => movie.cinema_name.toLowerCase() === selectedCinema.toLowerCase()
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoaderSpinner size={56} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FormSelect control={control} name="cinemaName" options={cinemaOptions} />
      <Text style={styles.helperText}>
        * The data can be wrong, so we strongly suggest to double check the dates and times on your
        local movie theaters website.
      </Text>
      {/*<View style={styles.syncButtonContainer}>
        <GradientButton
          text="Sync Current Movies To DB"
          onPress={saveCurrentMoviesToDb}
          loading={isSavingToDb}
          disabled={isSavingToDb}
        />
      </View>*/}
      <DatePillPicker days={days} activeDateId={activeDate} onSelectDate={setActiveDate} />

      {filteredMovieData && filteredMovieData.length > 0 && (
        <MovieScheduleList movies={filteredMovieData} onSelectShowtime={onSelectShowtime} />
      )}
    </View>
  );
};
