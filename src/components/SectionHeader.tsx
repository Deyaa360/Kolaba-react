import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Spacing } from '../theme';

interface SectionHeaderProps {
  icon?: string;
  iconColor?: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionIcon?: string;
  onAction?: () => void;
}

/**
 * Reusable Section Header Component
 * Perfect for page sections, list headers, content organization
 */
const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon,
  iconColor = '#6366F1',
  title,
  subtitle,
  actionLabel,
  actionIcon,
  onAction,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        {icon && (
          <Icon name={icon} size={22} color={iconColor} style={styles.icon} />
        )}
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>

      {(actionLabel || actionIcon) && onAction && (
        <TouchableOpacity style={styles.action} onPress={onAction}>
          {actionLabel && (
            <Text style={styles.actionLabel}>{actionLabel}</Text>
          )}
          {actionIcon && (
            <Icon name={actionIcon} size={18} color="#6366F1" />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionLabel: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
  },
});

export default SectionHeader;
