import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';

interface DetailChipProps {
  label: string;
  icon?: string;
  backgroundColor?: string;
  textColor?: string;
  size?: 'small' | 'medium';
}

const DetailChip: React.FC<DetailChipProps> = ({
  label,
  icon,
  backgroundColor = Colors.primary + '20',
  textColor = Colors.primary,
  size = 'medium',
}) => {
  const chipStyle = size === 'small' ? styles.chipSmall : styles.chip;
  const textStyle = size === 'small' ? styles.chipTextSmall : styles.chipText;

  return (
    <View style={[chipStyle, { backgroundColor }]}>
      {icon && (
        <Icon
          name={icon}
          size={size === 'small' ? 14 : 16}
          color={textColor}
          style={styles.icon}
        />
      )}
      <Text style={[textStyle, { color: textColor }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  chipSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  chipText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  chipTextSmall: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  icon: {
    marginRight: Spacing.xs,
  },
});

export default DetailChip;
