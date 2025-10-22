import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  selectedObjective: string | null;
  selectedShipping: string | null;
  onObjectiveChange: (objective: string | null) => void;
  onShippingChange: (shipping: string | null) => void;
  onClearAll: () => void;
}

const objectives = [
  { value: null, label: 'All Objectives' },
  { value: 'paid_media_campaigns', label: 'Paid Media' },
  { value: 'organic_social_channels', label: 'Organic Social' },
  { value: 'ecommerce_web_pages', label: 'E-commerce' },
  { value: 'creative_asset_production', label: 'Creative Assets' },
  { value: 'brand_awareness', label: 'Brand Awareness' },
  { value: 'product_launch', label: 'Product Launch' },
];

const shippingOptions = [
  { value: null, label: 'All Types' },
  { value: 'required', label: 'Products Included' },
  { value: 'not_required', label: 'Content Only' },
];

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  selectedObjective,
  selectedShipping,
  onObjectiveChange,
  onShippingChange,
  onClearAll,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Icon name="tune" size={24} color={Colors.text} />
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={onClearAll}>
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {/* Campaign Objective */}
            <Text style={styles.sectionTitle}>Campaign Objective</Text>
            {objectives.map((objective) => (
              <TouchableOpacity
                key={objective.value || 'all'}
                style={styles.filterOption}
                onPress={() => onObjectiveChange(objective.value)}
              >
                <View style={[
                  styles.radioButton,
                  selectedObjective === objective.value && styles.radioButtonSelected
                ]}>
                  {selectedObjective === objective.value && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
                <Text style={styles.filterLabel}>{objective.label}</Text>
              </TouchableOpacity>
            ))}

            {/* Product Shipping */}
            <Text style={styles.sectionTitle}>
              Product Shipping
            </Text>
            {shippingOptions.map((option) => (
              <TouchableOpacity
                key={option.value || 'all'}
                style={styles.filterOption}
                onPress={() => onShippingChange(option.value)}
              >
                <View style={[
                  styles.radioButton,
                  selectedShipping === option.value && styles.radioButtonSelected
                ]}>
                  {selectedShipping === option.value && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
                <Text style={styles.filterLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Apply Button */}
          <TouchableOpacity style={styles.applyButton} onPress={onClose}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '75%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
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
    paddingTop: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xs,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    marginRight: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white,
  },
  filterLabel: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    flex: 1,
  },
  applyButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.lg,
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
