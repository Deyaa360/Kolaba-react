import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';
import supabaseService from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import analytics from '../services/analytics';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import { 
  AnimatedCard, 
  AnimatedButton, 
  SkeletonStatCard as SkeletonStatCardNew, 
  SkeletonListItem as SkeletonListItemNew, 
  EmptyState, 
  ActionCard,
  InfoCard,
  StatCard,
  QuickActionButton,
  FeatureCard
} from '../components';

interface Campaign {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: string;
  created_at: string;
  campaign_content_packages?: any[];
  brands?: {
    id: string;
    brand_name: string;
    logo_url: string;
  };
}

interface Application {
  id: string;
  status: string;
  created_at: string;
  campaigns?: Campaign;
}

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, stats: userStats, refreshStats } = useAuth();
  const toast = useToast();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [recentCampaigns, setRecentCampaigns] = useState<Campaign[]>([]);
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);

  // Helper function for dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getFirstName = () => {
    const displayName = user?.user_metadata?.display_name || 
                        user?.user_metadata?.full_name || 
                        user?.email?.split('@')[0] || 
                        'Creator';
    return displayName.split(' ')[0];
  };

  useEffect(() => {
    analytics.logScreenView('Dashboard');
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Refresh stats from context
      await refreshStats();

      // Load recent campaigns (top 3)
      const campaigns = await supabaseService.getCampaigns(3, 'active');
      setRecentCampaigns(campaigns || []);

      // Load recent applications (top 3)
      const applications = await supabaseService.getCreatorApplications();
      setRecentApplications((applications || []).slice(0, 3));

    } catch (error) {
      console.error('Error loading dashboard:', error);
      analytics.logError(String(error), 'Dashboard');
      toast.showError('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const renderCampaignCard = (campaign: Campaign) => {
    const brand = campaign.brands;
    
    return (
      <TouchableOpacity
        key={campaign.id}
        style={styles.campaignCard}
        activeOpacity={0.95}
        onPress={() => {
          (navigation as any).navigate('CampaignDetails', { campaignId: campaign.id });
        }}
      >
        <View style={styles.campaignCardContent}>
          <View style={styles.campaignCardHeader}>
            <View style={styles.brandLogoWrapper}>
              {brand?.logo_url ? (
                <Image
                  source={{ uri: brand.logo_url }}
                  style={styles.brandLogo}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.brandLogoPlaceholder}>
                  <Icon name="business" size={20} color="#6366F1" />
                </View>
              )}
            </View>
            <View style={styles.campaignTextContent}>
              <Text style={styles.campaignTitle} numberOfLines={1}>
                {campaign.title || 'Untitled Campaign'}
              </Text>
              <Text style={styles.brandName} numberOfLines={1}>
                {brand?.brand_name || 'Unknown Brand'}
              </Text>
            </View>
            <Icon name="chevron-right" size={20} color="#9CA3AF" />
          </View>
          {campaign.description && (
            <Text style={styles.campaignDescription} numberOfLines={2}>
              {campaign.description}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderApplicationCard = (application: Application) => {
    const campaign = application.campaigns;
    const brand = campaign?.brands;
    
    const getStatusColor = () => {
      switch (application.status) {
        case 'approved': return '#10B981';
        case 'rejected': return '#EF4444';
        default: return '#F59E0B';
      }
    };

    const getStatusBg = () => {
      switch (application.status) {
        case 'approved': return '#D1FAE5';
        case 'rejected': return '#FEE2E2';
        default: return '#FEF3C7';
      }
    };

    return (
      <TouchableOpacity
        key={application.id}
        style={styles.applicationCard}
        activeOpacity={0.95}
        onPress={() => {
          if (campaign?.id) {
            (navigation as any).navigate('CampaignDetails', { campaignId: campaign.id });
          }
        }}
      >
        <View style={styles.applicationHeader}>
          <View style={styles.brandLogoContainer}>
            {brand?.logo_url ? (
              <Image
                source={{ uri: brand.logo_url }}
                style={styles.brandLogo}
                resizeMode="cover"
              />
            ) : (
              <Icon name="business" size={20} color="#6366F1" />
            )}
          </View>
          <View style={styles.applicationInfo}>
            <Text style={styles.applicationTitle} numberOfLines={1}>
              {campaign?.title || 'Unknown Campaign'}
            </Text>
            <Text style={styles.applicationBrand} numberOfLines={1}>
              {brand?.brand_name || 'Unknown Brand'}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusBg() }]}>
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {application.status?.toUpperCase() || 'PENDING'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.statsGrid}>
          <SkeletonStatCardNew />
          <SkeletonStatCardNew />
        </View>
        <SkeletonListItemNew />
        <SkeletonListItemNew />
        <SkeletonListItemNew />
      </View>
    );
  }

  const pendingCount = recentApplications.filter(app => app.status === 'pending').length;
  const approvedCount = recentApplications.filter(app => app.status === 'approved').length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.primary]}
          tintColor={Colors.primary}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Modern Header with Dynamic Greeting */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>{getGreeting()}, {getFirstName()}! 👋</Text>
          <Text style={styles.headerSubtitle}>Ready to create amazing content?</Text>
        </View>
      </View>

      {/* Quick Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <StatCard
            icon="assignment"
            iconColor="#6366F1"
            iconBackground="#EEF2FF"
            value={userStats?.totalApplications || 0}
            label="Total Applied"
          />
          <StatCard
            icon="check-circle"
            iconColor="#059669"
            iconBackground="#D1FAE5"
            value={userStats?.approvedApplications || 0}
            label="Approved"
          />
        </View>
        <View style={styles.statsRow}>
          <StatCard
            icon="emoji-events"
            iconColor="#D97706"
            iconBackground="#FEF3C7"
            value={userStats?.completedCampaigns || 0}
            label="Completed"
          />
          <StatCard
            icon="payments"
            iconColor="#059669"
            iconBackground="#ECFDF5"
            value={`$${(userStats?.totalEarnings || 0).toFixed(0)}`}
            label="Earnings"
          />
        </View>
      </View>

      {/* Opportunity Spotlight - Featured Campaigns */}
      {recentCampaigns.length > 0 && (
        <View style={styles.spotlightSection}>
          <View style={styles.spotlightHeader}>
            <View>
              <Text style={styles.spotlightTitle}>🎯 Featured Opportunities</Text>
              <Text style={styles.spotlightSubtitle}>Campaigns perfect for you</Text>
            </View>
            <TouchableOpacity onPress={() => (navigation as any).navigate('Campaigns')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.spotlightScroll}
          >
            {recentCampaigns.slice(0, 3).map((campaign) => (
              <View key={campaign.id} style={styles.featureCardWrapper}>
                <FeatureCard
                  image={campaign.brands?.logo_url}
                  icon={!campaign.brands?.logo_url ? "campaign" : undefined}
                  title={campaign.title}
                  description={campaign.brands?.brand_name}
                  badge="HOT"
                  badgeColor="#6366F1"
                  badgeBackground="#EEF2FF"
                  onPress={() => (navigation as any).navigate('CampaignDetails', { campaignId: campaign.id })}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* My Applications Section - Only if user has applications */}
      {recentApplications.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>My Applications</Text>
              <Text style={styles.sectionSubtitle}>Track your campaign status</Text>
            </View>
            <TouchableOpacity 
              onPress={() => (navigation as any).navigate('Campaigns', { screen: 'applied' })}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.applicationsList}>
            {recentApplications.map(renderApplicationCard)}
          </View>
        </View>
      )}

      {/* Empty State for No Applications */}
      {recentApplications.length === 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>My Applications</Text>
              <Text style={styles.sectionSubtitle}>Start your creator journey</Text>
            </View>
          </View>
          <View style={styles.emptyState}>
            <Icon name="assignment" size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyStateText}>No Applications Yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Browse available campaigns and start applying to collaborate with brands.
            </Text>
            <TouchableOpacity 
              style={styles.emptyStateButton}
              onPress={() => (navigation as any).navigate('Campaigns')}
            >
              <Text style={styles.emptyStateButtonText}>Browse Campaigns</Text>
              <Icon name="arrow-forward" size={16} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Quick Actions Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <QuickActionButton
            icon="explore"
            label="Browse Campaigns"
            iconColor="#6366F1"
            iconBackground="#EEF2FF"
            onPress={() => (navigation as any).navigate('Campaigns')}
          />
          
          <QuickActionButton
            icon="work"
            label="My Projects"
            iconColor="#059669"
            iconBackground="#D1FAE5"
            badge={userStats?.approvedApplications || 0}
            onPress={() => (navigation as any).navigate('Orders')}
          />
          
          <QuickActionButton
            icon="chat"
            label="Messages"
            iconColor="#8B5CF6"
            iconBackground="#F3E8FF"
            badge={3}
            onPress={() => (navigation as any).navigate('Messages')}
          />
          
          <QuickActionButton
            icon="attach-money"
            label="Earnings"
            iconColor="#D97706"
            iconBackground="#FEF3C7"
            onPress={() => (navigation as any).navigate('Earnings')}
          />
          
          <QuickActionButton
            icon="star"
            label="Reviews"
            iconColor="#F59E0B"
            iconBackground="#FEF3C7"
            onPress={() => (navigation as any).navigate('Reviews')}
          />
          
          <QuickActionButton
            icon="notifications"
            label="Notifications"
            iconColor="#EF4444"
            iconBackground="#FEE2E2"
            badge={5}
            onPress={() => (navigation as any).navigate('Notifications')}
          />
          
          <QuickActionButton
            icon="collections"
            label="Content Library"
            iconColor="#06B6D4"
            iconBackground="#CFFAFE"
            onPress={() => (navigation as any).navigate('ContentLibrary')}
          />
          
          <QuickActionButton
            icon="widgets"
            label="Components"
            iconColor="#DB2777"
            iconBackground="#FCE7F3"
            onPress={() => (navigation as any).navigate('ComponentsShowcase')}
          />
        </View>
      </View>

      {/* Tips & Resources Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Creator Tips</Text>
            <Text style={styles.sectionSubtitle}>Improve your success rate</Text>
          </View>
        </View>
        <View style={styles.tipsContainer}>
          <InfoCard
            icon="lightbulb"
            iconColor="#F59E0B"
            iconBackground="#FEF3C7"
            title="Complete Your Profile"
            description="Brands are 3x more likely to approve complete profiles with portfolio links."
            onPress={() => (navigation as any).navigate('Profile')}
            showArrow={true}
          />
          
          <InfoCard
            icon="speed"
            iconColor="#10B981"
            iconBackground="#D1FAE5"
            title="Apply Early"
            description="Applications submitted within 24 hours have higher approval rates."
          />
          
          <InfoCard
            icon="star"
            iconColor="#8B5CF6"
            iconBackground="#F3E8FF"
            title="Showcase Quality Work"
            description="Add your best content samples to stand out from other creators."
            onPress={() => (navigation as any).navigate('Profile')}
            showArrow={true}
          />
        </View>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: 14,
    color: Colors.textTertiary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  scrollContent: {
    paddingBottom: Spacing['3xl'],
  },
  headerContent: {
    gap: Spacing.xs,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '400',
    marginTop: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  welcomeText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.blueGray500,  // Brand black
    letterSpacing: -0.8,
  },
  statsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#F9FAFB',
    gap: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  spotlightSection: {
    marginTop: 24,
    marginBottom: 8,
  },
  spotlightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  spotlightTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  spotlightSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  spotlightScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  featureCardWrapper: {
    width: 260,
  },
  actionCardWrapper: {
    width: 240,
  },
  spotlightCard: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 4,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  spotlightCardHeader: {
    marginBottom: Spacing.md,
  },
  spotlightLogo: {
    width: 56,
    height: 56,
    borderRadius: 4,
  },
  spotlightLogoPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 4,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spotlightCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 20,
    marginBottom: 6,
  },
  spotlightCardBrand: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: Spacing.md,
  },
  spotlightCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  spotlightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 4,
    gap: 4,
  },
  spotlightBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6366F1',
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  viewAllText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
  },
  campaignsList: {
    gap: Spacing.sm,
  },
  campaignCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  campaignCardContent: {
    padding: 16,
  },
  campaignCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandLogoWrapper: {
    width: 52,
    height: 52,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  brandLogo: {
    width: '100%',
    height: '100%',
  },
  brandLogoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
  },
  campaignTextContent: {
    marginLeft: 14,
    flex: 1,
  },
  campaignTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 3,
    letterSpacing: -0.2,
  },
  brandName: {
    fontSize: 13,
    color: '#6B7280',
  },
  campaignDescription: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
  applicationsList: {
    gap: Spacing.sm,
  },
  applicationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  applicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandLogoContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  applicationInfo: {
    marginLeft: 14,
    flex: 1,
  },
  applicationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    letterSpacing: -0.2,
  },
  applicationBrand: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  emptyStateText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    letterSpacing: -0.2,
  },
  emptyStateSubtext: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: Spacing.xs,
    lineHeight: 18,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyStateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  quickActionCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  quickActionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  tipsContainer: {
    gap: Spacing.sm,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
});

export default DashboardScreen;
