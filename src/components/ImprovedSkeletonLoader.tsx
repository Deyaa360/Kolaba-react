import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle, DimensionValue, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
  withSequence,
} from 'react-native-reanimated';
import { Colors, Spacing, BorderRadius } from '../theme';
import LinearGradient from 'react-native-linear-gradient';

interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
  variant?: 'default' | 'wave' | 'pulse';
}

// Base Skeleton with improved animation
export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = BorderRadius.sm,
  style,
  variant = 'wave',
}) => {
  const shimmer = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (variant === 'wave') {
      shimmer.value = withRepeat(
        withTiming(1, { duration: 1800, easing: Easing.bezier(0.4, 0, 0.6, 1) }),
        -1,
        false
      );
    } else if (variant === 'pulse') {
      pulse.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }
  }, [variant]);

  const waveStyle = useAnimatedStyle(() => {
    if (variant !== 'wave') return {};
    
    const translateX = interpolate(
      shimmer.value,
      [0, 1],
      [-200, 200]
    );

    return {
      transform: [{ translateX }],
    };
  });

  const pulseStyle = useAnimatedStyle(() => {
    if (variant !== 'pulse') return {};
    
    return {
      opacity: pulse.value,
    };
  });

  return (
    <View style={[styles.container, style, { width, height, borderRadius }]}>
      <View style={styles.base} />
      {variant === 'wave' && (
        <Animated.View style={[styles.wave, waveStyle]}>
          <LinearGradient
            colors={['transparent', 'rgba(255, 255, 255, 0.3)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      )}
      {variant === 'pulse' && (
        <Animated.View style={[styles.pulse, pulseStyle]} />
      )}
    </View>
  );
};

// Campaign Card Skeleton - Much more detailed
export const SkeletonCampaignCard: React.FC = () => {
  return (
    <View style={styles.campaignCard}>
      {/* Brand Header */}
      <View style={styles.campaignHeader}>
        <Skeleton width={56} height={56} borderRadius={BorderRadius.lg} />
        <View style={{ flex: 1, marginLeft: Spacing.md }}>
          <Skeleton width="70%" height={18} style={{ marginBottom: 8 }} />
          <Skeleton width="50%" height={14} />
        </View>
        <Skeleton width={32} height={32} borderRadius={BorderRadius.full} />
      </View>

      {/* Title */}
      <View style={{ marginBottom: Spacing.md }}>
        <Skeleton width="100%" height={20} style={{ marginBottom: 6 }} />
        <Skeleton width="85%" height={20} />
      </View>

      {/* Description */}
      <View style={{ marginBottom: Spacing.lg }}>
        <Skeleton width="100%" height={14} style={{ marginBottom: 4 }} />
        <Skeleton width="100%" height={14} style={{ marginBottom: 4 }} />
        <Skeleton width="60%" height={14} />
      </View>

      {/* Tags */}
      <View style={styles.tagsRow}>
        <Skeleton width={80} height={28} borderRadius={BorderRadius.full} />
        <Skeleton width={90} height={28} borderRadius={BorderRadius.full} />
        <Skeleton width={70} height={28} borderRadius={BorderRadius.full} />
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Skeleton width={20} height={20} borderRadius={BorderRadius.xs} />
          <Skeleton width={60} height={12} style={{ marginLeft: 6 }} />
        </View>
        <View style={styles.statItem}>
          <Skeleton width={20} height={20} borderRadius={BorderRadius.xs} />
          <Skeleton width={70} height={12} style={{ marginLeft: 6 }} />
        </View>
      </View>

      {/* Budget */}
      <View style={styles.budgetContainer}>
        <Skeleton width="30%" height={16} />
        <Skeleton width={100} height={36} borderRadius={BorderRadius.lg} />
      </View>
    </View>
  );
};

// Dashboard Stat Card Skeleton
export const SkeletonStatCard: React.FC = () => {
  return (
    <View style={styles.statCard}>
      <View style={styles.statCardHeader}>
        <Skeleton width={40} height={40} borderRadius={BorderRadius.lg} />
        <Skeleton width={24} height={24} borderRadius={BorderRadius.full} style={{ marginLeft: 'auto' }} />
      </View>
      <Skeleton width="90%" height={32} style={{ marginBottom: 8 }} />
      <Skeleton width="60%" height={14} />
      <View style={{ marginTop: Spacing.md }}>
        <Skeleton width="100%" height={6} borderRadius={BorderRadius.full} />
      </View>
    </View>
  );
};

// Profile Card Skeleton
export const SkeletonProfileCard: React.FC = () => {
  return (
    <View style={styles.profileCard}>
      <View style={styles.profileHeader}>
        <Skeleton width={80} height={80} borderRadius={BorderRadius.full} />
        <View style={{ flex: 1, marginLeft: Spacing.lg }}>
          <Skeleton width="70%" height={24} style={{ marginBottom: 8 }} />
          <Skeleton width="50%" height={16} style={{ marginBottom: 12 }} />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Skeleton width={100} height={32} borderRadius={BorderRadius.lg} />
            <Skeleton width={100} height={32} borderRadius={BorderRadius.lg} />
          </View>
        </View>
      </View>
      
      {/* Bio */}
      <View style={{ marginTop: Spacing.lg }}>
        <Skeleton width="100%" height={14} style={{ marginBottom: 4 }} />
        <Skeleton width="100%" height={14} style={{ marginBottom: 4 }} />
        <Skeleton width="75%" height={14} />
      </View>

      {/* Stats Grid */}
      <View style={styles.profileStats}>
        <View style={styles.profileStatItem}>
          <Skeleton width={50} height={28} style={{ marginBottom: 4 }} />
          <Skeleton width="100%" height={12} />
        </View>
        <View style={styles.profileStatItem}>
          <Skeleton width={50} height={28} style={{ marginBottom: 4 }} />
          <Skeleton width="100%" height={12} />
        </View>
        <View style={styles.profileStatItem}>
          <Skeleton width={50} height={28} style={{ marginBottom: 4 }} />
          <Skeleton width="100%" height={12} />
        </View>
      </View>
    </View>
  );
};

// List Item Skeleton
export const SkeletonListItem: React.FC = () => {
  return (
    <View style={styles.listItem}>
      <Skeleton width={48} height={48} borderRadius={BorderRadius.md} />
      <View style={{ flex: 1, marginLeft: Spacing.md }}>
        <Skeleton width="80%" height={16} style={{ marginBottom: 6 }} />
        <Skeleton width="60%" height={14} />
      </View>
      <Skeleton width={24} height={24} borderRadius={BorderRadius.xs} />
    </View>
  );
};

// Content Grid Skeleton
export const SkeletonContentGrid: React.FC<{ columns?: number }> = ({ columns = 3 }) => {
  return (
    <View style={styles.contentGrid}>
      {Array.from({ length: columns * 2 }).map((_, index) => (
        <View key={index} style={[styles.contentGridItem, { width: `${100 / columns - 2}%` }]}>
          <Skeleton width="100%" height={120} borderRadius={BorderRadius.md} />
          <Skeleton width="90%" height={12} style={{ marginTop: 8 }} />
          <Skeleton width="70%" height={10} style={{ marginTop: 4 }} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F1F3F5',
    overflow: 'hidden',
  },
  base: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F1F3F5',
  },
  wave: {
    ...StyleSheet.absoluteFillObject,
    width: 200,
  },
  pulse: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  campaignCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  campaignHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.lg,
    flexWrap: 'wrap',
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.blueGray100,
  },
  statCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    minWidth: 160,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  profileCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileStats: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xl,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.blueGray100,
  },
  profileStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  contentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  contentGridItem: {
    marginBottom: Spacing.md,
  },
});

// Campaign Details Page Skeleton
export const SkeletonCampaignDetails: React.FC = () => {
  const cardStyle = {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  };

  return (
    <View style={{ paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md }}>
      {/* Hero Section */}
      <View style={{ marginBottom: Spacing.xl }}>
        {/* Title */}
        <Skeleton width="100%" height={28} variant="wave" borderRadius={BorderRadius.sm} style={{ marginBottom: Spacing.md }} />
        <Skeleton width="80%" height={28} variant="wave" borderRadius={BorderRadius.sm} style={{ marginBottom: Spacing.lg }} />
        
        {/* Brand Row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.lg }}>
          <Skeleton width={40} height={40} variant="wave" borderRadius={BorderRadius.full} />
          <View style={{ marginLeft: Spacing.md, flex: 1 }}>
            <Skeleton width="40%" height={16} variant="wave" borderRadius={BorderRadius.sm} style={{ marginBottom: Spacing.xs }} />
            <Skeleton width="60%" height={14} variant="wave" borderRadius={BorderRadius.sm} />
          </View>
        </View>

        {/* Badges */}
        <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
          <Skeleton width={100} height={28} variant="wave" borderRadius={BorderRadius.full} />
          <Skeleton width={120} height={28} variant="wave" borderRadius={BorderRadius.full} />
          <Skeleton width={90} height={28} variant="wave" borderRadius={BorderRadius.full} />
        </View>
      </View>

      {/* Description Card */}
      <View style={cardStyle}>
        <Skeleton width={80} height={20} variant="wave" borderRadius={BorderRadius.sm} style={{ marginBottom: Spacing.md }} />
        <Skeleton width="100%" height={16} variant="wave" borderRadius={BorderRadius.sm} style={{ marginBottom: Spacing.sm }} />
        <Skeleton width="100%" height={16} variant="wave" borderRadius={BorderRadius.sm} style={{ marginBottom: Spacing.sm }} />
        <Skeleton width="100%" height={16} variant="wave" borderRadius={BorderRadius.sm} style={{ marginBottom: Spacing.sm }} />
        <Skeleton width="70%" height={16} variant="wave" borderRadius={BorderRadius.sm} />
      </View>

      {/* Budget Card */}
      <View style={[cardStyle, { marginTop: Spacing.md }]}>
        <Skeleton width={60} height={20} variant="wave" borderRadius={BorderRadius.sm} style={{ marginBottom: Spacing.md }} />
        <Skeleton width={120} height={32} variant="wave" borderRadius={BorderRadius.sm} />
      </View>

      {/* Content Packages */}
      <View style={[cardStyle, { marginTop: Spacing.md }]}>
        <Skeleton width={140} height={20} variant="wave" borderRadius={BorderRadius.sm} style={{ marginBottom: Spacing.md }} />
        
        {/* Package 1 */}
        <View style={{ marginBottom: Spacing.lg }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm }}>
            <Skeleton width={32} height={32} variant="wave" borderRadius={BorderRadius.md} />
            <Skeleton width={120} height={18} variant="wave" borderRadius={BorderRadius.sm} style={{ marginLeft: Spacing.sm }} />
          </View>
          <Skeleton width="100%" height={16} variant="wave" borderRadius={BorderRadius.sm} style={{ marginBottom: Spacing.xs }} />
          <Skeleton width="85%" height={16} variant="wave" borderRadius={BorderRadius.sm} />
        </View>

        {/* Package 2 */}
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm }}>
            <Skeleton width={32} height={32} variant="wave" borderRadius={BorderRadius.md} />
            <Skeleton width={140} height={18} variant="wave" borderRadius={BorderRadius.sm} style={{ marginLeft: Spacing.sm }} />
          </View>
          <Skeleton width="100%" height={16} variant="wave" borderRadius={BorderRadius.sm} style={{ marginBottom: Spacing.xs }} />
          <Skeleton width="90%" height={16} variant="wave" borderRadius={BorderRadius.sm} />
        </View>
      </View>

      {/* Apply Button */}
      <View style={{ marginTop: Spacing.xl }}>
        <Skeleton width="100%" height={56} variant="pulse" borderRadius={BorderRadius.xl} />
      </View>
    </View>
  );
};

export default Skeleton;
