import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors, Spacing } from '../theme';

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'pending';

interface StatusCardProps {
  status: StatusType;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  timestamp?: string;
}

/**
 * Reusable Status Card Component
 * Perfect for notifications, alerts, status updates, system messages
 */
const StatusCard: React.FC<StatusCardProps> = ({
  status,
  title,
  message,
  actionLabel,
  onAction,
  timestamp,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          icon: 'check-circle',
          iconColor: '#10B981',
          backgroundColor: '#ECFDF5',
          borderColor: '#A7F3D0',
        };
      case 'warning':
        return {
          icon: 'warning',
          iconColor: '#F59E0B',
          backgroundColor: '#FFFBEB',
          borderColor: '#FDE68A',
        };
      case 'error':
        return {
          icon: 'error',
          iconColor: '#EF4444',
          backgroundColor: '#FEF2F2',
          borderColor: '#FECACA',
        };
      case 'info':
        return {
          icon: 'info',
          iconColor: '#3B82F6',
          backgroundColor: '#EFF6FF',
          borderColor: '#BFDBFE',
        };
      case 'pending':
        return {
          icon: 'schedule',
          iconColor: '#8B5CF6',
          backgroundColor: '#FAF5FF',
          borderColor: '#E9D5FF',
        };
      default:
        return {
          icon: 'info',
          iconColor: '#6B7280',
          backgroundColor: '#F9FAFB',
          borderColor: '#E5E7EB',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <View style={[styles.card, { backgroundColor: config.backgroundColor, borderColor: config.borderColor }]}>
      <View style={styles.iconContainer}>
        <Icon name={config.icon} size={24} color={config.iconColor} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        
        <View style={styles.footer}>
          {timestamp && (
            <Text style={styles.timestamp}>{timestamp}</Text>
          )}
          {actionLabel && onAction && (
            <TouchableOpacity onPress={onAction}>
              <Text style={[styles.actionLabel, { color: config.iconColor }]}>
                {actionLabel}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: Spacing.lg,
    borderRadius: 4,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  iconContainer: {
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timestamp: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
});

export default StatusCard;
