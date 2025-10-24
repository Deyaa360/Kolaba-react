import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  LogBox,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';
import supabaseService from '../services/supabase';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import { FilterModal, AnimatedCard, SkeletonCampaignCard as SkeletonCampaignCardNew, EmptyState } from '../components';

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
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  
  // Animated tab indicator
  const tabIndicatorPosition = useSharedValue(0);
  
  // Collapsible header animation
  const scrollY = useSharedValue(0);
  const headerHeight = useSharedValue(0);
  const lastScrollY = useSharedValue(0);
  const headerTranslateY = useSharedValue(0);
  
  // Filter states
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<string[]>([]);
  
  // Data states
  const [availableCampaigns, setAvailableCampaigns] = useState<Campaign[]>([]);
  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [activeCollaborations, setActiveCollaborations] = useState<Application[]>([]);

  useEffect(() => {
    loadCampaignsData();
  }, []);

  // Debounce search query to prevent lag
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

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

  const renderTabButton = (tab: TabType, label: string, icon: string, index: number) => {
    const isActive = activeTab === tab;
    
    const handleTabPress = () => {
      setActiveTab(tab);
      // Animate indicator to new position
      tabIndicatorPosition.value = withSpring(index, {
        damping: 15,
        stiffness: 150,
      });
    };

    return (
      <TouchableOpacity
        style={[styles.tabButton, isActive && styles.tabButtonActive]}
        onPress={handleTabPress}
        activeOpacity={0.7}
      >
        <Icon 
          name={icon} 
          size={20} 
          color={isActive ? Colors.primary : Colors.textSecondary} 
        />
        <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const tabIndicatorStyle = useAnimatedStyle(() => {
    const tabWidth = 100; // Approximate width per tab
    return {
      transform: [{ translateX: tabIndicatorPosition.value * tabWidth }],
    };
  });

  // Animated header style for collapsing/expanding
  const animatedHeaderStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: headerTranslateY.value }],
    };
  });

  // Handle scroll for collapsible header
  const handleScroll = (event: any) => {
    'worklet';
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const delta = currentScrollY - lastScrollY.value;
    
    // Don't hide header at the very top
    if (currentScrollY <= 0) {
      headerTranslateY.value = withSpring(0, { damping: 20, stiffness: 90 });
    }
    // Scrolling down - hide header
    else if (delta > 0 && currentScrollY > 50) {
      headerTranslateY.value = withSpring(-headerHeight.value, { damping: 20, stiffness: 90 });
    }
    // Scrolling up - show header
    else if (delta < 0) {
      headerTranslateY.value = withSpring(0, { damping: 20, stiffness: 90 });
    }
    
    lastScrollY.value = currentScrollY;
    scrollY.value = currentScrollY;
  };

  const getObjectiveLabel = (objective: string) => {
    const labels: { [key: string]: string } = {
      'paid_media_campaigns': 'Paid Media',
      'organic_social_channels': 'Organic Social',
      'ecommerce_web_pages': 'E-commerce',
      'creative_asset_production': 'Creative Assets',
    };
    return labels[objective] || objective;
  };

  const getObjectiveColors = (objective: string) => {
    const colors: { [key: string]: { bg: string; text: string; icon: string } } = {
      'paid_media_campaigns': { bg: '#DBEAFE', text: '#2563EB', icon: 'campaign' },
      'organic_social_channels': { bg: '#D1FAE5', text: '#059669', icon: 'share' },
      'ecommerce_web_pages': { bg: '#FCE7F3', text: '#DB2777', icon: 'shopping-cart' },
      'creative_asset_production': { bg: '#FCE7F3', text: '#EC4899', icon: 'palette' },
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

  const renderCampaignCard = useCallback(({ item: campaign, index }: { item: Campaign; index: number }) => {
    const brand = campaign.brands;
    const contentPackages = campaign.campaign_content_packages || [];
    
    return (
      <AnimatedCard
        index={index}
        onPress={() => {
          (navigation as any).navigate('CampaignDetails', { campaignId: campaign.id });
        }}
        style={styles.campaignCard}
        enableEntryAnimation={false}
      >
        {/* Gradient Background Header */}
        <View style={styles.cardHeader}>
          <View style={styles.brandSection}>
            <View style={styles.brandLogoWrapper}>
              {brand?.logo_url ? (
                <FastImage
                  source={{ 
                    uri: brand.logo_url,
                    priority: FastImage.priority.normal,
                    cache: FastImage.cacheControl.immutable,
                  }}
                  style={styles.brandLogo}
                  resizeMode={FastImage.resizeMode.cover}
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

          {/* Tags Row - Single Line with Flex */}
          <View style={styles.tagsRow}>
            {campaign.objective && (
              <View style={[styles.tag, { backgroundColor: getObjectiveColors(campaign.objective).bg }]}>
                <Icon name={getObjectiveColors(campaign.objective).icon} size={13} color={getObjectiveColors(campaign.objective).text} />
                <Text style={[styles.tagText, { color: getObjectiveColors(campaign.objective).text }]} numberOfLines={1}>
                  {getObjectiveLabel(campaign.objective)}
                </Text>
              </View>
            )}
            {campaign.product_shipping === 'required' && (
              <View style={[styles.tag, { backgroundColor: '#D1FAE5' }]}>
                <Icon name="local-shipping" size={13} color="#059669" />
                <Text style={[styles.tagText, { color: '#059669' }]} numberOfLines={1}>Products</Text>
              </View>
            )}
            {campaign.product_shipping === 'not_required' && (
              <View style={[styles.tag, { backgroundColor: '#FEF3C7' }]}>
                <Icon name="edit" size={13} color="#F59E0B" />
                <Text style={[styles.tagText, { color: '#F59E0B' }]} numberOfLines={1}>Content Only</Text>
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
      </AnimatedCard>
    );
  }, [navigation]);

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
              <FastImage
                source={{ 
                  uri: brand.logo_url,
                  priority: FastImage.priority.normal,
                  cache: FastImage.cacheControl.immutable,
                }}
                style={styles.brandLogo}
                resizeMode={FastImage.resizeMode.cover}
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

  const filteredAvailableCampaigns = useMemo(() => availableCampaigns.filter(campaign => {
    const query = debouncedSearchQuery.toLowerCase();
    
    // Apply search filter - search through title, description, brand name, and objective
    const matchesSearch = query === '' || 
      (campaign.title || '').toLowerCase().includes(query) ||
      (campaign.description || '').toLowerCase().includes(query) ||
      (campaign.brands?.brand_name || '').toLowerCase().includes(query) ||
      (campaign.objective || '').toLowerCase().replace(/_/g, ' ').includes(query);
    
    // Apply objective filter (multi-select)
    const matchesObjective = selectedObjectives.length === 0 || 
      selectedObjectives.includes(campaign.objective || '');
    
    // Apply shipping filter (multi-select)
    const matchesShipping = selectedShipping.length === 0 || 
      selectedShipping.includes(campaign.product_shipping || '');
    
    return matchesSearch && matchesObjective && matchesShipping;
  }), [availableCampaigns, debouncedSearchQuery, selectedObjectives, selectedShipping]);

  const filteredApplications = useMemo(() => myApplications.filter(app => {
    const campaign = app.campaigns;
    const query = debouncedSearchQuery.toLowerCase();
    
    return query === '' ||
      (campaign?.title || '').toLowerCase().includes(query) ||
      (campaign?.description || '').toLowerCase().includes(query) ||
      (campaign?.brands?.brand_name || '').toLowerCase().includes(query);
  }), [myApplications, debouncedSearchQuery]);

  const filteredCollaborations = useMemo(() => activeCollaborations.filter(collab => {
    const campaign = collab.campaigns;
    const query = debouncedSearchQuery.toLowerCase();
    
    return query === '' ||
      (campaign?.title || '').toLowerCase().includes(query) ||
      (campaign?.description || '').toLowerCase().includes(query) ||
      (campaign?.brands?.brand_name || '').toLowerCase().includes(query);
  }), [activeCollaborations, debouncedSearchQuery]);

  const renderTabContent = () => {
    if (loading) {
      return (
        <Animated.FlatList
          data={[1, 2, 3, 4]}
          renderItem={() => <SkeletonCampaignCardNew />}
          keyExtractor={(item) => `skeleton-${item}`}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
      );
    }

    switch (activeTab) {
      case 'available':
        return (
          <Animated.FlatList
            data={filteredAvailableCampaigns}
            renderItem={renderCampaignCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.primary}
                colors={[Colors.primary]}
              />
            }
            ListEmptyComponent={
              <EmptyState
                icon="explore"
                title="No Campaigns Found"
                description="Check back later for new opportunities"
              />
            }
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
            initialNumToRender={6}
            updateCellsBatchingPeriod={50}
          />
        );

      case 'applied':
        return (
          <Animated.FlatList
            data={filteredApplications}
            renderItem={({ item, index }) => renderApplicationCard(item)}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.primary}
                colors={[Colors.primary]}
              />
            }
            ListEmptyComponent={
              <EmptyState
                icon="pending-actions"
                title="No Applications Yet"
                description="Start applying to campaigns to track them here"
              />
            }
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
            initialNumToRender={6}
            updateCellsBatchingPeriod={50}
          />
        );

      case 'active':
        return (
          <Animated.FlatList
            data={filteredCollaborations}
            renderItem={({ item, index }) => renderApplicationCard(item)}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.primary}
                colors={[Colors.primary]}
              />
            }
            ListEmptyComponent={
              <EmptyState
                icon="handshake"
                title="No Active Collaborations"
                description="Your approved campaigns will appear here"
              />
            }
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
            initialNumToRender={6}
            updateCellsBatchingPeriod={50}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        selectedObjectives={selectedObjectives}
        selectedShipping={selectedShipping}
        onObjectivesChange={setSelectedObjectives}
        onShippingChange={setSelectedShipping}
        onClearAll={() => {
          setSelectedObjectives([]);
          setSelectedShipping([]);
        }}
      />

      {/* Animated Collapsible Header */}
      <Animated.View 
        style={[styles.header, animatedHeaderStyle]}
        onLayout={(event) => {
          headerHeight.value = event.nativeEvent.layout.height;
        }}
      >
        {/* Compact Professional Tabs */}
        <View style={styles.tabsContainer}>
          {renderTabButton('available', 'Available', 'explore', 0)}
          {renderTabButton('applied', 'Applied', 'pending-actions', 1)}
          {renderTabButton('active', 'Active', 'handshake', 2)}
          {/* Animated Indicator */}
          <Animated.View style={[styles.tabIndicator, tabIndicatorStyle]} />
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
            {(selectedObjectives.length > 0 || selectedShipping.length > 0) && (
              <View style={styles.filterBadge} />
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Tab Content */}
      {renderTabContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    zIndex: 1000,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  searchFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: Colors.text,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  filterBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
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
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 100,
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
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
    padding: 16,
    paddingTop: 180,
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
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  brandSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandLogoWrapper: {
    width: 52,
    height: 52,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
    backgroundColor: '#F9FAFB',
  },
  brandInfo: {
    marginLeft: 14,
    flex: 1,
  },
  brandName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 3,
    letterSpacing: -0.2,
  },
  brandWebsite: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
  },
  cardBody: {
    padding: 18,
  },
  campaignTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 26,
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  campaignDescription: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 14,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 8,
    marginBottom: 14,
    overflow: 'hidden',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
    flexShrink: 1,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  packagesCompact: {
    backgroundColor: '#F9FAFB',
    borderRadius: 4,
    padding: 14,
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
    borderRadius: 4,
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
    borderRadius: 4,
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
    borderRadius: 4,
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
