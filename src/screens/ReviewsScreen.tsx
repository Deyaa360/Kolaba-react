import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';
import { Colors, Spacing } from '../theme';
import { SectionHeader, StatCard, ProgressCard } from '../components';

/**
 * Reviews & Ratings Screen - Reputation management for freelancer apps
 * Shows ratings, reviews, testimonials from brands
 */
const ReviewsScreen = ({ navigation }: any) => {
  const [reviews] = React.useState([
    {
      id: '1',
      brandName: 'Fashion Brand Co.',
      brandLogo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100',
      campaignName: 'Summer Fashion Campaign',
      rating: 5,
      date: 'Jan 15, 2024',
      comment: 'Exceptional work! Sarah delivered stunning content that exceeded our expectations. Highly professional and creative.',
      categories: {
        quality: 5,
        communication: 5,
        timeliness: 5,
        professionalism: 5,
      },
    },
    {
      id: '2',
      brandName: 'Beauty Products Inc.',
      brandLogo: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100',
      campaignName: 'Beauty Product Review',
      rating: 4.5,
      date: 'Jan 10, 2024',
      comment: 'Great collaboration! The content was engaging and authentic. Minor delays but overall excellent experience.',
      categories: {
        quality: 5,
        communication: 4,
        timeliness: 4,
        professionalism: 5,
      },
    },
    {
      id: '3',
      brandName: 'Fitness Studio',
      brandLogo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100',
      campaignName: 'Fitness Challenge Content',
      rating: 5,
      date: 'Jan 5, 2024',
      comment: 'Outstanding creator! The content inspired our community and drove amazing engagement. Will definitely work together again.',
      categories: {
        quality: 5,
        communication: 5,
        timeliness: 5,
        professionalism: 5,
      },
    },
    {
      id: '4',
      brandName: 'Tech Startup',
      brandLogo: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100',
      campaignName: 'Tech Product Unboxing',
      rating: 4,
      date: 'Dec 28, 2023',
      comment: 'Good content quality and professional approach. Would appreciate faster response times in future collaborations.',
      categories: {
        quality: 5,
        communication: 3,
        timeliness: 4,
        professionalism: 4,
      },
    },
  ]);

  const overallRating = 4.9;
  const totalReviews = reviews.length;
  
  const calculateAverageCategory = (category: keyof typeof reviews[0]['categories']) => {
    const sum = reviews.reduce((acc, review) => acc + review.categories[category], 0);
    return (sum / reviews.length).toFixed(1);
  };

  const categoryBreakdown = {
    quality: parseFloat(calculateAverageCategory('quality')),
    communication: parseFloat(calculateAverageCategory('communication')),
    timeliness: parseFloat(calculateAverageCategory('timeliness')),
    professionalism: parseFloat(calculateAverageCategory('professionalism')),
  };

  const ratingDistribution = [
    { stars: 5, count: 18, percentage: 75 },
    { stars: 4, count: 4, percentage: 17 },
    { stars: 3, count: 2, percentage: 8 },
    { stars: 2, count: 0, percentage: 0 },
    { stars: 1, count: 0, percentage: 0 },
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Icon key={`full-${i}`} name="star" size={16} color="#F59E0B" />);
    }
    if (hasHalfStar) {
      stars.push(<Icon key="half" name="star-half" size={16} color="#F59E0B" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Icon key={`empty-${i}`} name="star-outline" size={16} color="#D1D5DB" />);
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Page Title - Scrolls with content */}
          <Text style={styles.pageTitle}>Reviews & Ratings</Text>

          {/* Overall Rating Card */}
          <View style={styles.overallCard}>
            <View style={styles.overallLeft}>
              <Text style={styles.overallRating}>{overallRating}</Text>
              <View style={styles.overallStars}>
                {renderStars(overallRating)}
              </View>
              <Text style={styles.overallText}>{totalReviews} reviews</Text>
            </View>
            <View style={styles.overallRight}>
              {ratingDistribution.map((dist) => (
                <View key={dist.stars} style={styles.distributionRow}>
                  <Text style={styles.distributionStars}>{dist.stars}★</Text>
                  <View style={styles.distributionBar}>
                    <View 
                      style={[
                        styles.distributionFill,
                        { width: `${dist.percentage}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.distributionCount}>{dist.count}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Category Breakdown */}
          <SectionHeader
            icon="category"
            iconColor="#6366F1"
            title="Rating Breakdown"
            subtitle="Average scores by category"
          />

          <View style={styles.categoryGrid}>
            <View style={styles.categoryItem}>
              <StatCard
                icon="high-quality"
                iconColor="#10B981"
                iconBackground="#ECFDF5"
                value={categoryBreakdown.quality}
                label="Quality"
              />
            </View>
            <View style={styles.categoryItem}>
              <StatCard
                icon="chat"
                iconColor="#6366F1"
                iconBackground="#EEF2FF"
                value={categoryBreakdown.communication}
                label="Communication"
              />
            </View>
            <View style={styles.categoryItem}>
              <StatCard
                icon="schedule"
                iconColor="#F59E0B"
                iconBackground="#FFFBEB"
                value={categoryBreakdown.timeliness}
                label="Timeliness"
              />
            </View>
            <View style={styles.categoryItem}>
              <StatCard
                icon="verified"
                iconColor="#8B5CF6"
                iconBackground="#FAF5FF"
                value={categoryBreakdown.professionalism}
                label="Professionalism"
              />
            </View>
          </View>

          {/* Progress to Next Milestone */}
          <View style={styles.milestoneSection}>
            <ProgressCard
              title="Next Milestone: 10 Five-Star Reviews"
              current={8}
              total={10}
              color="#F59E0B"
              backgroundColor="#FFFBEB"
              showPercentage={true}
            />
          </View>

          {/* Reviews List */}
          <SectionHeader
            icon="rate-review"
            iconColor="#8B5CF6"
            title="Recent Reviews"
            subtitle={`${totalReviews} brand testimonials`}
            actionLabel="Filter"
            actionIcon="filter-list"
            onAction={() => console.log('Filter reviews')}
          />

          {reviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <FastImage
                  source={{ uri: review.brandLogo }}
                  style={styles.brandLogo}
                />
                <View style={styles.reviewHeaderText}>
                  <Text style={styles.brandName}>{review.brandName}</Text>
                  <Text style={styles.campaignName}>{review.campaignName}</Text>
                </View>
                <View style={styles.reviewRating}>
                  <Icon name="star" size={18} color="#F59E0B" />
                  <Text style={styles.ratingValue}>{review.rating}</Text>
                </View>
              </View>

              <View style={styles.reviewStars}>
                {renderStars(review.rating)}
                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>

              <Text style={styles.reviewComment}>{review.comment}</Text>

              <View style={styles.reviewCategories}>
                <View style={styles.reviewCategoryItem}>
                  <Text style={styles.reviewCategoryLabel}>Quality</Text>
                  <Text style={styles.reviewCategoryValue}>{review.categories.quality}/5</Text>
                </View>
                <View style={styles.reviewCategoryItem}>
                  <Text style={styles.reviewCategoryLabel}>Communication</Text>
                  <Text style={styles.reviewCategoryValue}>{review.categories.communication}/5</Text>
                </View>
                <View style={styles.reviewCategoryItem}>
                  <Text style={styles.reviewCategoryLabel}>Timeliness</Text>
                  <Text style={styles.reviewCategoryValue}>{review.categories.timeliness}/5</Text>
                </View>
                <View style={styles.reviewCategoryItem}>
                  <Text style={styles.reviewCategoryLabel}>Professional</Text>
                  <Text style={styles.reviewCategoryValue}>{review.categories.professionalism}/5</Text>
                </View>
              </View>

              <View style={styles.reviewFooter}>
                <TouchableOpacity style={styles.reviewAction}>
                  <Icon name="thumb-up-outline" size={16} color="#6B7280" />
                  <Text style={styles.reviewActionText}>Helpful</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.reviewAction}>
                  <Icon name="share" size={16} color="#6B7280" />
                  <Text style={styles.reviewActionText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <View style={{ height: Spacing.xl }} />
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
  overallCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: Spacing.xl,
    borderRadius: 4,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  overallLeft: {
    alignItems: 'center',
    paddingRight: Spacing.xl,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  overallRating: {
    fontSize: 48,
    fontWeight: '800',
    color: '#111827',
    marginBottom: Spacing.xs,
  },
  overallStars: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: Spacing.xs,
  },
  overallText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  overallRight: {
    flex: 1,
    paddingLeft: Spacing.lg,
    justifyContent: 'center',
  },
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: Spacing.sm,
  },
  distributionStars: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    width: 24,
  },
  distributionBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  distributionFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 3,
  },
  distributionCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    width: 20,
    textAlign: 'right',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  categoryItem: {
    width: '47%',
  },
  milestoneSection: {
    marginBottom: Spacing.xl,
  },
  reviewCard: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: 4,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  brandLogo: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  reviewHeaderText: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  brandName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  campaignName: {
    fontSize: 12,
    color: '#6B7280',
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F59E0B',
  },
  reviewStars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing.md,
  },
  reviewDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: Spacing.sm,
  },
  reviewComment: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  reviewCategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  reviewCategoryItem: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: 4,
  },
  reviewCategoryLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  reviewCategoryValue: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '700',
  },
  reviewFooter: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  reviewAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  reviewActionText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
});

export default ReviewsScreen;
