import { View, Text } from 'react-native';
import { Control } from 'react-hook-form';
import { DatePickerInput, FormInput, GradientButton } from '@/components/elements';
import { MovieSearch } from '@/components/Search';
import { MappedMovie } from '@/types';
import { styles } from './AddActivityForm.styles';

interface IAddActivityManualForm {
  control: Control<any>;
  selectedMovies: MappedMovie[];
  onMovieSelect: (movie: MappedMovie) => void;
  onClearSelection: () => void;
  maxSelection: number;
  onSubmit: () => void;
  isSubmitting: boolean;
  isDisabled: boolean;
  shouldShowSearchBar: boolean;
}

export const AddActivityManualForm = ({
  control,
  selectedMovies,
  onMovieSelect,
  onClearSelection,
  maxSelection,
  onSubmit,
  isSubmitting,
  isDisabled,
  shouldShowSearchBar,
}: IAddActivityManualForm) => (
  <>
    {shouldShowSearchBar && (
      <MovieSearch
        selectedMovies={selectedMovies}
        onMovieSelect={onMovieSelect}
        onClearSelection={onClearSelection}
        maxSelection={maxSelection}
      />
    )}

    <DatePickerInput control={control} name="date" placeholder="Date" minimumDate={new Date()} />

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
      onPress={onSubmit}
      loading={isSubmitting}
      disabled={isDisabled}
    />
  </>
);
