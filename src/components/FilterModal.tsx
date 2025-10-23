import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  useAnimatedGestureHandler,
  runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MODAL_MAX_HEIGHT = SCREEN_HEIGHT * 0.75; // 75% of screen height for more filters

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  selectedObjectives: string[];
  selectedShipping: string[];
  onObjectivesChange: (objectives: string[]) => void;
  onShippingChange: (shipping: string[]) => void;
  onClearAll: () => void;
}

const objectives = [
  { value: 'paid_media_campaigns', label: 'Paid Media' },
  { value: 'organic_social_channels', label: 'Organic Social' },
  { value: 'ecommerce_web_pages', label: 'E-commerce' },
  { value: 'creative_asset_production', label: 'Creative Assets' },
];

const shippingOptions = [
  { value: 'required', label: 'Products Included' },
  { value: 'not_required', label: 'Content Only' },
];

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  selectedObjectives,
  selectedShipping,
  onObjectivesChange,
  onShippingChange,
  onClearAll,
}) => {
  const toggleObjective = (value: string) => {
    if (selectedObjectives.includes(value)) {
      onObjectivesChange(selectedObjectives.filter(v => v !== value));
    } else {
      onObjectivesChange([...selectedObjectives, value]);
    }
  };

  const toggleShipping = (value: string) => {
    if (selectedShipping.includes(value)) {
      onShippingChange(selectedShipping.filter(v => v !== value));
    } else {
      onShippingChange([...selectedShipping, value]);
    }
  };
  // Animation values
  const backdropOpacity = useSharedValue(0);
  const translateY = useSharedValue(MODAL_MAX_HEIGHT);

  useEffect(() => {
    if (visible) {
      // Animate in
      backdropOpacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSpring(0, {
        damping: 25,
        stiffness: 300,
      });
    } else {
      // Animate out
      backdropOpacity.value = withTiming(0, { duration: 150 });
      translateY.value = withTiming(MODAL_MAX_HEIGHT, { duration: 150 });
    }
  }, [visible]);

  // Gesture handler for drag to dismiss
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      context.startY = translateY.value;
    },
    onActive: (event, context: any) => {
      // Only allow dragging down
      if (event.translationY > 0) {
        translateY.value = context.startY + event.translationY;
      }
    },
    onEnd: (event) => {
      // If dragged down more than 100px or with sufficient velocity, close
      if (event.translationY > 100 || event.velocityY > 500) {
        translateY.value = withTiming(MODAL_MAX_HEIGHT, { duration: 150 });
        backdropOpacity.value = withTiming(0, { duration: 150 });
        runOnJS(onClose)();
      } else {
        // Snap back to open position
        translateY.value = withSpring(0, {
          damping: 25,
          stiffness: 300,
        });
      }
    },
  });

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={onClose}>
            <Animated.View style={[styles.backdrop, backdropStyle]} />
          </TouchableWithoutFeedback>
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={[styles.modalContent, modalStyle]}>
              {/* Drag Handle */}
              <View style={styles.dragHandleContainer}>
                <View style={styles.dragHandle} />
              </View>

              {/* Header */}
              <View style={styles.modalHeader}>
                <Icon name="tune" size={24} color={Colors.text} />
                <Text style={styles.modalTitle}>Filters</Text>
                <TouchableOpacity onPress={onClearAll}>
                  <Text style={styles.clearAllText}>Clear All</Text>
                </TouchableOpacity>
              </View>

              <ScrollView 
                style={styles.modalBody}
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
            {/* Campaign Objective */}
            <Text style={styles.sectionTitle}>Campaign Objective</Text>
            {objectives.map((objective) => {
              const isSelected = selectedObjectives.includes(objective.value);
              return (
                <TouchableOpacity
                  key={objective.value}
                  style={styles.filterOption}
                  onPress={() => toggleObjective(objective.value)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.checkbox,
                    isSelected && styles.checkboxSelected
                  ]}>
                    {isSelected && (
                      <Icon name="check" size={16} color={Colors.white} />
                    )}
                  </View>
                  <Text style={styles.filterLabel}>{objective.label}</Text>
                </TouchableOpacity>
              );
            })}

            {/* Product Shipping */}
            <Text style={styles.sectionTitle}>
              Product Shipping
            </Text>
            {shippingOptions.map((option) => {
              const isSelected = selectedShipping.includes(option.value);
              return (
                <TouchableOpacity
                  key={option.value}
                  style={styles.filterOption}
                  onPress={() => toggleShipping(option.value)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.checkbox,
                    isSelected && styles.checkboxSelected
                  ]}>
                    {isSelected && (
                      <Icon name="check" size={16} color={Colors.white} />
                    )}
                  </View>
                  <Text style={styles.filterLabel}>{option.label}</Text>
                </TouchableOpacity>
              );
            })}
            </ScrollView>

            {/* Apply Button */}
            <View style={styles.footer}>
              <TouchableOpacity style={styles.applyButton} onPress={onClose}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </PanGestureHandler>
      </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: MODAL_MAX_HEIGHT,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray300,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    flex: 1,
    marginLeft: Spacing.sm,
  },
  clearAllText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  modalBody: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    marginTop: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    marginBottom: 2,
    backgroundColor: 'transparent',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#9DA5BE',
    marginRight: Spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  checkboxSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  filterLabel: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
  applyButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: '#FFFFFF',
  },
});

export default FilterModal;
