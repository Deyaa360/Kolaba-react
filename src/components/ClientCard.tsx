import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';
import { Colors, Spacing } from '../theme';

interface ClientCardProps {
  name: string;
  avatar?: string;
  company?: string;
  rating: number;
  totalSpent: string;
  projectsCompleted: number;
  location?: string;
  verified?: boolean;
  onPress?: () => void;
}

/**
 * ClientCard - Display client information and stats
 * Perfect for: Client list, collaboration history, testimonials
 */
const ClientCard: React.FC<ClientCardProps> = ({
  name,
  avatar,
  company,
  rating,
  totalSpent,
  projectsCompleted,
  location,
  verified = false,
  onPress,
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Icon
        key={index}
        name={index < Math.floor(rating) ? 'star' : 'star-border'}
        size={14}
        color="#F59E0B"
      />
    ));
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Client Info */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {avatar ? (
            <FastImage source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Icon name="person" size={28} color="#6B7280" />
            </View>
          )}
          {verified && (
            <View style={styles.verifiedBadge}>
              <Icon name="verified" size={16} color="#10B981" />
            </View>
          )}
        </View>

        <View style={styles.clientInfo}>
          <Text style={styles.clientName} numberOfLines={1}>
            {name}
          </Text>
          {company && (
            <View style={styles.companyRow}>
              <Icon name="business" size={14} color="#6B7280" />
              <Text style={styles.companyName} numberOfLines={1}>
                {company}
              </Text>
            </View>
          )}
          {location && (
            <View style={styles.locationRow}>
              <Icon name="location-on" size={14} color="#9CA3AF" />
              <Text style={styles.locationText}>{location}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Rating */}
      <View style={styles.ratingRow}>
        <View style={styles.stars}>{renderStars(rating)}</View>
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Icon name="attach-money" size={20} color="#10B981" />
          <View>
            <Text style={styles.statValue}>{totalSpent}</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Icon name="work" size={20} color="#6366F1" />
          <View>
            <Text style={styles.statValue}>{projectsCompleted}</Text>
            <Text style={styles.statLabel}>Projects</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3F4F6',
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 2,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  companyName: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.md,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: Spacing.sm,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
});

export default ClientCard;
