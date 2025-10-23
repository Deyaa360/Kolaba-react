import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing } from '../theme';

interface ProgressCardProps {
  title: string;
  current: number;
  total: number;
  unit?: string;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
}

/**
 * Reusable Progress Card Component
 * Perfect for showing progress towards goals, completion rates, milestones
 */
const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  current,
  total,
  unit = '',
  color = '#6366F1',
  backgroundColor = '#EEF2FF',
  showPercentage = true,
}) => {
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {showPercentage && (
          <Text style={[styles.percentage, { color }]}>
            {percentage.toFixed(0)}%
          </Text>
        )}
      </View>
      
      <View style={styles.progressContainer}>
        <View style={[styles.progressBackground, { backgroundColor }]}>
          <View 
            style={[
              styles.progressFill,
              { 
                width: `${percentage}%`,
                backgroundColor: color 
              }
            ]}
          />
        </View>
      </View>
      
      <Text style={styles.stats}>
        {current}{unit} of {total}{unit}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  percentage: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  progressContainer: {
    marginVertical: Spacing.sm,
  },
  progressBackground: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  stats: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});

export default ProgressCard;
