import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';
import { Colors, Spacing } from '../theme';

interface FeatureCardProps {
  image?: string;
  icon?: string;
  iconColor?: string;
  iconBackground?: string;
  title: string;
  description?: string;
  badge?: string;
  badgeColor?: string;
  badgeBackground?: string;
  onPress?: () => void;
  horizontal?: boolean;
}

/**
 * Reusable Feature Card Component
 * Perfect for showcasing features, campaigns, products, or content
 * Can be used vertically (default) or horizontally
 */
const FeatureCard: React.FC<FeatureCardProps> = ({
  image,
  icon,
  iconColor = '#6366F1',
  iconBackground = '#EEF2FF',
  title,
  description,
  badge,
  badgeColor = '#6366F1',
  badgeBackground = '#EEF2FF',
  onPress,
  horizontal = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, horizontal && styles.horizontalCard]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Image or Icon Header */}
      <View style={[styles.header, horizontal && styles.horizontalHeader]}>
        {image ? (
          <FastImage
            source={{ uri: image }}
            style={[styles.image, horizontal && styles.horizontalImage]}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : icon ? (
          <View style={[styles.iconPlaceholder, { backgroundColor: iconBackground }]}>
            <Icon name={icon} size={horizontal ? 20 : 24} color={iconColor} />
          </View>
        ) : null}
      </View>

      {/* Content */}
      <View style={[styles.content, horizontal && styles.horizontalContent]}>
        <Text style={styles.title} numberOfLines={horizontal ? 1 : 2}>
          {title}
        </Text>
        {description && (
          <Text style={styles.description} numberOfLines={horizontal ? 1 : 2}>
            {description}
          </Text>
        )}
        
        {/* Badge and Arrow */}
        <View style={styles.footer}>
          {badge && (
            <View style={[styles.badge, { backgroundColor: badgeBackground }]}>
              <Text style={[styles.badgeText, { color: badgeColor }]}>{badge}</Text>
            </View>
          )}
          <Icon name="arrow-forward" size={16} color="#9CA3AF" style={styles.arrow} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  horizontalCard: {
    flexDirection: 'row',
  },
  header: {
    marginBottom: Spacing.md,
  },
  horizontalHeader: {
    marginBottom: 0,
    marginRight: Spacing.md,
  },
  image: {
    width: '100%',
    height: 120,
  },
  horizontalImage: {
    width: 80,
    height: 80,
  },
  iconPlaceholder: {
    width: '100%',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: Spacing.lg,
  },
  horizontalContent: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 20,
    marginBottom: 6,
  },
  description: {
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
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  arrow: {
    marginLeft: 'auto',
  },
});

export default FeatureCard;
