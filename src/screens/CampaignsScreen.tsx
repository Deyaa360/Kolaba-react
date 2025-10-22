import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Image,
  LogBox,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import supabaseService from '../services/supabase';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../theme';
import FilterModal from '../components/FilterModal';
import DetailChip from '../components/DetailChip';

// Suppress image loading warnings
LogBox.ignoreLogs([
  'ReactImageView: Image source',
  'Failed to load',
]);

interface Campaign {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: string;
  created_at: string;
  objective?: string;
  product_shipping?: string;
  campaign_content_packages?: any[];
  brands?: {
    id: string;
    brand_name: string;
    logo_url: string;
    website?: string;
    instagram_handle?: string;
    tiktok_handle?: string;
  };
}

interface Application {
  id: string;
  status: string;
  created_at: string;
  campaigns?: Campaign;
}

type TabType = 'available' | 'applied' | 'active';

const CampaignsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<TabType>('available');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter states
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState<string | null>(null);
  const [selectedShipping, setSelectedShipping] = useState<string | null>(null);
  
  // Data states
  const [availableCampaigns, setAvailableCampaigns] = useState<Campaign[]>([]);
  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [activeCollaborations, setActiveCollaborations] = useState<Application[]>([]);

  useEffect(() => {
    loadCampaignsData();
  }, []);

  const loadCampaignsData = async () => {
    try {
      setLoading(true);

      // Load available campaigns
      const campaigns = await supabaseService.getCampaigns(20, 'active');
      setAvailableCampaigns(campaigns || []);

      // Load user's applications
      const applications = await supabaseService.getCreatorApplications();
      setMyApplications(applications || []);

      // Load active collaborations (approved applications)
      const active = await supabaseService.getActiveCollaborations();
      setActiveCollaborations(active || []);

    } catch (error) {
      console.error('Error loading campaigns data:', error);
      setAvailableCampaigns([]);
      setMyApplications([]);
      setActiveCollaborations([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadCampaignsData();
  };

  const renderTabButton = (tab: TabType, label: string, icon: string) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
      onPress={() => setActiveTab(tab)}
    >
      <Icon 
        name={icon} 
        size={20} 
        color={activeTab === tab ? Colors.primary : Colors.textSecondary} 
      />
      <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const getObjectiveLabel = (objective: string) => {
    const labels: { [key: string]: string } = {
      'paid_media_campaigns': 'Paid Media',
      'organic_social_channels': 'Organic Social',
      'ecommerce_web_pages': 'E-commerce',
      'creative_asset_production': 'Creative Assets',
      'brand_awareness': 'Brand Awareness',
      'product_launch': 'Product Launch',
    };
    return labels[objective] || objective;
  };

  const getPackageTypeColor = (contentType: string) => {
    const type = contentType?.toLowerCase() || '';
    if (type.includes('video')) return '#9333EA'; // purple
    if (type.includes('photo') || type.includes('image')) return '#0D9488'; // teal
    return '#4F46E5'; // indigo
  };

  const getPackageTypeLabel = (contentType: string) => {
    const type = contentType?.toLowerCase() || '';
    if (type.includes('authentic_short_video')) return 'Short Video';
    if (type.includes('static_photo_set')) return 'Photo Set';
    if (type.includes('review_testimonial_video')) return 'Review Video';
    if (type.includes('raw_video_clips_set')) return 'Video Clips';
    return contentType?.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Content';
  };

  const renderCampaignCard = (campaign: Campaign) => {
    const brand = campaign.brands;
    const contentPackages = campaign.campaign_content_packages || [];
    const hasProducts = campaign.product_shipping === 'required';
    
    return (
      <View key={campaign.id} style={styles.campaignCard}>
        {/* Header */}
        <View style={styles.campaignHeader}>
          <View style={styles.brandLogoContainer}>
            {brand?.logo_url ? (
              <Image
                source={{ uri: brand.logo_url }}
                style={styles.brandLogo}
                resizeMode="cover"
                onError={(e) => {
                  console.log('Failed to load brand logo');
                }}
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
            {brand?.website && (
              <Text style={styles.brandWebsite} numberOfLines={1}>
                {brand.website.replace(/^https?:\/\//, '')}
              </Text>
            )}
          </View>
        </View>
        
        {/* Description */}
        {campaign.description && (
          <Text style={styles.campaignDescription} numberOfLines={2}>
            {campaign.description}
          </Text>
        )}

        {/* Detail Chips */}
        <View style={styles.chipsRow}>
          {campaign.objective && (
            <DetailChip 
              label={getObjectiveLabel(campaign.objective)}
              backgroundColor="#EEF2FF"
              textColor="#6366F1"
              size="small"
            />
          )}
          {campaign.product_shipping === 'required' && (
            <DetailChip 
              label="Products Included"
              icon="local-shipping"
              backgroundColor="#D1FAE5"
              textColor="#059669"
              size="small"
            />
          )}
          {campaign.product_shipping === 'not_required' && (
            <DetailChip 
              label="Content Only"
              icon="edit"
              backgroundColor="#F3F4F6"
              textColor="#6B7280"
              size="small"
            />
          )}
        </View>

        {/* Content Packages Preview */}
        {contentPackages.length > 0 && (
          <View style={styles.contentPackagesPreview}>
            <View style={styles.packagesHeader}>
              <Icon name="inventory" size={16} color={Colors.primary} />
              <Text style={styles.packagesCount}>
                Content Packages ({contentPackages.length})
              </Text>
            </View>
            {contentPackages.slice(0, 3).map((pkg: any, index: number) => {
              const packageColor = getPackageTypeColor(pkg.content_type);
              const packageLabel = getPackageTypeLabel(pkg.content_type);
              const quantity = pkg.quantity_needed || 1;
              
              // Get products for this package
              const hasProducts = pkg.product_ids && pkg.product_ids.length > 0;
              const productCount = hasProducts ? 
                (Array.isArray(pkg.product_ids) ? pkg.product_ids.length : 
                  (typeof pkg.product_ids === 'string' ? pkg.product_ids.split(',').length : 0)) : 0;
              
              return (
                <View key={index} style={styles.packageItem}>
                  <View style={[styles.packageDot, { backgroundColor: packageColor }]} />
                  <Text style={styles.packageTitle} numberOfLines={1}>
                    {packageLabel}
                    {productCount > 0 && ` • ${productCount} product${productCount > 1 ? 's' : ''}`}
                  </Text>
                  <View style={[styles.packageQuantityBadge, { backgroundColor: packageColor + '20' }]}>
                    <Text style={[styles.packageQuantityText, { color: packageColor }]}>
                      x{quantity}
                    </Text>
                  </View>
                </View>
              );
            })}
            {contentPackages.length > 3 && (
              <Text style={styles.morePackagesText}>
                +{contentPackages.length - 3} more package{contentPackages.length - 3 > 1 ? 's' : ''}
              </Text>
            )}
          </View>
        )}

        {/* Social Handles */}
        {(brand?.instagram_handle || brand?.tiktok_handle) && (
          <View style={styles.socialHandles}>
            {brand?.instagram_handle && (
              <Text style={styles.socialText}>
                @{brand.instagram_handle} (IG)
              </Text>
            )}
            {brand?.instagram_handle && brand?.tiktok_handle && (
              <Text style={styles.socialSeparator}> • </Text>
            )}
            {brand?.tiktok_handle && (
              <Text style={styles.socialText}>
                @{brand.tiktok_handle} (TT)
              </Text>
            )}
          </View>
        )}

        {/* Apply Button */}
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => {
            (navigation as any).navigate('CampaignDetails', { campaignId: campaign.id });
          }}
        >
          <Text style={styles.applyButtonText}>View Details & Apply</Text>
          <Icon name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
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

  const filteredAvailableCampaigns = availableCampaigns.filter(campaign => {
    // Apply search filter
    const matchesSearch = 
      (campaign.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (campaign.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply objective filter
    const matchesObjective = selectedObjective 
      ? campaign.objective === selectedObjective 
      : true;
    
    // Apply shipping filter
    const matchesShipping = selectedShipping
      ? campaign.product_shipping === selectedShipping
      : true;
    
    return matchesSearch && matchesObjective && matchesShipping;
  });

  const filteredApplications = myApplications.filter(app => {
    const campaign = app.campaigns;
    return (
      (campaign?.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (campaign?.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const filteredCollaborations = activeCollaborations.filter(collab => {
    const campaign = collab.campaigns;
    return (
      (campaign?.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (campaign?.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const renderTabContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading campaigns...</Text>
        </View>
      );
    }

    switch (activeTab) {
      case 'available':
        if (filteredAvailableCampaigns.length === 0) {
          return (
            <View style={styles.emptyState}>
              <Icon name="explore" size={64} color={Colors.textSecondary} />
              <Text style={styles.emptyStateText}>No Campaigns Found</Text>
              <Text style={styles.emptyStateSubtext}>
                Check back later for new opportunities
              </Text>
            </View>
          );
        }
        return (
          <ScrollView style={styles.contentContainer}>
            {filteredAvailableCampaigns.map(renderCampaignCard)}
            <View style={{ height: 32 }} />
          </ScrollView>
        );

      case 'applied':
        if (filteredApplications.length === 0) {
          return (
            <View style={styles.emptyState}>
              <Icon name="pending-actions" size={64} color={Colors.textSecondary} />
              <Text style={styles.emptyStateText}>No Applications Yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Start applying to campaigns to track them here
              </Text>
            </View>
          );
        }
        return (
          <ScrollView style={styles.contentContainer}>
            {filteredApplications.map(renderApplicationCard)}
            <View style={{ height: 32 }} />
          </ScrollView>
        );

      case 'active':
        if (filteredCollaborations.length === 0) {
          return (
            <View style={styles.emptyState}>
              <Icon name="handshake" size={64} color={Colors.textSecondary} />
              <Text style={styles.emptyStateText}>No Active Collaborations</Text>
              <Text style={styles.emptyStateSubtext}>
                Your approved campaigns will appear here
              </Text>
            </View>
          );
        }
        return (
          <ScrollView style={styles.contentContainer}>
            {filteredCollaborations.map(renderApplicationCard)}
            <View style={{ height: 32 }} />
          </ScrollView>
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        selectedObjective={selectedObjective}
        selectedShipping={selectedShipping}
        onObjectiveChange={setSelectedObjective}
        onShippingChange={setSelectedShipping}
        onClearAll={() => {
          setSelectedObjective(null);
          setSelectedShipping(null);
        }}
      />

      {/* Modern Header with Search and Filter */}
      <View style={styles.header}>
        {/* Compact Professional Tabs */}
        <View style={styles.tabsContainer}>
          {renderTabButton('available', 'Available', 'explore')}
          {renderTabButton('applied', 'Applied', 'pending-actions')}
          {renderTabButton('active', 'Active', 'handshake')}
        </View>

        {/* Search Bar and Filter on Same Row */}
        <View style={styles.searchFilterRow}>
          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color={Colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search campaigns..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={Colors.textSecondary}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icon name="close" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <Icon name="tune" size={24} color={Colors.text} />
            {(selectedObjective || selectedShipping) && (
              <View style={styles.filterBadge} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Content */}
      <ScrollView
        style={styles.tabContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
          />
        }
      >
        {renderTabContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: Colors.white,
  },
  searchFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 36,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: Spacing.lg,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginBottom: -1,
    gap: Spacing.xs,
  },
  tabButtonActive: {
    borderBottomColor: Colors.primary,
  },
  tabLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  contentContainer: {
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
  },
  campaignCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  campaignHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  brandLogoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 2,
  },
  brandName: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  brandWebsite: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  campaignDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  applicationCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing['3xl'] * 2,
  },
  emptyStateText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
    color: Colors.text,
    marginTop: Spacing.lg,
  },
  emptyStateSubtext: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  // Card styling
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  contentPackagesPreview: {
    backgroundColor: '#F0F9FF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  packagesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  packagesCount: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: '#3B82F6',
    marginLeft: Spacing.xs,
  },
  packageTitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  packageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  packageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  packageQuantityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginLeft: Spacing.sm,
  },
  packageQuantityText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
  },
  morePackagesText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    fontStyle: 'italic',
  },
  socialHandles: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  socialText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  socialSeparator: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.bold,
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
  },
  applyButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: '#FFFFFF',
  },
});

export default CampaignsScreen;
