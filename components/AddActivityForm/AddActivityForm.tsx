import { View, Text } from 'react-native';
import { styles } from './AddActivityForm.styles';
import { DatePickerInput, FormInput, GradientButton } from '@/components/elements';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ACTIVITY_TYPES_ENUM } from '@/constants/activity-types';
import { MappedMovie } from '@/types';
import { MovieSearch } from '@/components/Search';
import { useMovieSelection } from '@/hooks/useMovieSelection';
import { FormSelect } from '@/components/elements/FormSelect';
import { supabase } from '@/services/Supabase';
import { TABLE_ENUM } from '@/constants';
import { useToast } from '@/context/ToastContext';
import { UserMetadata } from '@supabase/auth-js';

type ActivityFormData = {
  userId: string;
  firstName: string;
  lastName: string;
  activityType: ACTIVITY_TYPES_ENUM;
  activityName: string;
  activityData: MappedMovie[] | string[];
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
  onSubmitCallback?: () => void;
}

export const AddActivityForm = ({ onSubmitCallback }: IAddActivityForm) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleMovieSelection, selectedMovies, clearSelection } = useMovieSelection({
    maxSelection: MAX_MOVIES_SELECTION,
  });
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
      activityData: [],
      date: '',
      time: '',
      place: '',
      price: 0,
    },
  });

  useEffect(() => {
    setValue('activityData', selectedMovies);
  }, [selectedMovies, setValue]);

  const onSubmit = async (formData: ActivityFormData) => {
    setIsSubmitting(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return;
    }

    const metadata = user.user_metadata as UserMetadata;

    const activityData = {
      user_id: user.id,
      first_name: metadata.first_name ?? '',
      last_name: metadata.last_name ?? '',
      email: user.email,
      activity_type: formData.activityType,
      activity_data: selectedMovies,
      date: formData.date,
      time: formData.time,
      place: formData.place,
      price: formData.price,
    };

    const { error } = await supabase.from(TABLE_ENUM.ACTIVITIES).upsert(activityData);

    setIsSubmitting(false);

    if (error) {
      showToast(error.message || 'Failed to save profile', 'error');
    } else {
      showToast('Activity added!', 'success');
      setTimeout(() => {
        onSubmitCallback && onSubmitCallback();
      }, 1500);
    }
  };

  return (
    <View style={styles.formContainer}>
      <FormSelect control={control} name="activityType" options={activityTypeOptions} />

      <MovieSearch
        selectedMovies={selectedMovies}
        onMovieSelect={handleMovieSelection}
        onClearSelection={clearSelection}
        maxSelection={MAX_MOVIES_SELECTION}
      />

      <DatePickerInput control={control} name="date" placeholder="Date" />

      <FormInput control={control} name="time" placeholder="Time" />
      <FormInput control={control} name="place" placeholder="Place" />
      <View style={styles.priceInputContainer}>
        <View style={styles.pricePrefix}>
          <Text style={styles.pricePrefixText}>RSD</Text>
        </View>
        <FormInput
          control={control}
          name="price"
          placeholder="0"
          keyboardType="numeric"
          customStyle={styles.priceInput}
        />
      </View>

      <GradientButton
        text="Add activity"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        disabled={!isValid || isSubmitting}
      />
    </View>
  );
};
