import { View, Modal, Pressable, StyleSheet, Text, ScrollView } from 'react-native';
import { styles } from './AppModal.styles';
import { ReactNode } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface IAppModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export const AppModal = ({ visible, onClose, children, title }: IAppModalProps) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.modal}>
          <LinearGradient
            colors={['#F9FBFF', '#EEF3FF']}
            start={[0, 0]}
            end={[0, 1]}
            style={styles.gradientBackground}
          >
            {title && (
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{title}</Text>
                <Pressable onPress={onClose} style={styles.closeButton}>
                  <MaterialIcons name="close" size={24} color="#111827" />
                </Pressable>
              </View>
            )}
            <ScrollView
              style={styles.modalContent}
              contentContainerStyle={[
                styles.modalContentContainer,
                { paddingBottom: insets.bottom + 20 },
              ]}
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};
