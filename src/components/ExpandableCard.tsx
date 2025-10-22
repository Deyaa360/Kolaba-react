import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';

interface ExpandableCardProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  containerStyle?: any;
}

const ExpandableCard: React.FC<ExpandableCardProps> = ({
  title,
  icon,
  children,
  defaultExpanded = false,
  containerStyle,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={styles.titleContainer}>
          {icon && (
            <Icon name={icon} size={24} color={Colors.primary} style={styles.icon} />
          )}
          <Text style={styles.title}>{title}</Text>
        </View>
        <Icon
          name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={24}
          color={Colors.textSecondary}
        />
      </TouchableOpacity>
      {expanded && <View style={styles.content}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});

export default ExpandableCard;
