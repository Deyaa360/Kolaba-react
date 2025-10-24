import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';

interface AnimatedButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  style,
  textStyle,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, {
      damping: 15,
      stiffness: 400,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 400,
    });
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      onPress();
    }
  };

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.button,
      ...styles[`button_${size}`],
      ...(fullWidth && styles.buttonFullWidth),
    };

    if (disabled) {
      return { ...baseStyle, ...styles[`button_${variant}_disabled`] };
    }

    return { ...baseStyle, ...styles[`button_${variant}`] };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...styles.buttonText,
      ...styles[`buttonText_${size}`],
    };

    if (disabled) {
      return { ...baseStyle, ...styles[`buttonText_${variant}_disabled`] };
    }

    return { ...baseStyle, ...styles[`buttonText_${variant}`] };
  };

  return (
    <AnimatedTouchable
      style={[animatedStyle, getButtonStyle(), style]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      activeOpacity={1}
      disabled={disabled || loading}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === 'primary' || variant === 'secondary'
              ? Colors.white
              : Colors.primary
          }
        />
      ) : (
        <>
          {icon}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    gap: Spacing.xs,
  },
  
  // Sizes
  button_small: {
    height: 36,
    paddingHorizontal: Spacing.md,
    minWidth: 80,
  },
  button_medium: {
    height: 44,
    paddingHorizontal: Spacing.lg,
    minWidth: 120,
  },
  button_large: {
    height: 50,
    paddingHorizontal: Spacing.xl,
    minWidth: 160,
  },
  
  buttonFullWidth: {
    width: '100%',
  },
  
  // Primary variant
  button_primary: {
    backgroundColor: Colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  button_primary_disabled: {
    backgroundColor: '#D1D5DB', // Light gray
    opacity: 0.6,
  },
  
  // Secondary variant
  button_secondary: {
    backgroundColor: Colors.secondary,
  },
  button_secondary_disabled: {
    backgroundColor: Colors.buttonDisabled,
  },
  
  // Outline variant
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  button_outline_disabled: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    opacity: 0.7,
  },
  
  // Ghost variant
  button_ghost: {
    backgroundColor: 'transparent',
  },
  button_ghost_disabled: {
    backgroundColor: 'transparent',
  },
  
  // Text styles
  buttonText: {
    fontWeight: Typography.fontWeight.semibold,
    letterSpacing: -0.2,
  },
  
  buttonText_small: {
    ...Typography.footnote,
    fontWeight: Typography.fontWeight.semibold,
  },
  buttonText_medium: {
    ...Typography.callout,
    fontWeight: Typography.fontWeight.semibold,
  },
  buttonText_large: {
    ...Typography.headline,
    fontWeight: Typography.fontWeight.semibold,
  },
  
  // Primary text
  buttonText_primary: {
    color: Colors.white,
  },
  buttonText_primary_disabled: {
    color: '#9CA3AF', // Medium gray - more visible
  },
  
  // Secondary text
  buttonText_secondary: {
    color: Colors.black,
  },
  buttonText_secondary_disabled: {
    color: Colors.textDisabled,
  },
  
  // Outline text
  buttonText_outline: {
    color: Colors.primary,
  },
  buttonText_outline_disabled: {
    color: Colors.textDisabled,
  },
  
  // Ghost text
  buttonText_ghost: {
    color: Colors.primary,
  },
  buttonText_ghost_disabled: {
    color: Colors.textDisabled,
  },
});

export default AnimatedButton;
