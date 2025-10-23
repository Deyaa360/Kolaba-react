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
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import { AnimatedCard, AnimatedButton, SkeletonStatCard as SkeletonStatCardNew, SkeletonListItem as SkeletonListItemNew, EmptyState, ToastNotification, ActionCard } from '../components';

interface Stats {
  totalApplications: number;
  approvedApplications: number;
  totalEarnings: number;
  completedCampaigns: number;
}

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
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalApplications: 0,
    approvedApplications: 0,
    totalEarnings: 0,
    completedCampaigns: 0,
  });
  const [recentCampaigns, setRecentCampaigns] = useState<Campaign[]>([]);
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [userName, setUserName] = useState('Creator');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success'|'error'|'info'|'warning'>('info');

  const showToast = (message: string, type: 'success'|'error'|'info'|'warning') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  // Helper function for dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getFirstName = () => {
    return userName.split(' ')[0];
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Get user info
      const user = await supabaseService.getCurrentUser();
      if (user) {
        const displayName = user.user_metadata?.display_name || 
                           user.user_metadata?.full_name || 
                           user.email?.split('@')[0] || 
                           'Creator';
        setUserName(displayName);
      }

      // Load stats
      const userStats = await supabaseService.getUserStats();
      setStats({
        totalApplications: userStats.totalApplications || 0,
        approvedApplications: userStats.approvedApplications || 0,
        totalEarnings: userStats.totalEarnings || 0,
        completedCampaigns: userStats.completedCampaigns || 0,
      });

      // Load recent campaigns (top 3)
      const campaigns = await supabaseService.getCampaigns(3, 'active');
      setRecentCampaigns(campaigns || []);

      // Load recent applications (top 3)
      const applications = await supabaseService.getCreatorApplications();
      setRecentApplications((applications || []).slice(0, 3));

    } catch (error) {
      console.error('Error loading dashboard:', error);
      showToast('Failed to load dashboard data', 'error');
      setStats({
        totalApplications: 0,
        approvedApplications: 0,
        totalEarnings: 0,
        completedCampaigns: 0,
      });
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
          <Text style={styles.headerSubtitle}>Here's your creator dashboard</Text>
        </View>
      </View>

      {/* Progress Tracker - Professional, consistent colors */}
      {(stats.totalApplications > 0 || stats.approvedApplications > 0 || stats.completedCampaigns > 0) && (
        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>Your Creator Journey</Text>
          <View style={styles.progressTracker}>
            <View style={styles.progressStep}>
              <View style={[styles.progressCircle, { backgroundColor: Colors.gray600 }]}>
                <Text style={styles.progressValue}>{stats.totalApplications}</Text>
              </View>
              <Text style={styles.progressLabel}>Applied</Text>
            </View>
            <View style={styles.progressLine} />
            <View style={styles.progressStep}>
              <View style={[styles.progressCircle, { backgroundColor: Colors.primary }]}>
                <Text style={styles.progressValue}>{stats.approvedApplications}</Text>
              </View>
              <Text style={styles.progressLabel}>Approved</Text>
            </View>
            <View style={styles.progressLine} />
            <View style={styles.progressStep}>
              <View style={[styles.progressCircle, { backgroundColor: Colors.success }]}>
                <Text style={styles.progressValue}>{stats.completedCampaigns}</Text>
              </View>
              <Text style={styles.progressLabel}>Completed</Text>
            </View>
          </View>
          
          {/* Earnings Banner */}
          {stats.totalEarnings > 0 && (
            <View style={styles.earningsBanner}>
              <View style={styles.earningsIcon}>
                <Icon name="payments" size={24} color={Colors.success} />
              </View>
              <View style={styles.earningsInfo}>
                <Text style={styles.earningsLabel}>Total Earnings</Text>
                <Text style={styles.earningsValue}>${stats.totalEarnings.toFixed(2)}</Text>
              </View>
              <Icon name="arrow-forward" size={20} color={Colors.gray500} />
            </View>
          )}
        </View>
      )}

      {/* Opportunity Spotlight - Featured Campaigns with ActionCards */}
      {recentCampaigns.length > 0 && (
        <View style={styles.spotlightSection}>
          <View style={styles.spotlightHeader}>
            <View>
              <Text style={styles.spotlightTitle}>🎯 Opportunities for You</Text>
              <Text style={styles.spotlightSubtitle}>Campaigns matching your profile</Text>
            </View>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.spotlightScroll}
          >
            {recentCampaigns.slice(0, 3).map((campaign) => (
              <View key={campaign.id} style={styles.actionCardWrapper}>
                <ActionCard
                  icon="campaign"
                  title={campaign.title || 'Untitled Campaign'}
                  description={campaign.brands?.brand_name || 'Brand Partnership'}
                  actionLabel="View Details"
                  onPress={() => (navigation as any).navigate('CampaignDetails', { campaignId: campaign.id })}
                  gradientColors={['#6366F1', '#8B5CF6']}
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

      {/* Recent Campaigns Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Campaigns</Text>
          <TouchableOpacity onPress={() => {/* Navigate to campaigns */}}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {recentCampaigns.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="campaign" size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyStateText}>No Campaigns Yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Check back later for new campaign opportunities.
            </Text>
          </View>
        ) : (
          <View style={styles.campaignsList}>
            {recentCampaigns.map(renderCampaignCard)}
          </View>
        )}
      </View>

      {/* Recent Applications Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Applications</Text>
          <TouchableOpacity onPress={() => {/* Navigate to campaigns */}}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {recentApplications.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="assignment" size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyStateText}>No Applications Yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Start applying to campaigns to see your application status here.
            </Text>
          </View>
        ) : (
          <View style={styles.applicationsList}>
            {recentApplications.map(renderApplicationCard)}
          </View>
        )}
      </View>

      <View style={{ height: 32 }} />

      {/* Toast Notification */}
      <ToastNotification
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,  // Light gray
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,  // Light gray
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
    ...Typography.title2,
    color: Colors.text,
  },
  headerSubtitle: {
    ...Typography.subheadline,
    color: Colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl * 1.5,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.white,
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
  progressSection: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
    marginTop: Spacing.sm,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: Spacing.lg,
  },
  progressTracker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  progressStep: {
    alignItems: 'center',
  },
  progressCircle: {
    width: 64,
    height: 64,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  progressValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: Spacing.sm,
  },
  earningsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: Spacing.lg,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  earningsIcon: {
    width: 48,
    height: 48,
    borderRadius: 4,
    backgroundColor: '#D1FAE5',
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
    color: '#059669',
    marginBottom: 2,
  },
  earningsValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#047857',
    letterSpacing: -0.5,
  },
  spotlightSection: {
    marginTop: Spacing.xl,
  },
  spotlightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  spotlightTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  spotlightSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  spotlightScroll: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  actionCardWrapper: {
    width: 280,
  },
  spotlightCard: {
    width: 180,
    backgroundColor: Colors.white,
    borderRadius: 4,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
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
    marginBottom: Spacing.sm,
  },
  spotlightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
    gap: 4,
  },
  spotlightBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  section: {
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
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
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  campaignCardContent: {
    padding: Spacing.md,
  },
  campaignCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  brandLogoWrapper: {
    width: 48,
    height: 48,
    borderRadius: 4,
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
    marginLeft: Spacing.md,
    flex: 1,
  },
  campaignTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
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
    borderRadius: 4,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  applicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandLogoContainer: {
    width: 44,
    height: 44,
    borderRadius: 4,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  applicationInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  applicationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  applicationBrand: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    marginLeft: Spacing.sm,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginTop: Spacing.md,
  },
  emptyStateSubtext: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: Spacing.xs,
    lineHeight: 18,
  },
});

export default DashboardScreen;
