import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors, Typography, Spacing } from '../theme';

interface InfoCardProps {
  icon: string;
  iconColor?: string;
  iconBackground?: string;
  title: string;
  description: string;
  onPress?: () => void;
  showArrow?: boolean;
}

/**
 * Reusable Info Card Component
 * Perfect for tips, notifications, announcements, feature highlights
 */
const InfoCard: React.FC<InfoCardProps> = ({
  icon,
  iconColor = '#F59E0B',
  iconBackground = '#FEF3C7',
  title,
  description,
  onPress,
  showArrow = false,
}) => {
  const content = (
    <>
      <View style={[styles.iconContainer, { backgroundColor: iconBackground }]}>
        <Icon name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      {showArrow && (
        <Icon name="chevron-right" size={20} color="#9CA3AF" />
      )}
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
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
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
  description: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
});

export default InfoCard;
