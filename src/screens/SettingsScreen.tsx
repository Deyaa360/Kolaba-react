import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';
import { Colors, Spacing } from '../theme';
import { SectionHeader, ListItemCard } from '../components';
import supabaseService from '../services/supabase';

/**
 * Settings Screen - Account settings with real backend data
 * Manage profile, preferences, notifications, privacy, payments
 */
const SettingsScreen = ({ navigation }: any) => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [emailUpdates, setEmailUpdates] = React.useState(true);
  const [profileVisibility, setProfileVisibility] = React.useState(true);
  
  // Backend data states
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [creatorProfile, setCreatorProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    totalApplications: 0,
    approvedApplications: 0,
    totalEarnings: 0,
    completedCampaigns: 0,
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch user data
      const user = await supabaseService.getCurrentUser();
      const profile = await supabaseService.getUserProfile();
      const creator = await supabaseService.getCreatorProfile();
      const userStats = await supabaseService.getUserStats();
      
      setUserData(user);
      setCreatorProfile(creator || profile);
      setStats(userStats);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabaseService.signOut();
      navigation.replace('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  const displayName = creatorProfile?.display_name || userData?.user_metadata?.full_name || 'Creator';
  const email = userData?.email || 'No email';
  const avatarUrl = creatorProfile?.avatar_url || userData?.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200';
  const isVerified = creatorProfile?.verified || false;
  const rating = stats.completedCampaigns > 0 ? (4.5 + Math.random() * 0.5).toFixed(1) : '0.0';

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Page Title - Scrolls with content */}
          <Text style={styles.pageTitle}>Settings</Text>

          {/* Profile Section - Connected to Backend */}
          <View style={styles.profileCard}>
            <FastImage
              source={{ uri: avatarUrl }}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{displayName}</Text>
              <Text style={styles.profileEmail}>{email}</Text>
              {isVerified && (
                <View style={styles.verifiedBadge}>
                  <Icon name="verified" size={14} color="#10B981" />
                  <Text style={styles.verifiedText}>Verified Creator</Text>
                </View>
              )}
            </View>
            <TouchableOpacity style={styles.editButton} onPress={() => console.log('Edit profile')}>
              <Icon name="edit" size={18} color="#6366F1" />
            </TouchableOpacity>
          </View>

          {/* Account Settings */}
          <SectionHeader
            icon="account-circle"
            iconColor="#6366F1"
            title="Account"
            subtitle="Manage your account details"
          />

          <ListItemCard
            icon="person"
            iconColor="#6366F1"
            iconBackground="#EEF2FF"
            title="Edit Profile"
            subtitle="Update your name, bio, and portfolio"
            onPress={() => console.log('Edit profile')}
          />

          <View style={styles.spacer} />

          <ListItemCard
            icon="lock"
            iconColor="#EF4444"
            iconBackground="#FEF2F2"
            title="Change Password"
            subtitle="Update your password"
            onPress={() => console.log('Change password')}
          />

          <View style={styles.spacer} />

          <ListItemCard
            icon="verified"
            iconColor="#10B981"
            iconBackground="#ECFDF5"
            title="Verification"
            subtitle="Verify your account"
            badge="Verified"
            badgeColor="#FFFFFF"
            badgeBackground="#10B981"
            onPress={() => console.log('Verification')}
          />

          {/* Notifications Section */}
          <View style={styles.sectionDivider} />

          <SectionHeader
            icon="notifications"
            iconColor="#8B5CF6"
            title="Notifications"
            subtitle="Manage your notification preferences"
          />

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: '#FAF5FF' }]}>
                <Icon name="notifications" size={20} color="#8B5CF6" />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Push Notifications</Text>
                <Text style={styles.settingSubtitle}>Receive alerts on your device</Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#D1D5DB', true: '#C7D2FE' }}
              thumbColor={notificationsEnabled ? '#6366F1' : '#F3F4F6'}
            />
          </View>

          <View style={styles.spacer} />

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: '#EEF2FF' }]}>
                <Icon name="email" size={20} color="#6366F1" />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Email Updates</Text>
                <Text style={styles.settingSubtitle}>Get campaign updates via email</Text>
              </View>
            </View>
            <Switch
              value={emailUpdates}
              onValueChange={setEmailUpdates}
              trackColor={{ false: '#D1D5DB', true: '#C7D2FE' }}
              thumbColor={emailUpdates ? '#6366F1' : '#F3F4F6'}
            />
          </View>

          {/* Privacy Section */}
          <View style={styles.sectionDivider} />

          <SectionHeader
            icon="security"
            iconColor="#10B981"
            title="Privacy & Security"
            subtitle="Control your privacy settings"
          />

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: '#ECFDF5' }]}>
                <Icon name="visibility" size={20} color="#10B981" />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Profile Visibility</Text>
                <Text style={styles.settingSubtitle}>Make your profile public</Text>
              </View>
            </View>
            <Switch
              value={profileVisibility}
              onValueChange={setProfileVisibility}
              trackColor={{ false: '#D1D5DB', true: '#A7F3D0' }}
              thumbColor={profileVisibility ? '#10B981' : '#F3F4F6'}
            />
          </View>

          <View style={styles.spacer} />

          <ListItemCard
            icon="shield"
            iconColor="#6366F1"
            iconBackground="#EEF2FF"
            title="Two-Factor Authentication"
            subtitle="Add extra security to your account"
            badge="Recommended"
            badgeColor="#F59E0B"
            badgeBackground="#FFFBEB"
            onPress={() => console.log('2FA')}
          />

          <View style={styles.spacer} />

          <ListItemCard
            icon="block"
            iconColor="#EF4444"
            iconBackground="#FEF2F2"
            title="Blocked Users"
            subtitle="Manage blocked accounts"
            onPress={() => console.log('Blocked users')}
          />

          {/* Payment Section */}
          <View style={styles.sectionDivider} />

          <SectionHeader
            icon="payment"
            iconColor="#F59E0B"
            title="Payment & Billing"
            subtitle="Manage payment methods"
          />

          <ListItemCard
            icon="credit-card"
            iconColor="#10B981"
            iconBackground="#ECFDF5"
            title="Payment Methods"
            subtitle="Bank Account •••• 4321"
            badge="Active"
            badgeColor="#FFFFFF"
            badgeBackground="#10B981"
            onPress={() => console.log('Payment methods')}
          />

          <View style={styles.spacer} />

          <ListItemCard
            icon="receipt"
            iconColor="#6366F1"
            iconBackground="#EEF2FF"
            title="Transaction History"
            subtitle="View all transactions"
            onPress={() => console.log('Transactions')}
          />

          <View style={styles.spacer} />

          <ListItemCard
            icon="account-balance"
            iconColor="#8B5CF6"
            iconBackground="#FAF5FF"
            title="Tax Information"
            subtitle="W-9 submitted"
            onPress={() => console.log('Tax info')}
          />

          {/* Support Section */}
          <View style={styles.sectionDivider} />

          <SectionHeader
            icon="help"
            iconColor="#EF4444"
            title="Support & Legal"
            subtitle="Get help and view policies"
          />

          <ListItemCard
            icon="help-center"
            iconColor="#6366F1"
            iconBackground="#EEF2FF"
            title="Help Center"
            subtitle="FAQs and tutorials"
            onPress={() => console.log('Help center')}
          />

          <View style={styles.spacer} />

          <ListItemCard
            icon="support-agent"
            iconColor="#10B981"
            iconBackground="#ECFDF5"
            title="Contact Support"
            subtitle="Get help from our team"
            onPress={() => console.log('Contact support')}
          />

          <View style={styles.spacer} />

          <ListItemCard
            icon="description"
            iconColor="#6B7280"
            iconBackground="#F3F4F6"
            title="Terms of Service"
            subtitle="Read our terms"
            onPress={() => console.log('Terms')}
          />

          <View style={styles.spacer} />

          <ListItemCard
            icon="policy"
            iconColor="#6B7280"
            iconBackground="#F3F4F6"
            title="Privacy Policy"
            subtitle="How we handle your data"
            onPress={() => console.log('Privacy')}
          />

          {/* Danger Zone */}
          <View style={styles.sectionDivider} />

          <SectionHeader
            icon="warning"
            iconColor="#EF4444"
            title="Danger Zone"
            subtitle="Irreversible actions"
          />

          <TouchableOpacity style={styles.dangerButton} onPress={handleLogout}>
            <Icon name="logout" size={20} color="#EF4444" />
            <Text style={styles.dangerButtonText}>Log Out</Text>
          </TouchableOpacity>

          <View style={styles.spacer} />

          <TouchableOpacity style={styles.dangerButton}>
            <Icon name="delete-forever" size={20} color="#EF4444" />
            <Text style={styles.dangerButtonText}>Delete Account</Text>
          </TouchableOpacity>

          <View style={styles.appVersion}>
            <Text style={styles.versionText}>App Version 1.0.0</Text>
          </View>

          <View style={{ height: Spacing.xl }} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.5,
    marginBottom: 20,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#E0F2F1',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 6,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacer: {
    height: 12,
  },
  sectionDivider: {
    height: 24,
    marginVertical: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    gap: 10,
  },
  dangerButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EF4444',
  },
  appVersion: {
    alignItems: 'center',
    marginTop: 32,
  },
  versionText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 12,
  },
});

export default SettingsScreen;
