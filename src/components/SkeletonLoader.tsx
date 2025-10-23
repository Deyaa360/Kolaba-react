import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Colors, Spacing, BorderRadius } from '../theme';

interface SkeletonLoaderProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = BorderRadius.md,
  style,
}) => {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      shimmer.value,
      [0, 0.5, 1],
      [0.3, 0.5, 0.3]
    );

    return {
      opacity,
    };
  });

  return (
    <View style={[styles.container, style, { width, height, borderRadius }]}>
      <Animated.View style={[styles.shimmer, animatedStyle]} />
    </View>
  );
};

export const SkeletonCampaignCard: React.FC = () => {
  return (
    <View style={styles.card}>
      {/* Header with brand logo */}
      <View style={styles.cardHeader}>
        <SkeletonLoader width={48} height={48} borderRadius={BorderRadius.md} />
        <View style={styles.brandInfo}>
          <SkeletonLoader width="60%" height={16} style={{ marginBottom: 6 }} />
          <SkeletonLoader width="40%" height={13} />
        </View>
      </View>

      {/* Card body */}
      <View style={styles.cardBody}>
        {/* Title */}
        <SkeletonLoader width="90%" height={20} style={{ marginBottom: 8 }} />
        <SkeletonLoader width="75%" height={20} style={{ marginBottom: 12 }} />

        {/* Description */}
        <SkeletonLoader width="100%" height={14} style={{ marginBottom: 4 }} />
        <SkeletonLoader width="95%" height={14} style={{ marginBottom: 4 }} />
        <SkeletonLoader width="80%" height={14} style={{ marginBottom: 12 }} />

        {/* Tags */}
        <View style={styles.tagsRow}>
          <SkeletonLoader width={100} height={24} borderRadius={BorderRadius.full} />
          <SkeletonLoader width={120} height={24} borderRadius={BorderRadius.full} />
        </View>

        {/* Packages */}
        <View style={styles.packagesRow}>
          <SkeletonLoader width={16} height={16} borderRadius={4} style={{ marginRight: 8 }} />
          <SkeletonLoader width="60%" height={14} />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.cardFooter}>
        <SkeletonLoader width={90} height={16} />
      </View>
    </View>
  );
};

export const SkeletonStatCard: React.FC = () => {
  return (
    <View style={styles.statCard}>
      <SkeletonLoader width={32} height={32} borderRadius={BorderRadius.lg} style={{ marginBottom: 12 }} />
      <SkeletonLoader width="70%" height={24} style={{ marginBottom: 6 }} />
      <SkeletonLoader width="50%" height={13} />
    </View>
  );
};

export const SkeletonListItem: React.FC = () => {
  return (
    <View style={styles.listItem}>
      <SkeletonLoader width={40} height={40} borderRadius={BorderRadius.md} />
      <View style={styles.listItemContent}>
        <SkeletonLoader width="70%" height={16} style={{ marginBottom: 6 }} />
        <SkeletonLoader width="50%" height={13} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.gray100,
    overflow: 'hidden',
  },
  shimmer: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.gray200,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  brandInfo: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  cardBody: {
    padding: Spacing.md,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  packagesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardFooter: {
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    alignItems: 'center',
  },
  statCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  listItemContent: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
});

export default SkeletonLoader;
