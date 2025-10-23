import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';
import { Colors, Spacing } from '../theme';

interface PortfolioItemProps {
  title: string;
  thumbnail: string;
  category: string;
  views: string;
  likes: string;
  engagement?: string;
  featured?: boolean;
  onPress?: () => void;
  onEdit?: () => void;
}

/**
 * PortfolioItem - Display portfolio work with stats
 * Perfect for: Portfolio gallery, work showcase, media library
 */
const PortfolioItem: React.FC<PortfolioItemProps> = ({
  title,
  thumbnail,
  category,
  views,
  likes,
  engagement,
  featured = false,
  onPress,
  onEdit,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Thumbnail */}
      <View style={styles.thumbnailContainer}>
        <FastImage
          source={{ uri: thumbnail }}
          style={styles.thumbnail}
          resizeMode={FastImage.resizeMode.cover}
        />
        {featured && (
          <View style={styles.featuredBadge}>
            <Icon name="star" size={16} color="#FFFFFF" />
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
        {onEdit && (
          <TouchableOpacity style={styles.editButton} onPress={onEdit}>
            <Icon name="edit" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        )}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Icon name="visibility" size={16} color="#6B7280" />
            <Text style={styles.statText}>{views}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="favorite" size={16} color="#EF4444" />
            <Text style={styles.statText}>{likes}</Text>
          </View>
          {engagement && (
            <View style={styles.statItem}>
              <Icon name="trending-up" size={16} color="#10B981" />
              <Text style={styles.statText}>{engagement}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  thumbnailContainer: {
    position: 'relative',
    height: 160,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  featuredText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  editButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    padding: Spacing.md,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
});

export default PortfolioItem;
