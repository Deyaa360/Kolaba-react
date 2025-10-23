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
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
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
      'paid_media_campaigns': { bg: Colors.yellow50, text: Colors.yellow500, icon: 'campaign' },
      'organic_social_channels': { bg: Colors.turquoise50, text: Colors.turquoise500, icon: 'share' },
      'ecommerce_web_pages': { bg: Colors.yellow50, text: Colors.yellow400, icon: 'shopping-cart' },
      'creative_asset_production': { bg: Colors.pink50, text: Colors.pink400, icon: 'palette' },
      'brand_awareness': { bg: Colors.turquoise50, text: Colors.turquoise400, icon: 'star' },
      'product_launch': { bg: Colors.pink50, text: Colors.pink500, icon: 'rocket-launch' },
    };
    return colors[objective] || { bg: Colors.gray100, text: Colors.blueGray200, icon: 'flag' };
  };

  const getPackageTypeColor = (contentType: string) => {
    const type = contentType?.toLowerCase() || '';
    // Different colors for different package types using brand palette
    if (type.includes('authentic_short_video')) return Colors.turquoise500;
    if (type.includes('static_photo_set')) return Colors.pink400;
    if (type.includes('review_testimonial_video')) return Colors.yellow500;
    if (type.includes('raw_video_clips_set')) return Colors.turquoise400;
    return Colors.blueGray200;
  };

  const getPackageTypeIcon = (contentType: string) => {
    const type = contentType?.toLowerCase() || '';
    // Different icons for different package types
    if (type.includes('authentic_short_video')) return 'videocam';
    if (type.includes('static_photo_set')) return 'photo-library';
    if (type.includes('review_testimonial_video')) return 'rate-review';
    if (type.includes('raw_video_clips_set')) return 'movie';
    return 'video-library';
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
                  <Icon name="business" size={22} color={Colors.blueGray200} />
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
              <View style={[styles.tag, { backgroundColor: Colors.turquoise50 }]}>
                <Icon name="card-giftcard" size={12} color={Colors.turquoise500} />
                <Text style={[styles.tagText, { color: Colors.turquoise500 }]}>Products Included</Text>
              </View>
            )}
            {campaign.product_shipping === 'not_required' && (
              <View style={[styles.tag, { backgroundColor: Colors.yellow50 }]}>
                <Icon name="edit" size={12} color={Colors.yellow500} />
                <Text style={[styles.tagText, { color: Colors.yellow500 }]}>Content Only</Text>
              </View>
            )}
          </View>

          {/* Content Packages - Compact View */}
          {contentPackages.length > 0 && (
            <View style={styles.packagesCompact}>
              <View style={styles.packagesCompactHeader}>
                <Icon name="video-library" size={16} color={Colors.blueGray200} />
                <Text style={styles.packagesCompactTitle}>
                  {contentPackages.length} Content Package{contentPackages.length > 1 ? 's' : ''}
                </Text>
              </View>
              <View style={styles.packagesGrid}>
                {contentPackages.slice(0, 2).map((pkg: any, index: number) => {
                  const packageColor = getPackageTypeColor(pkg.content_type);
                  const packageIcon = getPackageTypeIcon(pkg.content_type);
                  const packageLabel = getPackageTypeLabel(pkg.content_type);
                  const quantity = pkg.quantity_needed || 1;
                  
                  return (
                    <View key={index} style={styles.packagePill}>
                      <Icon name={packageIcon} size={14} color={packageColor} />
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

        {/* Footer - Primary CTA */}
        <View style={styles.cardFooter}>
          <Text style={styles.viewDetailsText}>View Details</Text>
          <Icon name="arrow-forward" size={16} color={Colors.primary} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderApplicationCard = (application: Application) => {
    const campaign = application.campaigns;
    const brand = campaign?.brands;
    
    const getStatusColor = () => {
      switch (application.status) {
        case 'approved': return Colors.success;
        case 'rejected': return Colors.error;
        default: return Colors.warning;  // Pending = Yellow
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
              <Icon name="business" size={24} color={Colors.blueGray200} />
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
    backgroundColor: Colors.background,  // Professional gray background
  },
  header: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
    backgroundColor: Colors.gray100,  // Subtle gray for input
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.border,
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
    backgroundColor: Colors.gray100,  // Consistent with search
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,  // Turquoise indicator
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
    borderBottomColor: Colors.primary,  // Turquoise for active tab
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,  // Gray for inactive
  },
  tabLabelActive: {
    color: Colors.primary,  // Turquoise for active
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
  
  // Modern Campaign Card - Professional styling
  campaignCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    backgroundColor: Colors.white,  // Clean white header
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
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
    backgroundColor: Colors.gray100,  // Neutral placeholder
  },
  brandInfo: {
    marginLeft: 12,
    flex: 1,
  },
  brandName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.blueGray500,  // Brand black
    marginBottom: 2,
  },
  brandWebsite: {
    fontSize: 13,
    color: Colors.textSecondary,  // Secondary text
  },
  cardBody: {
    padding: 16,
  },
  campaignTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.blueGray500,  // Brand black
    lineHeight: 24,
    marginBottom: 8,
  },
  campaignDescription: {
    fontSize: 14,
    color: Colors.blueGray200,  // Readable gray
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 5,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
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
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  packageDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  packagePillText: {
    fontSize: 12,
    color: Colors.blueGray300,
    fontWeight: '500',
  },
  packagePillMore: {
    backgroundColor: Colors.gray100,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  packagePillMoreText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.white,  // Clean white footer
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 6,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,  // Turquoise for primary CTA
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
