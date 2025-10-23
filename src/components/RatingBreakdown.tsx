import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors, Spacing } from '../theme';

interface RatingBreakdownProps {
  ratings: {
    communication: number;
    quality: number;
    delivery: number;
    professionalism: number;
  };
}

/**
 * RatingBreakdown - Display detailed rating categories
 * Perfect for: Reviews, feedback, performance metrics
 */
const RatingBreakdown: React.FC<RatingBreakdownProps> = ({ ratings }) => {
  const renderRatingBar = (label: string, rating: number, icon: string, color: string) => {
    const percentage = (rating / 5) * 100;

    return (
      <View key={label} style={styles.ratingRow}>
        <View style={styles.ratingHeader}>
          <View style={styles.ratingLabel}>
            <Icon name={icon} size={18} color={color} />
            <Text style={styles.ratingText}>{label}</Text>
          </View>
          <Text style={styles.ratingValue}>{rating.toFixed(1)}</Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${percentage}%`, backgroundColor: color }]}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderRatingBar('Communication', ratings.communication, 'chat', '#6366F1')}
      {renderRatingBar('Quality', ratings.quality, 'star', '#F59E0B')}
      {renderRatingBar('Delivery', ratings.delivery, 'schedule', '#10B981')}
      {renderRatingBar('Professionalism', ratings.professionalism, 'verified', '#8B5CF6')}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.lg,
    gap: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  ratingRow: {
    gap: 8,
  },
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});

export default RatingBreakdown;
