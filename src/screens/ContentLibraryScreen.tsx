import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';
import { Colors, Spacing } from '../theme';
import { SectionHeader, FeatureCard } from '../components';

/**
 * Content Library Screen - Fully reusable page
 * Shows creator's content portfolio using reusable components
 */
const ContentLibraryScreen = ({ navigation }: any) => {
  const [selectedFilter, setSelectedFilter] = React.useState<'all' | 'photos' | 'videos' | 'reels'>('all');

  const [contentItems] = React.useState([
    {
      id: '1',
      type: 'photo',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
      title: 'Summer Fashion',
      description: 'Lifestyle & Fashion Content',
      badge: '10K views',
      campaign: 'Summer Collection',
    },
    {
      id: '2',
      type: 'video',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
      title: 'Beauty Tutorial',
      description: 'Makeup & Beauty Content',
      badge: '25K views',
      campaign: 'Beauty Brand',
    },
    {
      id: '3',
      type: 'reel',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      title: 'Fitness Routine',
      description: 'Health & Fitness Content',
      badge: '50K views',
      campaign: 'Fitness Collab',
    },
    {
      id: '4',
      type: 'photo',
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400',
      title: 'Tech Review',
      description: 'Technology & Gadgets',
      badge: '15K views',
      campaign: 'Tech Brand',
    },
    {
      id: '5',
      type: 'video',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      title: 'Sneaker Unboxing',
      description: 'Fashion & Lifestyle',
      badge: '30K views',
      campaign: 'Footwear Brand',
    },
    {
      id: '6',
      type: 'reel',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      title: 'Music Festival',
      description: 'Lifestyle & Events',
      badge: '40K views',
      campaign: 'Festival Promo',
    },
  ]);

  const filters = [
    { value: 'all' as const, label: 'All', icon: 'apps', count: contentItems.length },
    { value: 'photos' as const, label: 'Photos', icon: 'photo', count: contentItems.filter(i => i.type === 'photo').length },
    { value: 'videos' as const, label: 'Videos', icon: 'video-library', count: contentItems.filter(i => i.type === 'video').length },
    { value: 'reels' as const, label: 'Reels', icon: 'movie', count: contentItems.filter(i => i.type === 'reel').length },
  ];

  const getFilteredContent = () => {
    if (selectedFilter === 'all') return contentItems;
    return contentItems.filter(item => item.type === selectedFilter.slice(0, -1));
  };

  const filteredContent = getFilteredContent();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Page Title - Scrolls with content */}
          <Text style={styles.pageTitle}>Content Library</Text>

          {/* Stats Overview */}
          <View style={styles.statsBar}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{contentItems.length}</Text>
              <Text style={styles.statLabel}>Total Content</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>170K</Text>
              <Text style={styles.statLabel}>Total Views</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>Avg Rating</Text>
            </View>
          </View>

          {/* Filter Tabs */}
          <View style={styles.filterContainer}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.value}
                style={[
                  styles.filterTab,
                  selectedFilter === filter.value && styles.filterTabActive,
                ]}
                onPress={() => setSelectedFilter(filter.value)}
              >
                <Icon 
                  name={filter.icon} 
                  size={18} 
                  color={selectedFilter === filter.value ? '#6366F1' : '#6B7280'} 
                />
                <Text style={[
                  styles.filterLabel,
                  selectedFilter === filter.value && styles.filterLabelActive,
                ]}>
                  {filter.label}
                </Text>
                <View style={[
                  styles.filterCount,
                  selectedFilter === filter.value && styles.filterCountActive,
                ]}>
                  <Text style={[
                    styles.filterCountText,
                    selectedFilter === filter.value && styles.filterCountTextActive,
                  ]}>
                    {filter.count}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Section Header */}
          <SectionHeader
            icon="collections"
            iconColor="#6366F1"
            title="Your Content"
            subtitle={`${filteredContent.length} items`}
            actionLabel="Sort"
            actionIcon="sort"
            onAction={() => console.log('Sort content')}
          />

          {/* Content Grid */}
          <View style={styles.contentGrid}>
            {filteredContent.map((item) => (
              <View key={item.id} style={styles.contentCard}>
                <FeatureCard
                  image={item.image}
                  title={item.title}
                  description={item.description}
                  badge={item.badge}
                  badgeColor="#FFFFFF"
                  badgeBackground="rgba(0, 0, 0, 0.6)"
                  onPress={() => console.log(`View content ${item.id}`)}
                />
                <View style={styles.contentMeta}>
                  <View style={styles.contentType}>
                    <Icon 
                      name={item.type === 'photo' ? 'photo' : item.type === 'video' ? 'video-library' : 'movie'} 
                      size={14} 
                      color="#6B7280" 
                    />
                    <Text style={styles.contentTypeText}>{item.type}</Text>
                  </View>
                  <Text style={styles.campaignText}>{item.campaign}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Upload More Button */}
          <TouchableOpacity style={styles.uploadButton}>
            <Icon name="add-circle-outline" size={24} color="#6366F1" />
            <Text style={styles.uploadButtonText}>Upload More Content</Text>
          </TouchableOpacity>
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
    padding: Spacing.lg,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
    marginBottom: Spacing.lg,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: 4,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: Spacing.md,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterTabActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterLabelActive: {
    color: '#6366F1',
  },
  filterCount: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  filterCountActive: {
    backgroundColor: '#6366F1',
  },
  filterCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
  },
  filterCountTextActive: {
    color: '#FFFFFF',
  },
  contentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  contentCard: {
    width: '47%',
  },
  contentMeta: {
    marginTop: Spacing.xs,
  },
  contentType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  contentTypeText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  campaignText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#6366F1',
    borderStyle: 'dashed',
    gap: Spacing.sm,
  },
  uploadButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6366F1',
  },
});

export default ContentLibraryScreen;
