import React, { useEffect } from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
} from 'react-native-reanimated';

interface AnimatedCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  index?: number;
  style?: ViewStyle;
  disabled?: boolean;
  enablePressAnimation?: boolean;
  enableEntryAnimation?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  onPress,
  index = 0,
  style,
  disabled = false,
  enablePressAnimation = true,
  enableEntryAnimation = true,
}) => {
  // Entry animation values
  const opacity = useSharedValue(enableEntryAnimation ? 0 : 1);
  const translateY = useSharedValue(enableEntryAnimation ? 20 : 0);
  
  // Press animation value
  const scale = useSharedValue(1);

  // Entry animation effect
  useEffect(() => {
    if (enableEntryAnimation) {
      // Use withDelay for staggered animation - cap delay at 500ms to prevent long waits
      const delay = Math.min(index * 50, 500);
      
      opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
      translateY.value = withDelay(delay, withTiming(0, { duration: 300 }));
    }
  }, [index, enableEntryAnimation, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const handlePressIn = () => {
    if (enablePressAnimation && !disabled) {
      scale.value = withSpring(0.98, {
        damping: 15,
        stiffness: 400,
      });
    }
  };

  const handlePressOut = () => {
    if (enablePressAnimation && !disabled) {
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 400,
      });
    }
  };

  const handlePress = () => {
    if (onPress && !disabled) {
      onPress();
    }
  };

  if (onPress) {
    return (
      <AnimatedTouchable
        style={[animatedStyle, style]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        activeOpacity={1}
        disabled={disabled}
        accessible={true}
        accessibilityRole="button"
      >
        {children}
      </AnimatedTouchable>
    );
  }

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
};

export default AnimatedCard;
