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

  const getObjectiveColors = (objective: string) => {
    const colors: { [key: string]: { bg: string; text: string; icon: string } } = {
      'paid_media_campaigns': { bg: '#FEF3C7', text: '#F59E0B', icon: 'campaign' },
      'organic_social_channels': { bg: '#D1FAE5', text: '#059669', icon: 'share' },
      'ecommerce_web_pages': { bg: '#DBEAFE', text: '#2563EB', icon: 'shopping-cart' },
      'creative_asset_production': { bg: '#E9D5FF', text: '#9333EA', icon: 'palette' },
      'brand_awareness': { bg: '#FCE7F3', text: '#DB2777', icon: 'star' },
      'product_launch': { bg: '#FED7AA', text: '#EA580C', icon: 'rocket-launch' },
    };
    return colors[objective] || { bg: '#F3F4F6', text: '#6B7280', icon: 'flag' };
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
    
    return (
      <TouchableOpacity
        key={campaign.id}
        style={styles.campaignCard}
        activeOpacity={0.95}
        onPress={() => {
          (navigation as any).navigate('CampaignDetails', { campaignId: campaign.id });
        }}
      >
        {/* Gradient Background Header */}
        <View style={styles.cardHeader}>
          <View style={styles.brandSection}>
            <View style={styles.brandLogoWrapper}>
              {brand?.logo_url ? (
                <Image
                  source={{ uri: brand.logo_url }}
                  style={styles.brandLogo}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.brandLogoPlaceholder}>
                  <Icon name="business" size={22} color="#6366F1" />
                </View>
              )}
            </View>
            <View style={styles.brandInfo}>
              <Text style={styles.brandName} numberOfLines={1}>
                {brand?.brand_name || 'Unknown Brand'}
              </Text>
              {brand?.website && (
                <Text style={styles.brandWebsite} numberOfLines={1}>
                  {brand.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Campaign Title */}
        <View style={styles.cardBody}>
          <Text style={styles.campaignTitle} numberOfLines={2}>
            {campaign.title || 'Untitled Campaign'}
          </Text>
          
          {/* Description */}
          {campaign.description && (
            <Text style={styles.campaignDescription} numberOfLines={3}>
              {campaign.description}
            </Text>
          )}

          {/* Tags Row */}
          <View style={styles.tagsContainer}>
            {campaign.objective && (
              <View style={[styles.tag, { backgroundColor: getObjectiveColors(campaign.objective).bg }]}>
                <Icon name={getObjectiveColors(campaign.objective).icon} size={12} color={getObjectiveColors(campaign.objective).text} />
                <Text style={[styles.tagText, { color: getObjectiveColors(campaign.objective).text }]}>
                  {getObjectiveLabel(campaign.objective)}
                </Text>
              </View>
            )}
            {campaign.product_shipping === 'required' && (
              <View style={[styles.tag, { backgroundColor: '#D1FAE5' }]}>
                <Icon name="card-giftcard" size={12} color="#059669" />
                <Text style={[styles.tagText, { color: '#059669' }]}>Products Included</Text>
              </View>
            )}
            {campaign.product_shipping === 'not_required' && (
              <View style={[styles.tag, { backgroundColor: '#E0E7FF' }]}>
                <Icon name="edit" size={12} color="#4F46E5" />
                <Text style={[styles.tagText, { color: '#4F46E5' }]}>Content Only</Text>
              </View>
            )}
          </View>

          {/* Content Packages - Compact View */}
          {contentPackages.length > 0 && (
            <View style={styles.packagesCompact}>
              <View style={styles.packagesCompactHeader}>
                <Icon name="video-library" size={16} color="#8B5CF6" />
                <Text style={styles.packagesCompactTitle}>
                  {contentPackages.length} Content Package{contentPackages.length > 1 ? 's' : ''}
                </Text>
              </View>
              <View style={styles.packagesGrid}>
                {contentPackages.slice(0, 2).map((pkg: any, index: number) => {
                  const packageColor = getPackageTypeColor(pkg.content_type);
                  const packageLabel = getPackageTypeLabel(pkg.content_type);
                  const quantity = pkg.quantity_needed || 1;
                  
                  return (
                    <View key={index} style={styles.packagePill}>
                      <View style={[styles.packageDot, { backgroundColor: packageColor }]} />
                      <Text style={styles.packagePillText} numberOfLines={1}>
                        {packageLabel} x{quantity}
                      </Text>
                    </View>
                  );
                })}
                {contentPackages.length > 2 && (
                  <View style={styles.packagePillMore}>
                    <Text style={styles.packagePillMoreText}>
                      +{contentPackages.length - 2}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.cardFooter}>
          <View style={styles.socialRow}>
            {brand?.instagram_handle && (
              <TouchableOpacity 
                style={styles.socialBadge}
                onPress={() => {
                  // You can add Linking.openURL here to open Instagram
                  console.log('Open Instagram:', brand.instagram_handle);
                }}
                activeOpacity={0.7}
              >
                <Icon name="camera-alt" size={12} color="#E1306C" />
                <Text style={styles.socialBadgeText}>@{brand.instagram_handle}</Text>
              </TouchableOpacity>
            )}
            {brand?.tiktok_handle && (
              <TouchableOpacity 
                style={styles.socialBadge}
                onPress={() => {
                  // You can add Linking.openURL here to open TikTok
                  console.log('Open TikTok:', brand.tiktok_handle);
                }}
                activeOpacity={0.7}
              >
                <Icon name="music-note" size={12} color="#000000" />
                <Text style={styles.socialBadgeText}>@{brand.tiktok_handle}</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.viewDetailsButton}>
            <Text style={styles.viewDetailsText}>View Details</Text>
            <Icon name="arrow-forward" size={14} color="#6366F1" />
          </View>
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
    const query = searchQuery.toLowerCase();
    
    // Apply search filter - search through title, description, brand name, and objective
    const matchesSearch = query === '' || 
      (campaign.title || '').toLowerCase().includes(query) ||
      (campaign.description || '').toLowerCase().includes(query) ||
      (campaign.brands?.brand_name || '').toLowerCase().includes(query) ||
      (campaign.objective || '').toLowerCase().replace(/_/g, ' ').includes(query);
    
    // Apply objective filter
    const matchesObjective = !selectedObjective || campaign.objective === selectedObjective;
    
    // Apply shipping filter
    const matchesShipping = !selectedShipping || campaign.product_shipping === selectedShipping;
    
    return matchesSearch && matchesObjective && matchesShipping;
  });

  const filteredApplications = myApplications.filter(app => {
    const campaign = app.campaigns;
    const query = searchQuery.toLowerCase();
    
    return query === '' ||
      (campaign?.title || '').toLowerCase().includes(query) ||
      (campaign?.description || '').toLowerCase().includes(query) ||
      (campaign?.brands?.brand_name || '').toLowerCase().includes(query);
  });

  const filteredCollaborations = activeCollaborations.filter(collab => {
    const campaign = collab.campaigns;
    const query = searchQuery.toLowerCase();
    
    return query === '' ||
      (campaign?.title || '').toLowerCase().includes(query) ||
      (campaign?.description || '').toLowerCase().includes(query) ||
      (campaign?.brands?.brand_name || '').toLowerCase().includes(query);
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
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: Typography.fontSize.base,
    color: Colors.text,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6366F1',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    gap: 6,
  },
  tabButtonActive: {
    borderBottomColor: '#6366F1',
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabLabelActive: {
    color: '#6366F1',
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: '#9CA3AF',
  },
  
  // Modern Campaign Card
  campaignCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  brandSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandLogoWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
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
  brandInfo: {
    marginLeft: 12,
    flex: 1,
  },
  brandName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  brandWebsite: {
    fontSize: 13,
    color: '#6B7280',
  },
  cardBody: {
    padding: 16,
  },
  campaignTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 24,
    marginBottom: 8,
  },
  campaignDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  packagesCompact: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  packagesCompactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  packagesCompactTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  packagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  packagePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  packageDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  packagePillText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  packagePillMore: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  packagePillMoreText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
    flexWrap: 'wrap',
  },
  socialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 4,
  },
  socialBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  
  // Application Card
  applicationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    marginLeft: 12,
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
    marginLeft: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  
  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
  },
});

export default CampaignsScreen;
