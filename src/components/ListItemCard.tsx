import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';
import { Colors, Spacing } from '../theme';

interface ListItemCardProps {
  image?: string;
  icon?: string;
  iconColor?: string;
  iconBackground?: string;
  title: string;
  subtitle?: string;
  rightText?: string;
  rightSubtext?: string;
  badge?: string;
  badgeColor?: string;
  badgeBackground?: string;
  showArrow?: boolean;
  onPress?: () => void;
}

/**
 * Reusable List Item Card Component
 * Perfect for lists, menus, settings, navigation items
 */
const ListItemCard: React.FC<ListItemCardProps> = ({
  image,
  icon,
  iconColor = '#6366F1',
  iconBackground = '#EEF2FF',
  title,
  subtitle,
  rightText,
  rightSubtext,
  badge,
  badgeColor = '#FFFFFF',
  badgeBackground = '#EF4444',
  showArrow = true,
  onPress,
}) => {
  const content = (
    <>
      {/* Left Side: Image or Icon */}
      <View style={styles.leftContainer}>
        {image ? (
          <FastImage
            source={{ uri: image }}
            style={styles.image}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : icon ? (
          <View style={[styles.iconContainer, { backgroundColor: iconBackground }]}>
            <Icon name={icon} size={20} color={iconColor} />
          </View>
        ) : null}
      </View>

      {/* Middle: Title & Subtitle */}
      <View style={styles.middleContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* Right Side: Text, Badge, Arrow */}
      <View style={styles.rightContainer}>
        {rightText && (
          <Text style={styles.rightText} numberOfLines={1}>
            {rightText}
          </Text>
        )}
        {rightSubtext && (
          <Text style={styles.rightSubtext} numberOfLines={1}>
            {rightSubtext}
          </Text>
        )}
        {badge && (
          <View style={[styles.badge, { backgroundColor: badgeBackground }]}>
            <Text style={[styles.badgeText, { color: badgeColor }]}>
              {badge}
            </Text>
          </View>
        )}
        {showArrow && (
          <Icon name="chevron-right" size={20} color="#9CA3AF" style={styles.arrow} />
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  leftContainer: {
    marginRight: Spacing.md,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  rightText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  rightSubtext: {
    fontSize: 11,
    color: '#6B7280',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    minWidth: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  arrow: {
    marginLeft: Spacing.xs,
  },
});

export default ListItemCard;
