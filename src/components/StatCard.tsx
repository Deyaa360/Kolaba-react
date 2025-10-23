import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors, Spacing } from '../theme';

interface StatCardProps {
  icon: string;
  iconColor: string;
  iconBackground: string;
  value: string | number;
  label: string;
  onPress?: () => void;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

/**
 * Reusable Stat Card Component
 * Perfect for dashboard metrics, KPIs, and statistics
 */
const StatCard: React.FC<StatCardProps> = ({
  icon,
  iconColor,
  iconBackground,
  value,
  label,
  onPress,
  trend,
}) => {
  const content = (
    <>
      <View style={[styles.iconContainer, { backgroundColor: iconBackground }]}>
        <Icon name={icon} size={20} color={iconColor} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <View style={styles.footer}>
        <Text style={styles.label}>{label}</Text>
        {trend && (
          <View style={[styles.trend, { backgroundColor: trend.isPositive ? '#D1FAE5' : '#FEE2E2' }]}>
            <Icon
              name={trend.isPositive ? 'arrow-upward' : 'arrow-downward'}
              size={10}
              color={trend.isPositive ? '#059669' : '#DC2626'}
            />
            <Text style={[styles.trendText, { color: trend.isPositive ? '#059669' : '#DC2626' }]}>
              {trend.value}
            </Text>
          </View>
        )}
      </View>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.card}>{content}</View>;
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  trend: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  trendText: {
    fontSize: 10,
    fontWeight: '700',
  },
});

export default StatCard;
