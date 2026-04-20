import { Pressable, ScrollView, Text } from 'react-native';
import { styles } from './DatePillPicker.styles';

export type DatePillItem = {
  id: string;
  day: string;
  shortDate: string;
};

interface IDatePillPicker {
  days: DatePillItem[];
  activeDateId: string | null;
  onSelectDate: (dateId: string) => void;
}

export const DatePillPicker = ({ days, activeDateId, onSelectDate }: IDatePillPicker) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.container}
    contentContainerStyle={styles.contentContainer}
  >
    {days.map((day) => {
      const isActive = activeDateId === day.id;

      return (
        <Pressable
          key={day.id}
          style={[styles.pill, isActive && styles.pillActive]}
          onPress={() => onSelectDate(day.id)}
        >
          <Text style={[styles.dayText, isActive && styles.dayTextActive]}>{day.day}</Text>
          <Text style={[styles.dateText, isActive && styles.dateTextActive]}>{day.shortDate}</Text>
        </Pressable>
      );
    })}
  </ScrollView>
);
