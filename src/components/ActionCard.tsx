import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';

interface ActionCardProps {
  icon: string;
  title: string;
  description: string;
  actionLabel: string;
  onPress: () => void;
  gradientColors?: string[];
  iconColor?: string;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const ActionCard: React.FC<ActionCardProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onPress,
  gradientColors = [Colors.primary, Colors.turquoise500],
  iconColor = Colors.white,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, {
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

  return (
    <AnimatedTouchable
      style={[styles.container, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      activeOpacity={1}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${description}`}
      accessibilityHint={`Double tap to ${actionLabel.toLowerCase()}`}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Icon name={icon} size={32} color={iconColor} />
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>

          <View style={styles.actionContainer}>
            <Text style={styles.actionLabel}>{actionLabel}</Text>
            <Icon name="arrow-forward" size={18} color={Colors.white} />
          </View>
        </View>
      </LinearGradient>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  gradient: {
    padding: Spacing.lg,
  },
  content: {
    gap: Spacing.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    gap: Spacing.xs,
  },
  title: {
    ...Typography.title3,
    color: Colors.white,
    fontWeight: '700',
  },
  description: {
    ...Typography.subheadline,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  actionLabel: {
    ...Typography.subheadline,
    color: Colors.white,
    fontWeight: '600',
  },
});

export default ActionCard;
