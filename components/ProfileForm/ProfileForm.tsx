import { Pressable, View, Text, Image } from 'react-native';
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
import * as ImagePicker from 'expo-image-picker';
import { Buffer } from 'buffer';

type ProfileFormData = {
  firstName: string;
  lastName: string;
  birthday: string;
  topTenMovies: MappedMovie[] | undefined;
  topTenBooks: string[] | undefined;
  topTenShows: string[] | undefined;
};

const PROFILE_IMAGES_BUCKET = 'avatars';

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
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const [selectedImageMimeType, setSelectedImageMimeType] = useState<string>('image/jpeg');

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
    setSelectedImageUri(initialProfile.avatar ?? null);
    setSelectedImageBase64(null);
    setSelectedImageMimeType('image/jpeg');
  }, [initialProfile, formMode, reset]);

  useEffect(() => {
    setValue('topTenMovies', selectedMovies);
  }, [formMode, initialProfile, selectedMovies, setValue]);

  const pickProfileImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showToast('Permission is required to select profile image', 'error');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setSelectedImageUri(result.assets[0].uri);
      setSelectedImageBase64(result.assets[0].base64 ?? null);
      setSelectedImageMimeType(result.assets[0].mimeType ?? 'image/jpeg');
    }
  };

  const uploadProfileImage = async (userId: string): Promise<string | null> => {
    if (!selectedImageUri) {
      return null;
    }

    if (!selectedImageBase64) {
      return null;
    }

    const base64Buffer = Buffer.from(selectedImageBase64, 'base64');
    const arrayBuffer = base64Buffer.buffer.slice(
      base64Buffer.byteOffset,
      base64Buffer.byteOffset + base64Buffer.byteLength
    );

    if (!arrayBuffer.byteLength) {
      throw new Error('Selected image is empty. Please pick another image.');
    }

    const fileExtension = selectedImageMimeType.split('/')[1] || 'jpg';
    const filePath = `${userId}/profile-${Date.now()}.${fileExtension}`;

    const { error: uploadError } = await supabase.storage
      .from(PROFILE_IMAGES_BUCKET)
      .upload(filePath, arrayBuffer, {
        upsert: true,
        contentType: selectedImageMimeType,
      });

    if (uploadError) {
      throw uploadError;
    }

    return filePath;
  };

  const onSubmit: SubmitHandler<ProfileFormData> = async (formData) => {
    setIsSubmitting(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setIsSubmitting(false);
      return;
    }

    let uploadedImagePath: string | null = null;
    try {
      uploadedImagePath = await uploadProfileImage(user.id);
    } catch (error) {
      setIsSubmitting(false);
      const message = error instanceof Error ? error.message : 'Failed to upload image';
      showToast(message, 'error');
      return;
    }

    const profileData: Profile = {
      id: user.id,
      first_name: formData.firstName,
      last_name: formData.lastName,
      birthday: formData.birthday ? formData.birthday.toString() : null,
      updated_at: new Date(),
    };

    if (uploadedImagePath) {
      profileData.avatar = uploadedImagePath;
    }

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

      <View style={styles.imageSection}>
        <Image
          source={
            selectedImageUri
              ? { uri: selectedImageUri }
              : require('@/assets/images/profile-placeholder.png')
          }
          style={styles.profileImagePreview}
        />
        <Pressable style={styles.uploadImageButton} onPress={pickProfileImage}>
          <Text style={styles.uploadImageButtonText}>Choose photo</Text>
        </Pressable>
      </View>

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
