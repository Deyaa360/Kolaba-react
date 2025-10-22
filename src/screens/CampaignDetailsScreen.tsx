import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  RefreshControl,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RenderHtml from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import supabaseService from '../services/supabase';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import { DetailChip } from '../components';

const CampaignDetailsScreen = ({ route, navigation }: any) => {
  const { campaignId } = route.params;
  const [campaign, setCampaign] = useState<any>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [applying, setApplying] = useState(false);
  const [expandedPackages, setExpandedPackages] = useState<Set<number>>(new Set());
  const { width } = useWindowDimensions();

  useEffect(() => {
    loadCampaignDetails();
  }, [campaignId]);

  const loadCampaignDetails = async () => {
    try {
      setLoading(true);
      const campaignData = await supabaseService.getCampaignById(campaignId);
      
      if (!campaignData) {
        Alert.alert('Error', 'Campaign not found');
        navigation.goBack();
        return;
      }

      setCampaign(campaignData);
      const appliedStatus = await supabaseService.hasAppliedToCampaign(campaignId);
      setHasApplied(appliedStatus);
    } catch (error) {
      console.error('Error loading campaign details:', error);
      Alert.alert('Error', 'Failed to load campaign details');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleApply = async () => {
    if (hasApplied) return;

    Alert.prompt(
      'Apply to Campaign',
      'Tell the brand why you\'re perfect for this campaign:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: async (message) => {
            if (!message || message.trim().length === 0) {
              Alert.alert('Error', 'Please enter a message');
              return;
            }

            try {
              setApplying(true);
              await supabaseService.submitApplication(campaignId, message.trim());
              setHasApplied(true);
              Alert.alert('Success', 'Application submitted successfully!');
            } catch (error) {
              console.error('Error submitting application:', error);
              Alert.alert('Error', 'Failed to submit application');
            } finally {
              setApplying(false);
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const openURL = async (url: string) => {
    if (!url) return;
    let formattedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      formattedUrl = 'https://' + url;
    }
    const supported = await Linking.canOpenURL(formattedUrl);
    if (supported) {
      await Linking.openURL(formattedUrl);
    }
  };

  const togglePackage = (index: number) => {
    setExpandedPackages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const getPackageTypeColor = (contentType: string) => {
    const type = contentType?.toLowerCase() || '';
    if (type.includes('video')) return '#9333EA';
    if (type.includes('photo') || type.includes('image')) return '#0D9488';
    return '#4F46E5';
  };

  const getPackageTypeIcon = (contentType: string) => {
    const type = contentType?.toLowerCase() || '';
    if (type === 'authentic_short_video') return 'videocam';
    if (type === 'static_photo_set') return 'photo-library';
    if (type === 'raw_video_clips_set') return 'movie';
    if (type === 'ugc_product_review') return 'rate-review';
    if (type === 'testimonial_video') return 'record-voice-over';
    if (type === 'how_to_tutorial') return 'school';
    if (type === 'unboxing_video') return 'card-giftcard';
    if (type === 'lifestyle_content') return 'wb-sunny';
    return 'create';
  };

  const getContentTypeLabel = (contentType: string) => {
    const labels: Record<string, string> = {
      'authentic_short_video': 'Short Video',
      'static_photo_set': 'Photo Set',
      'raw_video_clips_set': 'Video Clips',
      'ugc_product_review': 'Product Review',
      'testimonial_video': 'Testimonial',
      'how_to_tutorial': 'Tutorial',
      'unboxing_video': 'Unboxing',
      'lifestyle_content': 'Lifestyle',
    };
    return labels[contentType] || contentType?.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Content';
  };

  const getVideoDurationLabel = (duration: string) => {
    const labels: Record<string, string> = {
      '15_seconds': '15 seconds',
      '30_seconds': '30 seconds',
      '60_seconds': '60 seconds',
      'long_form': 'Long form (60s+)',
    };
    return labels[duration] || duration;
  };

  const getCropLabel = (crop: string) => {
    const labels: Record<string, string> = {
      'square_1_1': 'Square (1:1)',
      'landscape_16_9': 'Landscape (16:9)',
      'landscape_4_3': 'Landscape (4:3)',
      'story_9_16': 'Story/Vertical (9:16)',
      'portrait_4_5': 'Portrait (4:5)',
    };
    return labels[crop] || crop;
  };

  const getPackageProducts = (productIds: any) => {
    if (!productIds || !campaign.products) return [];
    
    // Parse product_ids if it's a string
    let ids: string[] = [];
    if (typeof productIds === 'string') {
      try {
        // Handle malformed JSON like "{\"id1\",\"id2\"]}"
        const cleaned = productIds.replace(/\{|\}/g, '').replace(/"/g, '');
        ids = cleaned.split(',').map(id => id.trim()).filter(Boolean);
      } catch (e) {
        console.error('Error parsing product_ids:', e);
        return [];
      }
    } else if (Array.isArray(productIds)) {
      ids = productIds;
    }

    return campaign.products.filter((product: any) => ids.includes(product.id));
  };

  const renderRichText = (content: string) => {
    if (!content) return null;

    // Check if it's HTML
    const isHTML = content.includes('<') && content.includes('>');
    
    if (isHTML) {
      return (
        <RenderHtml
          contentWidth={width - Spacing.lg * 2}
          source={{ html: content }}
          tagsStyles={{
            p: { marginVertical: Spacing.xs, color: Colors.text },
            h1: { marginVertical: Spacing.sm, color: Colors.text, fontWeight: '700' },
            h2: { marginVertical: Spacing.sm, color: Colors.text, fontWeight: '600' },
            h3: { marginVertical: Spacing.xs, color: Colors.text, fontWeight: '600' },
            li: { marginVertical: 2, color: Colors.text },
            a: { color: Colors.primary },
          }}
        />
      );
    }

    // Render as markdown-style text
    const lines = content.split('\n');
    return (
      <View>
        {lines.map((line, idx) => {
          if (line.startsWith('# ')) {
            return <Text key={idx} style={styles.heading1}>{line.substring(2)}</Text>;
          }
          if (line.startsWith('## ')) {
            return <Text key={idx} style={styles.heading2}>{line.substring(3)}</Text>;
          }
          if (line.startsWith('### ')) {
            return <Text key={idx} style={styles.heading3}>{line.substring(4)}</Text>;
          }
          if (line.startsWith('• ') || line.startsWith('- ')) {
            return (
              <View key={idx} style={styles.bulletPoint}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{line.substring(2)}</Text>
              </View>
            );
          }
          if (line.trim() === '') {
            return <View key={idx} style={{ height: Spacing.sm }} />;
          }
          return <Text key={idx} style={styles.bodyText}>{line}</Text>;
        })}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading campaign details...</Text>
      </View>
    );
  }

  if (!campaign) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error-outline" size={64} color={Colors.error} />
        <Text style={styles.errorText}>Campaign not found</Text>
        <TouchableOpacity 
          style={styles.errorButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.errorButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const brand = campaign.brands;
  const contentPackages = campaign.campaign_content_packages || [];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadCampaignDetails} colors={[Colors.primary]} />
        }
      >
        {/* Campaign Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.campaignTitle}>{campaign.title}</Text>
          
          <View style={styles.brandInfoRow}>
            <View style={styles.brandLogoSmall}>
              {brand?.logo_url ? (
                <Image 
                  source={{ uri: brand.logo_url }} 
                  style={styles.brandLogoImage} 
                  resizeMode="cover"
                  onError={() => console.log('Failed to load brand logo')}
                />
              ) : (
                <Icon name="business" size={24} color={Colors.primary} />
              )}
            </View>
            <View style={styles.brandTextInfo}>
              <Text style={styles.brandName}>{brand?.brand_name || 'Unknown Brand'}</Text>
              {brand?.website && (
                <TouchableOpacity onPress={() => openURL(brand.website)}>
                  <Text style={styles.brandWebsite}>{brand.website.replace(/^https?:\/\//, '')}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.badgesRow}>
            {campaign.objective && (
              <DetailChip 
                label={campaign.objective.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                size="small"
              />
            )}
            {campaign.product_shipping === 'required' && (
              <DetailChip 
                label="Products Included"
                icon="local-shipping"
                backgroundColor={Colors.success + '20'}
                textColor={Colors.success}
                size="small"
              />
            )}
            {campaign.product_shipping === 'not_required' && (
              <DetailChip 
                label="Content Only"
                icon="edit"
                backgroundColor={Colors.textSecondary + '20'}
                textColor={Colors.textSecondary}
                size="small"
              />
            )}
          </View>
        </View>

        {/* Content Brief */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="description" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Content Brief</Text>
          </View>
          <View style={styles.sectionContent}>
            {renderRichText(campaign.content_brief || campaign.description || 'No content brief available.')}
          </View>
        </View>

        {/* Content Packages */}
        {contentPackages.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="inventory" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>
                Content Packages ({contentPackages.length})
              </Text>
            </View>
            
            {contentPackages.map((pkg: any, index: number) => {
              const isExpanded = expandedPackages.has(index);
              const packageColor = getPackageTypeColor(pkg.content_type);
              const packageIcon = getPackageTypeIcon(pkg.content_type);
              const quantity = pkg.quantity_needed || 1;

              return (
                <View key={index} style={styles.packageItem}>
                  <TouchableOpacity
                    style={styles.packageHeaderButton}
                    onPress={() => togglePackage(index)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.packageIconContainer, { backgroundColor: packageColor + '20' }]}>
                      <Icon name={packageIcon} size={22} color={packageColor} />
                    </View>
                    <View style={styles.packageTitleContainer}>
                      <Text style={styles.packageTitle}>
                        {pkg.title || pkg.content_type?.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </Text>
                      <Text style={styles.packageSubtitle}>
                        Quantity: {quantity}
                      </Text>
                    </View>
                    <Icon 
                      name={isExpanded ? 'expand-less' : 'expand-more'} 
                      size={28} 
                      color={Colors.textSecondary} 
                    />
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.packageExpandedContent}>
                      <View style={styles.divider} />
                      
                      {/* Content Type Badge */}
                      <View style={styles.packageMetadata}>
                        <View style={styles.metadataRow}>
                          <View style={styles.metadataItem}>
                            <Icon name="category" size={16} color={Colors.textSecondary} />
                            <Text style={styles.metadataLabel}>Type:</Text>
                            <View style={[styles.typeBadge, { backgroundColor: packageColor + '20' }]}>
                              <Icon name={packageIcon} size={14} color={packageColor} />
                              <Text style={[styles.typeBadgeText, { color: packageColor }]}>
                                {getContentTypeLabel(pkg.content_type)}
                              </Text>
                            </View>
                          </View>
                        </View>

                        {/* Video Duration */}
                        {pkg.video_duration && (
                          <View style={styles.metadataRow}>
                            <View style={styles.metadataItem}>
                              <Icon name="schedule" size={16} color={Colors.textSecondary} />
                              <Text style={styles.metadataLabel}>Duration:</Text>
                              <Text style={styles.metadataValue}>{getVideoDurationLabel(pkg.video_duration)}</Text>
                            </View>
                          </View>
                        )}

                        {/* Photo Crop */}
                        {pkg.crop && (
                          <View style={styles.metadataRow}>
                            <View style={styles.metadataItem}>
                              <Icon name="crop" size={16} color={Colors.textSecondary} />
                              <Text style={styles.metadataLabel}>Aspect Ratio:</Text>
                              <Text style={styles.metadataValue}>{getCropLabel(pkg.crop)}</Text>
                            </View>
                          </View>
                        )}

                        {/* Video Crop */}
                        {pkg.video_crop && (
                          <View style={styles.metadataRow}>
                            <View style={styles.metadataItem}>
                              <Icon name="aspect-ratio" size={16} color={Colors.textSecondary} />
                              <Text style={styles.metadataLabel}>Video Format:</Text>
                              <Text style={styles.metadataValue}>{getCropLabel(pkg.video_crop)}</Text>
                            </View>
                          </View>
                        )}
                      </View>

                      {/* Products for this package */}
                      {(() => {
                        const packageProducts = getPackageProducts(pkg.product_ids);
                        if (packageProducts.length > 0) {
                          return (
                            <View style={styles.packageProductsSection}>
                              <View style={styles.instructionsHeader}>
                                <Icon name="inventory-2" size={18} color={Colors.primary} />
                                <Text style={styles.instructionsLabel}>
                                  Products ({packageProducts.length})
                                </Text>
                              </View>
                              
                              {packageProducts.map((product: any) => (
                                <View key={product.id} style={styles.packageProductCard}>
                                  <TouchableOpacity
                                    style={styles.productHeader}
                                    onPress={() => (navigation as any).navigate('ProductDetails', { productId: product.id })}
                                    activeOpacity={0.7}
                                  >
                                    {product.photo_url ? (
                                      <Image 
                                        source={{ uri: product.photo_url }} 
                                        style={styles.productImageSmall} 
                                        resizeMode="cover"
                                        onError={() => console.log('Failed to load product image')}
                                      />
                                    ) : (
                                      <View style={styles.productImagePlaceholderSmall}>
                                        <Icon name="inventory-2" size={24} color={Colors.textSecondary} />
                                      </View>
                                    )}
                                    
                                    <View style={styles.productInfo}>
                                      <Text style={styles.productName}>{product.name}</Text>
                                      {product.value && (
                                        <Text style={styles.productValue}>
                                          ${parseFloat(product.value).toFixed(2)}
                                        </Text>
                                      )}
                                    </View>

                                    <Icon name="chevron-right" size={24} color={Colors.textSecondary} />
                                  </TouchableOpacity>

                                  {product.description && (
                                    <Text style={styles.productDescription}>{product.description}</Text>
                                  )}

                                  {product.website && (
                                    <TouchableOpacity 
                                      onPress={() => openURL(product.website)}
                                      style={styles.productWebsiteContainer}
                                    >
                                      <Icon name="open-in-new" size={16} color={Colors.primary} />
                                      <Text style={styles.productWebsite}>
                                        {product.website.replace(/^https?:\/\//, '')}
                                      </Text>
                                    </TouchableOpacity>
                                  )}

                                  {product.how_to_use && (
                                    <View style={styles.productHowToUse}>
                                      <Text style={styles.productHowToUseLabel}>How to use:</Text>
                                      <Text style={styles.productHowToUseText}>{product.how_to_use}</Text>
                                    </View>
                                  )}
                                </View>
                              ))}
                            </View>
                          );
                        }
                        return null;
                      })()}

                      {/* Instructions */}
                      {pkg.instructions && (
                        <View style={styles.packageInstructions}>
                          <View style={styles.instructionsHeader}>
                            <Icon name="description" size={18} color={Colors.primary} />
                            <Text style={styles.instructionsLabel}>Instructions</Text>
                          </View>
                          {renderRichText(pkg.instructions)}
                        </View>
                      )}

                      {/* Reference Files */}
                      {pkg.reference_files && pkg.reference_files.length > 0 && (
                        <View style={styles.referenceFilesSection}>
                          <View style={styles.instructionsHeader}>
                            <Icon name="attach-file" size={18} color={Colors.primary} />
                            <Text style={styles.instructionsLabel}>Reference Files</Text>
                          </View>
                          {pkg.reference_files.map((file: any, fileIndex: number) => (
                            <View key={fileIndex} style={styles.referenceFileItem}>
                              <Icon name="insert-drive-file" size={20} color={Colors.primary} />
                              <Text style={styles.referenceFileName}>{file.name || `File ${fileIndex + 1}`}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* About the Brand */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="business" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>About the Brand</Text>
          </View>
          <View style={styles.sectionContent}>
            {brand?.description && (
              <Text style={styles.bodyText}>{brand.description}</Text>
            )}
            
            {(brand?.instagram_handle || brand?.tiktok_handle) && (
              <View style={styles.socialSection}>
                <Text style={styles.socialLabel}>Social Media:</Text>
                {brand?.instagram_handle && (
                  <View style={styles.socialItem}>
                    <Icon name="camera-alt" size={16} color="#E4405F" />
                    <Text style={styles.socialHandle}>@{brand.instagram_handle}</Text>
                  </View>
                )}
                {brand?.tiktok_handle && (
                  <View style={styles.socialItem}>
                    <Icon name="music-note" size={16} color="#000000" />
                    <Text style={styles.socialHandle}>@{brand.tiktok_handle}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Apply Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.applyButton, hasApplied && styles.appliedButton]}
          onPress={handleApply}
          disabled={hasApplied || applying}
        >
          {applying ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <>
              <Icon 
                name={hasApplied ? 'check-circle' : 'send'} 
                size={20} 
                color={Colors.white} 
              />
              <Text style={styles.applyButtonText}>
                {hasApplied ? 'Application Submitted' : 'Apply to Campaign'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  content: {
    flex: 1,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.xl,
  },
  errorText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
    color: Colors.text,
    marginTop: Spacing.lg,
  },
  errorButton: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
  },
  errorButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
  },
  heroSection: {
    backgroundColor: Colors.white,
    padding: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  campaignTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: Spacing.lg,
    lineHeight: 30,
    letterSpacing: -0.5,
  },
  brandInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  brandLogoSmall: {
    width: 52,
    height: 52,
    borderRadius: 13,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  brandLogoImage: {
    width: '100%',
    height: '100%',
  },
  brandTextInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  brandName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  brandWebsite: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  section: {
    marginTop: Spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: '#FAFBFC',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginLeft: Spacing.sm,
    letterSpacing: -0.3,
  },
  sectionContent: {
    backgroundColor: Colors.white,
    padding: Spacing.xl,
  },
  packageItem: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  packageHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  packageIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  packageTitleContainer: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  packageTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  packageSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  packageExpandedContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  packageDetails: {
    paddingTop: 0,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: Spacing.lg,
  },
  packageInstructions: {
    paddingVertical: Spacing.md,
  },
  instructionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  instructionsLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.text,
  },
  packageMetadata: {
    paddingVertical: Spacing.md,
  },
  metadataRow: {
    marginBottom: Spacing.sm,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metadataLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
  },
  metadataValue: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    fontWeight: '500',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    gap: 4,
  },
  typeBadgeText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
  },
  referenceFilesSection: {
    paddingVertical: Spacing.md,
  },
  referenceFileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  referenceFileName: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    flex: 1,
  },
  packageProductsSection: {
    paddingVertical: Spacing.md,
  },
  packageProductCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  productImageSmall: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
  },
  productImagePlaceholderSmall: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  productWebsiteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  productCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  productHeader: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
  },
  productImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
    marginLeft: Spacing.sm,
    justifyContent: 'center',
  },
  productName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  productValue: {
    fontSize: Typography.fontSize.sm,
    color: Colors.success,
    fontWeight: '600',
  },
  productWebsite: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    flex: 1,
  },
  productDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  productHowToUse: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
  },
  productHowToUseLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  productHowToUseText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    lineHeight: 20,
  },
  bodyText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: Spacing.xs,
  },
  heading1: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
    color: Colors.text,
    marginVertical: Spacing.sm,
  },
  heading2: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginVertical: Spacing.sm,
  },
  heading3: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text,
    marginVertical: Spacing.xs,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: Spacing.xs,
    paddingLeft: Spacing.md,
  },
  bullet: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    marginRight: Spacing.sm,
  },
  bulletText: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    lineHeight: 24,
  },
  socialSection: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  socialLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  socialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  socialHandle: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    marginLeft: Spacing.sm,
  },
  footer: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 14,
    gap: Spacing.sm,
  },
  appliedButton: {
    backgroundColor: Colors.success,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.3,
  },
});

export default CampaignDetailsScreen;
