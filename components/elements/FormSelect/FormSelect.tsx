import { styles as inputStyles } from '../FormInput/FormInput.styles';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
  FlatList,
} from 'react-native';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { styles } from './FormSelect.styles';

type Option = { label: string; value: string | number };

interface FormSelectProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  rules?: any;
  placeholder?: string;
  options: Option[];
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const FormSelect = <TFieldValues extends FieldValues>({
  control,
  name,
  rules,
  placeholder = 'Select…',
  options,
  containerStyle,
  textStyle,
}: FormSelectProps<TFieldValues>) => {
  const [visible, setVisible] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selectedOption = options.find((o) => o.value === value);

        return (
          <>
            <Pressable
              style={[inputStyles.input, error && inputStyles.inputError, containerStyle]}
              onPress={() => setVisible(true)}
            >
              <Text style={[selectedOption ? styles.valueText : styles.placeholderText, textStyle]}>
                {selectedOption ? selectedOption.label : placeholder}
              </Text>
            </Pressable>

            <Modal
              visible={visible}
              transparent
              animationType="fade"
              onRequestClose={() => setVisible(false)}
            >
              <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
                <View style={styles.modal}>
                  <FlatList
                    data={options}
                    keyExtractor={(item) => String(item.value)}
                    renderItem={({ item }) => (
                      <Pressable
                        onPress={() => {
                          onChange(item.value);
                          setVisible(false);
                        }}
                        style={styles.option}
                      >
                        <Text style={styles.optionText}>{item.label}</Text>
                      </Pressable>
                    )}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                  />
                </View>
              </Pressable>
            </Modal>

            {error && <Text style={styles.errorText}>{error.message as string}</Text>}
          </>
        );
      }}
    />
  );
};
