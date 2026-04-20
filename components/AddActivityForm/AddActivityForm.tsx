import { View } from 'react-native';
import { styles } from './AddActivityForm.styles';
import { GradientButton } from '@/components/elements';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ACTIVITY_TYPES_ENUM } from '@/constants/activity-types';
import { MappedMovie } from '@/types';
import { useMovieSelection } from '@/hooks/useMovieSelection';
import { FormSelect } from '@/components/elements/FormSelect';
import { supabase } from '@/services/Supabase';
import { ACTIVITY_LIFECYCLE_STATUS_ENUM, TAB_ENUM, TABLE_ENUM } from '@/constants';
import { useToast } from '@/context/ToastContext';
import { AddActivityManualForm } from './AddActivityManualForm';
import { TabMenu } from '@/components/TabMenu';
import { RealDataForm } from '@/components/AddActivityForm/RealDataForm';

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
  const [activeTab, setActiveTab] = useState<TAB_ENUM>(TAB_ENUM.REAL_DATA_FORM);
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

  return (
    <View style={styles.formContainer}>
      <FormSelect control={control} name="activityType" options={activityTypeOptions} />

      <TabMenu
        activeTab={activeTab}
        handleActiveTabPress={(tab) => setActiveTab(tab)}
        tabGroups={[TAB_ENUM.REAL_DATA_FORM, TAB_ENUM.MANUAL_FORM]}
      />

      {activeTab === TAB_ENUM.MANUAL_FORM ? (
        <AddActivityManualForm
          control={control}
          selectedMovies={selectedMovies}
          onMovieSelect={handleMovieSelection}
          onClearSelection={clearSelection}
          maxSelection={MAX_MOVIES_SELECTION}
        />
      ) : (
        <RealDataForm />
      )}

      <GradientButton
        text="Add activity"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        disabled={!isValid || isSubmitting}
      />
    </View>
  );
};
