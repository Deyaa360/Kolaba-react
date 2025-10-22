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

  const renderStatCard = (title: string, value: string, icon: string, color: string) => (
    <View style={[styles.statCard, { borderLeftColor: color, borderLeftWidth: 4 }]}>
      <View style={styles.statContent}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Icon name={icon} size={24} color={color} />
        </View>
        <View style={styles.statTextContainer}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
        </View>
      </View>
    </View>
  );

  const renderCampaignCard = (campaign: Campaign) => {
    const brand = campaign.brands;
    
    return (
      <TouchableOpacity
        key={campaign.id}
        style={styles.campaignCard}
        onPress={() => {
          (navigation as any).navigate('CampaignDetails', { campaignId: campaign.id });
        }}
      >
        <View style={styles.campaignHeader}>
          <View style={styles.brandLogoContainer}>
            {brand?.logo_url ? (
              <Image
                source={{ uri: brand.logo_url }}
                style={styles.brandLogo}
                resizeMode="cover"
              />
            ) : (
              <Icon name="business" size={24} color={Colors.primary} />
            )}
          </View>
          <View style={styles.campaignInfo}>
            <Text style={styles.campaignTitle} numberOfLines={1}>
              {campaign.title || 'Untitled Campaign'}
            </Text>
            <Text style={styles.brandName} numberOfLines={1}>
              {brand?.brand_name || 'Unknown Brand'}
            </Text>
          </View>
        </View>
        {campaign.description && (
          <Text style={styles.campaignDescription} numberOfLines={2}>
            {campaign.description}
          </Text>
        )}
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
        default: return Colors.primary;
      }
    };

    return (
      <TouchableOpacity
        key={application.id}
        style={styles.applicationCard}
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
              <Icon name="business" size={24} color={Colors.primary} />
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
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}>
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
          '#F59E0B'
        )}
        {renderStatCard(
          'Approved',
          `${approvedCount}`,
          'check-circle',
          '#10B981'
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
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
  },
  header: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  welcomeText: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
    color: Colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadow.md,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statTextContainer: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  statValue: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: '800',
    color: Colors.text,
  },
  statTitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
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
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  viewAllText: {
    fontSize: Typography.fontSize.base,
    color: Colors.primary,
    fontWeight: '600',
  },
  campaignsList: {
    gap: Spacing.md,
  },
  campaignCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadow.lg,
  },
  campaignHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandLogoContainer: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary + '40',
    overflow: 'hidden',
  },
  brandLogo: {
    width: '100%',
    height: '100%',
  },
  campaignInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  campaignTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    color: Colors.text,
  },
  brandName: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  campaignDescription: {
    marginTop: Spacing.md,
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  applicationsList: {
    gap: Spacing.md,
  },
  applicationCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadow.md,
  },
  applicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  applicationInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  applicationTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    color: Colors.text,
  },
  applicationBrand: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginLeft: Spacing.sm,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
  },
  emptyState: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadow.sm,
  },
  emptyStateText: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    color: Colors.text,
    marginTop: Spacing.md,
  },
  emptyStateSubtext: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});

export default DashboardScreen;
