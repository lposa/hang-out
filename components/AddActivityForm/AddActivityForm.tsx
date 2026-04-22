import { Pressable, Text, View } from 'react-native';
import { styles } from './AddActivityForm.styles';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ACTIVITY_TYPES_ENUM } from '@/constants/activity-types';
import { MappedMovie } from '@/types';
import { useMovieSelection } from '@/hooks/useMovieSelection';
import { supabase } from '@/services/Supabase';
import { ACTIVITY_LIFECYCLE_STATUS_ENUM, TAB_ENUM, TABLE_ENUM } from '@/constants';
import { useToast } from '@/context/ToastContext';
import { AddActivityManualForm } from './AddActivityManualForm';
import { TabMenu } from '@/components/TabMenu';
import {
  CurrentMoviesInTheaters,
  ISelectedShowtimePayload,
} from '@/components/AddActivityForm/components/CurrentMoviesInTheaters/CurrentMoviesInTheaters';
import { MovieDetails } from '@/components/MovieDetails/MovieDetails';

type ActivityFormData = {
  userId: string;
  firstName: string;
  lastName: string;
  activityType: ACTIVITY_TYPES_ENUM;
  activityName: string;
  activityData: MappedMovie | null;
  date: string;
  time: string;
  place: string;
  price: number;
};

const activityTypeOptions = [
  { label: 'Movie', value: ACTIVITY_TYPES_ENUM.MOVIE },
  { label: 'Basketball', value: ACTIVITY_TYPES_ENUM.BASKETBALL },
];

const MAX_MOVIES_SELECTION = 1;

interface IAddActivityForm {
  onSubmitCallback?: () => void | Promise<void>;
}

export const AddActivityForm = ({ onSubmitCallback }: IAddActivityForm) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleMovieSelection, selectedMovies, clearSelection } = useMovieSelection({
    maxSelection: MAX_MOVIES_SELECTION,
  });
  const [activeTab, setActiveTab] = useState<TAB_ENUM>(TAB_ENUM.ADD_ACTIVITY);
  const [prefilledMovie, setPrefilledMovie] = useState<MappedMovie | null>(null);
  const { showToast } = useToast();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<ActivityFormData>({
    mode: 'onTouched',
    defaultValues: {
      activityType: undefined,
      activityData: null,
      date: '',
      time: '',
      place: '',
      price: 0,
    },
  });

  useEffect(() => {
    setValue('activityData', selectedMovies[0] ?? null);
  }, [selectedMovies, setValue]);

  const onSubmit = async (formData: ActivityFormData) => {
    setIsSubmitting(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setIsSubmitting(false);
      return;
    }

    const { data: profile } = await supabase
      .from(TABLE_ENUM.PROFILES)
      .select('first_name, last_name')
      .eq('id', user.id)
      .single();

    const activityData = {
      user_id: user.id,
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      email: user.email,
      activity_type: formData.activityType,
      activity_data: selectedMovies[0] ?? null,
      date: formData.date,
      time: formData.time,
      place: formData.place,
      price: formData.price,
    };

    const { data: createdActivity, error } = await supabase
      .from(TABLE_ENUM.ACTIVITIES)
      .insert(activityData)
      .select('id')
      .single();

    setIsSubmitting(false);

    if (error) {
      showToast(error.message || 'Failed to save activity', 'error');
      console.error(error);
      return;
    }

    const { error: activityStatusError } = await supabase
      .from(TABLE_ENUM.ACTIVITY_STATUSES)
      .insert({
        activity_id: createdActivity.id,
        status: ACTIVITY_LIFECYCLE_STATUS_ENUM.PENDING,
      });

    if (activityStatusError) {
      showToast(activityStatusError.message || 'Failed to set initial activity status', 'error');
      console.log(activityStatusError);
    } else {
      showToast('Activity added!', 'success');

      if (onSubmitCallback) {
        await onSubmitCallback();
      }
    }
  };

  const prefillActivityForm = async ({
    movie,
    time,
    date,
    cinemaName,
  }: ISelectedShowtimePayload) => {
    setValue('time', time);
    setValue('place', cinemaName);

    handleMovieSelection(movie);
    setPrefilledMovie(movie);

    if (date) {
      const [dayPart, monthPart] = date.split('.');
      if (dayPart && monthPart) {
        const now = new Date();
        const parsedDate = new Date(now.getFullYear(), Number(monthPart) - 1, Number(dayPart));
        setValue('date', parsedDate.toISOString());
      }
    }

    setActiveTab(TAB_ENUM.ADD_ACTIVITY);
  };

  const clearPrefilledSelection = () => {
    clearSelection();
    setPrefilledMovie(null);
    setValue('activityData', null);
    setValue('date', '');
    setValue('time', '');
    setValue('place', '');
  };

  return (
    <View style={styles.formContainer}>
      {/*<FormSelect control={control} name="activityType" options={activityTypeOptions} />*/}

      <TabMenu
        activeTab={activeTab}
        handleActiveTabPress={(tab) => setActiveTab(tab)}
        tabGroups={[TAB_ENUM.NOW_SHOWING, TAB_ENUM.ADD_ACTIVITY]}
      />

      {prefilledMovie && (
        <>
          <MovieDetails movie={prefilledMovie} />
          <Pressable style={styles.clearPrefilledButton} onPress={clearPrefilledSelection}>
            <Text style={styles.clearPrefilledButtonText}>Clear selected movie</Text>
          </Pressable>
        </>
      )}

      {activeTab === TAB_ENUM.ADD_ACTIVITY ? (
        <AddActivityManualForm
          control={control}
          selectedMovies={selectedMovies}
          onMovieSelect={handleMovieSelection}
          onClearSelection={clearPrefilledSelection}
          maxSelection={MAX_MOVIES_SELECTION}
          onSubmit={handleSubmit(onSubmit)}
          isSubmitting={isSubmitting}
          isDisabled={!isValid || isSubmitting}
          shouldShowSearchBar={!prefilledMovie}
        />
      ) : (
        <CurrentMoviesInTheaters onSelectShowtime={prefillActivityForm} />
      )}
    </View>
  );
};
