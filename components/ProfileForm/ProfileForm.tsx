import { Pressable, View, Text } from 'react-native';
import { FormInput, GradientButton, DatePickerInput } from '@/components/elements';
import { SubmitHandler, useForm } from 'react-hook-form';
import { styles } from './ProfileForm.style';
import { useState, useEffect } from 'react';
import { MappedMovie, Profile } from '@/types';
import { MAX_MOVIES_SELECTION, PROFILE_INPUT_VALIDATION_RULES, TABLE_ENUM } from '@/constants';
import { supabase } from '@/services/Supabase';
import { MovieSearch } from '@/components/Search';
import { useMovieSelection } from '@/hooks/useMovieSelection';
import { useToast } from '@/context/ToastContext';

type ProfileFormData = {
  firstName: string;
  lastName: string;
  birthday: string;
  topTenMovies: MappedMovie[] | undefined;
  topTenBooks: string[] | undefined;
  topTenShows: string[] | undefined;
};

export enum FORM_MODES {
  EDIT = 'edit',
  CREATE = 'create',
}

interface IProfileForm {
  onDone: () => void;
  initialProfile: Profile | undefined;
  formMode: FORM_MODES;
}

export const ProfileForm = ({
  onDone,
  initialProfile,
  formMode = FORM_MODES.CREATE,
}: IProfileForm) => {
  const { handleMovieSelection, selectedMovies, clearSelection } = useMovieSelection();
  const { showToast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<ProfileFormData>({
    mode: 'onTouched',
    defaultValues: {
      firstName: '',
      lastName: '',
      birthday: '',
      topTenBooks: [],
      topTenMovies: [],
      topTenShows: [],
    },
  });

  useEffect(() => {
    if (!initialProfile || formMode !== FORM_MODES.EDIT) return;

    reset({
      firstName: initialProfile.first_name ?? '',
      lastName: initialProfile.last_name ?? '',
      birthday: initialProfile.birthday ?? '',
      topTenMovies: initialProfile.top_ten_movies ?? [],
    });
  }, [initialProfile, formMode, reset]);

  useEffect(() => {
    setValue('topTenMovies', selectedMovies);
  }, [formMode, initialProfile, selectedMovies, setValue]);

  const onSubmit: SubmitHandler<ProfileFormData> = async (formData) => {
    setIsSubmitting(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return;
    }

    let profileData: Profile = {
      id: user.id,
      first_name: formData.firstName,
      last_name: formData.lastName,
      birthday: formData.birthday ? formData.birthday.toString() : null,
      updated_at: new Date(),
    };

    if (formMode === FORM_MODES.CREATE) {
      profileData.top_ten_movies = formData.topTenMovies;
    }

    const { error } = await supabase.from(TABLE_ENUM.PROFILES).upsert(profileData);

    setIsSubmitting(false);

    if (error) {
      showToast(error.message || 'Failed to save profile', 'error');
    } else {
      showToast(
        formMode === FORM_MODES.CREATE
          ? 'Profile created successfully!'
          : 'Profile updated successfully!',
        'success'
      );
      setTimeout(() => {
        onDone();
      }, 1500);
    }
  };

  return (
    <View style={styles.profileFormContainer}>
      <Text style={styles.headerText}>
        {formMode === FORM_MODES.CREATE ? 'Update Profile' : 'Edit Profile'}
      </Text>
      <FormInput
        control={control}
        name="firstName"
        placeholder="First name"
        rules={PROFILE_INPUT_VALIDATION_RULES.firstName}
      />

      {errors.firstName && <Text style={styles.errorText}>{errors.firstName.message}</Text>}

      <FormInput
        control={control}
        name="lastName"
        placeholder="Last name"
        rules={PROFILE_INPUT_VALIDATION_RULES.lastName}
      />

      {errors.lastName && <Text style={styles.errorText}>{errors.lastName.message}</Text>}

      <DatePickerInput
        control={control}
        name="birthday"
        placeholder="Birthday"
        rules={PROFILE_INPUT_VALIDATION_RULES.birthday}
        maximumDate={new Date()}
      />

      {errors.birthday && <Text style={styles.errorText}>{errors.birthday.message}</Text>}

      {formMode === FORM_MODES.CREATE && (
        <MovieSearch
          selectedMovies={selectedMovies}
          onMovieSelect={handleMovieSelection}
          onClearSelection={clearSelection}
          maxSelection={MAX_MOVIES_SELECTION}
          showCounter={true}
          showClearButton={true}
        />
      )}

      <View style={styles.buttonContainer}>
        <GradientButton
          text="Save profile"
          disabled={!isValid}
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
        />
        {formMode === FORM_MODES.EDIT && (
          <Pressable onPress={onDone} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};
