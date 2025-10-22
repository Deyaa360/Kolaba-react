import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import supabaseService from '../services/supabase';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../theme';

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

  const renderStatCard = (title: string, value: string, icon: string, color: string, gradient: string[]) => (
    <View style={[styles.statCard, { borderColor: color + '30' }]}>
      <View style={[styles.statIconContainer, { backgroundColor: color + '15' }]}>
        <Icon name={icon} size={24} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );

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
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  const pendingCount = recentApplications.filter(app => app.status === 'pending').length;
  const approvedCount = recentApplications.filter(app => app.status === 'approved').length;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.primary]}
        />
      }
    >
      {/* Welcome Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {userName}!</Text>
      </View>

      {/* Stats Cards - Matching Flutter (2 cards) */}
      <View style={styles.statsContainer}>
        {renderStatCard(
          'Active Applications',
          `${pendingCount}`,
          'pending-actions',
          '#F59E0B',
          ['#FEF3C7', '#FDE68A']
        )}
        {renderStatCard(
          'Approved',
          `${approvedCount}`,
          'check-circle',
          '#10B981',
          ['#D1FAE5', '#A7F3D0']
        )}
      </View>

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
    color: '#9CA3AF',
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    backgroundColor: '#FFFFFF',
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statContent: {
    gap: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -1,
  },
  statTitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 2,
  },
  section: {
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
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
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: Spacing.sm,
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
    width: 44,
    height: 44,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
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
    borderRadius: 14,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: Spacing.sm,
  },
  applicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandLogoContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
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
    borderRadius: 8,
    marginLeft: Spacing.sm,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
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
