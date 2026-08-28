import React, { FC, useEffect, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Button } from '../Button';
import { brand } from '@/src/core/theme';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  isSubmitting?: boolean;
  /** Solid accent (custom app primaryColor). Without it — brand gradient. */
  color?: string;
  onConfirm: () => void;
  onClose: () => void;
}

const DURATION = 200;

export const ConfirmModal: FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isSubmitting = false,
  color,
  onConfirm,
  onClose,
}) => {
  const [visible, setVisible] = useState(isOpen);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      progress.value = withTiming(1, { duration: DURATION });
    } else {
      progress.value = withTiming(0, { duration: DURATION }, (finished) => {
        if (finished) runOnJS(setVisible)(false);
      });
    }
  }, [isOpen]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const cardStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 0.95 + 0.05 * progress.value }],
  }));

  const handleClose = () => {
    if (!isSubmitting) onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
      presentationStyle="overFullScreen">
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]} />
      </TouchableWithoutFeedback>

      <View pointerEvents="box-none" style={styles.center}>
        <Animated.View style={[styles.card, cardStyle]}>
          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}

          <Button
            title={confirmText}
            onPress={onConfirm}
            isValid
            isSubmitting={isSubmitting}
            style={styles.confirmButton}
            color={color}
          />

          <TouchableOpacity
            onPress={handleClose}
            disabled={isSubmitting}
            accessibilityLabel={cancelText}
            style={[styles.cancelButton, { borderColor: color ?? brand[500] }]}>
            <Text style={[styles.cancelText, { color: color ?? brand[500] }]}>{cancelText}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(0,0,0,0.4)' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  title: { fontSize: 20, color: '#0F172A', textAlign: 'center' },
  message: { fontSize: 15, color: '#64748B', textAlign: 'center', marginTop: 10 },
  confirmButton: { marginTop: 24 },
  cancelButton: {
    width: '100%',
    height: 45,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#0052CD',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  cancelText: { fontSize: 18, color: '#0052CD' },
});
