import { Control, Controller, ControllerProps, FieldValues, Path } from 'react-hook-form';
import { StyleProp, TextStyle, KeyboardTypeOptions, TextInput } from 'react-native';
import { styles } from './FormInput.styles';

interface IFormInputProps<TFieldValues extends FieldValues> {
  /**
   * The `control` object from `useForm`.
   * TFieldValues is a generic type representing the shape of your form data.
   */
  control: Control<TFieldValues>;
  /**
   * The name of the form field, e.g., "email", "password".
   * This is crucial for react-hook-form to register and track the input.
   */
  name: Path<TFieldValues>;
  /**
   * Optional validation rules for react-hook-form.
   */
  rules?: ControllerProps<TFieldValues, Path<TFieldValues>>['rules'];
  /**
   * Custom styles to apply to the TextInput.
   * StyleProp<TextStyle> allows for single style objects, arrays of styles, or undefined.
   */
  customStyle?: StyleProp<TextStyle>;
  /**
   * Placeholder text for the TextInput.
   */
  placeholder?: string;
  /**
   * Keyboard type for the TextInput, e.g., "email-address", "numeric".
   */
  keyboardType?: KeyboardTypeOptions;
  /**
   * If true, the text input obscures the text entered.
   */
  secureTextEntry?: boolean;
}

export const FormInput = <TFieldValues extends FieldValues>({
  control,
  name,
  rules,
  customStyle,
  placeholder,
  keyboardType,
  secureTextEntry,
}: IFormInputProps<TFieldValues>) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          style={[styles.input, customStyle]}
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
          placeholder={placeholder}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          placeholderTextColor="#999"
        />
      )}
    />
  );
};
