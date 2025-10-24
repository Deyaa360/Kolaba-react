import React, { useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Animated,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors, BorderRadius, Spacing } from '../theme';

interface AnimatedInputProps extends TextInputProps {
  icon?: string;
  error?: boolean;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const AnimatedInput: React.FC<AnimatedInputProps> = ({
  icon,
  error,
  rightIcon,
  containerStyle,
  onFocus,
  onBlur,
  ...props
}) => {
  const borderAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleFocus = (e: any) => {
    Animated.parallel([
      Animated.spring(borderAnim, {
        toValue: 1,
        useNativeDriver: false,
        tension: 60,
        friction: 7,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1.01,
        useNativeDriver: true,
        tension: 60,
        friction: 7,
      }),
    ]).start();
    
    onFocus && onFocus(e);
  };

  const handleBlur = (e: any) => {
    Animated.parallel([
      Animated.spring(borderAnim, {
        toValue: 0,
        useNativeDriver: false,
        tension: 60,
        friction: 7,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 60,
        friction: 7,
      }),
    ]).start();
    
    onBlur && onBlur(e);
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: error ? ['#FCA5A5', '#EF4444'] : ['#E5E7EB', Colors.primary],
  });

  const backgroundColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: error ? ['#FEF2F2', '#FEF2F2'] : ['#FFFFFF', '#FAFAFA'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          borderColor,
          backgroundColor,
          transform: [{ scale: scaleAnim }],
        },
        containerStyle,
      ]}
    >
      {icon && (
        <Icon
          name={icon}
          size={20}
          color={error ? '#EF4444' : Colors.textSecondary}
          style={styles.leftIcon}
        />
      )}
      <TextInput
        {...props}
        style={[styles.input, props.style]}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholderTextColor={Colors.textTertiary}
      />
      {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    paddingHorizontal: Spacing.md,
    minHeight: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  leftIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    paddingVertical: Spacing.sm,
  },
  rightIcon: {
    marginLeft: Spacing.xs,
  },
});
