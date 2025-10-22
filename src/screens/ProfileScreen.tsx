import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../theme';
import supabaseService from '../services/supabase';

interface UserProfile {
  id: string;
  full_name: string | null;
  email: string;
  user_type: string;
}

interface CreatorProfile {
  bio: string | null;
  social_media_links: any;
  portfolio_url: string | null;
}

const ProfileScreen = () => {
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null);
  const [stats, setStats] = useState({ applications: 0, completed: 0, earnings: 0 });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      
      const user = await supabaseService.getCurrentUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const profile = await supabaseService.getUserProfile();
      if (profile) {
        setUserProfile({
          id: user.id,
          full_name: profile.full_name || null,
          email: user.email || '',
          user_type: profile.user_type || 'creator',
        });
      }

      const creator = await supabaseService.getCreatorProfile();
      if (creator) {
        setCreatorProfile(creator);
      }

      const userStats = await supabaseService.getUserStats();
      if (userStats) {
        setStats({
          applications: userStats.totalApplications || 0,
          completed: userStats.completedCampaigns || 0,
          earnings: userStats.totalEarnings || 0,
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      // Set defaults on error
      setStats({ applications: 0, completed: 0, earnings: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await supabaseService.signOut();
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userProfile?.full_name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
        </View>
        <Text style={styles.name}>{userProfile?.full_name || 'User'}</Text>
        <Text style={styles.email}>{userProfile?.email}</Text>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{userProfile?.user_type || 'creator'}</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.applications}</Text>
          <Text style={styles.statLabel}>Applications</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>${stats.earnings}</Text>
          <Text style={styles.statLabel}>Earned</Text>
        </View>
      </View>

      {/* Bio Section */}
      {creatorProfile?.bio && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bioText}>{creatorProfile.bio}</Text>
        </View>
      )}

      {/* Menu Items */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>✏️</Text>
          <Text style={styles.menuText}>Edit Profile</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>📊</Text>
          <Text style={styles.menuText}>My Applications</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>⚙️</Text>
          <Text style={styles.menuText}>Settings</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>ℹ️</Text>
          <Text style={styles.menuText}>Help & Support</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, styles.menuItemDanger]} onPress={handleLogout}>
          <Text style={styles.menuIcon}>🚪</Text>
          <Text style={[styles.menuText, styles.menuTextDanger]}>Logout</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingBottom: Spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.white,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
    ...Shadow.md,
  },
  avatarContainer: {
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
  },
  name: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  email: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  typeBadge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryLight,
  },
  typeText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary,
    textTransform: 'capitalize',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    margin: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadow.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
  },
  statValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  section: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  bioText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeight.relaxed,
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
  },
  menuItemDanger: {
    borderColor: Colors.error,
    borderWidth: 1,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: Spacing.md,
  },
  menuText: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
  },
  menuTextDanger: {
    color: Colors.error,
  },
  menuArrow: {
    fontSize: 24,
    color: Colors.textSecondary,
  },
});

export default ProfileScreen;
