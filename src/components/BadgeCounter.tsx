import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, Spacing } from '../theme';

interface BadgeCounterProps {
  count: number;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
  style?: ViewStyle;
}

const BadgeCounter: React.FC<BadgeCounterProps> = ({
  count,
  size = 'medium',
  variant = 'primary',
  style,
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary': return Colors.primary;
      case 'success': return Colors.success;
      case 'warning': return Colors.warning;
      case 'error': return Colors.error;
      case 'neutral': return Colors.gray500;
      default: return Colors.primary;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small': return { minWidth: 18, height: 18, paddingHorizontal: 5 };
      case 'large': return { minWidth: 26, height: 26, paddingHorizontal: 8 };
      default: return { minWidth: 22, height: 22, paddingHorizontal: 6 };
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small': return 10;
      case 'large': return 13;
      default: return 11;
    }
  };

  // Don't show badge if count is 0
  if (count === 0) return null;

  // Show "99+" for counts over 99
  const displayCount = count > 99 ? '99+' : count.toString();

  return (
    <View 
      style={[
        styles.badge,
        getSizeStyle(),
        { backgroundColor: getBackgroundColor() },
        style
      ]}
    >
      <Text style={[styles.badgeText, { fontSize: getTextSize() }]}>
        {displayCount}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 99,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  badgeText: {
    color: Colors.white,
    fontWeight: '700',
    includeFontPadding: false,
    textAlign: 'center',
  },
});

export default BadgeCounter;
