import { Control, Controller, ControllerProps, FieldValues, Path } from 'react-hook-form';
import { StyleProp, ViewStyle, Pressable, Text, Platform, Modal, View } from 'react-native';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './DatePickerInput.styles';

interface IDatePickerInputProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  rules?: ControllerProps<TFieldValues, Path<TFieldValues>>['rules'];
  customStyle?: StyleProp<ViewStyle>;
  placeholder?: string;
  maximumDate?: Date;
  minimumDate?: Date;
}

const formatDate = (date: Date | null | undefined): string => {
  if (!date) return '';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const DatePickerInput = <TFieldValues extends FieldValues>({
  control,
  name,
  rules,
  customStyle,
  placeholder = 'Select date',
  maximumDate,
  minimumDate,
}: IDatePickerInputProps<TFieldValues>) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selectedDate = value ? new Date(value) : null;
        const displayValue = selectedDate ? formatDate(selectedDate) : '';
        const pickerDate = tempDate || selectedDate || new Date();

        const handleDateChange = (event: any, date?: Date) => {
          if (Platform.OS === 'android') {
            setShowPicker(false);
            if (event.type === 'set' && date) {
              onChange(date.toISOString());
            }
          } else {
            if (date) {
              setTempDate(date);
            }
          }
        };

        const handlePress = () => {
          setTempDate(selectedDate);
          setShowPicker(true);
        };

        const handleIOSConfirm = () => {
          if (tempDate) {
            onChange(tempDate.toISOString());
          }
          setShowPicker(false);
          setTempDate(null);
        };

        const handleIOSCancel = () => {
          setShowPicker(false);
          setTempDate(null);
        };

        return (
          <>
            <Pressable
              style={[
                styles.container,
                error && styles.containerError,
                customStyle,
              ]}
              onPress={handlePress}
            >
              <Text style={[styles.text, !displayValue && styles.placeholderText]}>
                {displayValue || placeholder}
              </Text>
              <MaterialIcons name="calendar-today" size={20} color="#6B7280" />
            </Pressable>
            {Platform.OS === 'ios' && showPicker && (
              <Modal
                visible={showPicker}
                transparent
                animationType="slide"
                onRequestClose={handleIOSCancel}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                      <Pressable onPress={handleIOSCancel}>
                        <Text style={styles.modalCancelText}>Cancel</Text>
                      </Pressable>
                      <Pressable onPress={handleIOSConfirm}>
                        <Text style={styles.modalConfirmText}>Done</Text>
                      </Pressable>
                    </View>
                    <DateTimePicker
                      value={pickerDate}
                      mode="date"
                      display="spinner"
                      onChange={handleDateChange}
                      maximumDate={maximumDate}
                      minimumDate={minimumDate}
                    />
                  </View>
                </View>
              </Modal>
            )}
            {Platform.OS === 'android' && showPicker && (
              <DateTimePicker
                value={pickerDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={maximumDate}
                minimumDate={minimumDate}
              />
            )}
          </>
        );
      }}
    />
  );
};

