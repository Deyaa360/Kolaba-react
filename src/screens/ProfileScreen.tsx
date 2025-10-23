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
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
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
              {userProfile?.full_name?.charAt(0).toUpperCase() || userProfile?.email?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
        </View>
        <Text style={styles.name}>{userProfile?.full_name || 'Creator'}</Text>
        <Text style={styles.email}>{userProfile?.email}</Text>
      </View>

      {/* Quick Stats Cards */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={styles.statIconBg}>
            <Icon name="send" size={22} color="#6366F1" />
          </View>
          <Text style={styles.statValue}>{stats.applications}</Text>
          <Text style={styles.statLabel}>Applications</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIconBg, { backgroundColor: '#ECFDF5' }]}>
            <Icon name="check-circle" size={22} color="#10B981" />
          </View>
          <Text style={styles.statValue}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      {/* Earnings Banner */}
      {stats.earnings > 0 && (
        <View style={styles.earningsCard}>
          <View style={styles.earningsContent}>
            <View style={styles.earningsIconWrapper}>
              <Icon name="payments" size={28} color="#059669" />
            </View>
            <View style={styles.earningsInfo}>
              <Text style={styles.earningsLabel}>Total Earnings</Text>
              <Text style={styles.earningsValue}>${stats.earnings.toFixed(2)}</Text>
            </View>
          </View>
          <Icon name="arrow-forward" size={24} color="#6B7280" />
        </View>
      )}

      {/* Bio Section */}
      {creatorProfile?.bio && (
        <View style={styles.bioSection}>
          <Text style={styles.bioTitle}>About Me</Text>
          <Text style={styles.bioText}>{creatorProfile.bio}</Text>
        </View>
      )}

      {/* Menu Items */}
      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <View style={styles.menuIconContainer}>
            <Icon name="edit" size={20} color="#6366F1" />
          </View>
          <Text style={styles.menuText}>Edit Profile</Text>
          <Icon name="chevron-right" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <View style={styles.menuIconContainer}>
            <Icon name="assignment" size={20} color="#6366F1" />
          </View>
          <Text style={styles.menuText}>My Applications</Text>
          <Icon name="chevron-right" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <View style={styles.menuIconContainer}>
            <Icon name="settings" size={20} color="#6366F1" />
          </View>
          <Text style={styles.menuText}>Settings</Text>
          <Icon name="chevron-right" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <View style={styles.menuIconContainer}>
            <Icon name="help-outline" size={20} color="#6366F1" />
          </View>
          <Text style={styles.menuText}>Help & Support</Text>
          <Icon name="chevron-right" size={24} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
        <Icon name="logout" size={20} color="#EF4444" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,  // Light gray
  },
  contentContainer: {
    paddingBottom: Spacing.xl * 2,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,  // Light gray
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    padding: Spacing.xl,
    paddingTop: 40,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatarContainer: {
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primary,  // Turquoise
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '800',
    color: Colors.white,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  email: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: Spacing.lg,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  earningsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    padding: Spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  earningsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  earningsIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  earningsInfo: {
    flex: 1,
  },
  earningsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  earningsValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: -0.8,
  },
  bioSection: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
  },
  bioTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: Spacing.md,
  },
  bioText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    backgroundColor: '#FFFFFF',
    padding: Spacing.lg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  menuSection: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: Spacing.lg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    gap: Spacing.sm,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#EF4444',
  },
});

export default ProfileScreen;
