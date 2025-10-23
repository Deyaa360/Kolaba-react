import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors, Spacing } from '../theme';

interface TimelineStepProps {
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'current' | 'upcoming';
  isLast?: boolean;
}

/**
 * TimelineStep - Display project milestones and progress
 * Perfect for: Project timeline, order tracking, milestone visualization
 */
const TimelineStep: React.FC<TimelineStepProps> = ({
  title,
  description,
  date,
  status,
  isLast = false,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'completed':
        return { color: '#10B981', icon: 'check-circle' };
      case 'current':
        return { color: '#6366F1', icon: 'radio-button-checked' };
      default:
        return { color: '#D1D5DB', icon: 'radio-button-unchecked' };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <View style={styles.container}>
      {/* Timeline Indicator */}
      <View style={styles.timelineColumn}>
        <View style={[styles.iconContainer, { backgroundColor: `${statusConfig.color}20` }]}>
          <Icon name={statusConfig.icon} size={24} color={statusConfig.color} />
        </View>
        {!isLast && (
          <View
            style={[
              styles.connector,
              { backgroundColor: status === 'completed' ? statusConfig.color : '#E5E7EB' },
            ]}
          />
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, status === 'upcoming' && styles.titleUpcoming]}>
            {title}
          </Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <Text style={[styles.description, status === 'upcoming' && styles.descriptionUpcoming]}>
          {description}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  timelineColumn: {
    alignItems: 'center',
    marginRight: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connector: {
    width: 2,
    flex: 1,
    marginTop: 8,
  },
  content: {
    flex: 1,
    paddingBottom: Spacing.xl,
  },
  header: {
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  titleUpcoming: {
    color: '#9CA3AF',
  },
  date: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  descriptionUpcoming: {
    color: '#9CA3AF',
  },
});

export default TimelineStep;
