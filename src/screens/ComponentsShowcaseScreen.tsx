import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors, Spacing } from '../theme';
import { 
  InfoCard, 
  StatCard, 
  FeatureCard, 
  QuickActionButton,
  ProgressCard,
  StatusCard,
  ListItemCard,
  SectionHeader,
  ProposalCard,
  ClientCard,
  PortfolioItem,
  SkillBadge,
  DeliverableItem,
  TimelineStep,
  RatingBreakdown,
  ServiceCard,
} from '../components';

/**
 * Components Showcase Screen
 * Demo screen to preview all reusable components with different configurations
 */
const ComponentsShowcaseScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Components Showcase</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          
          {/* InfoCard Examples */}
          <SectionHeader
            icon="info"
            iconColor="#6366F1"
            title="InfoCard Component"
            subtitle="Tips, notifications, announcements"
          />
          
          <InfoCard
            icon="lightbulb"
            iconColor="#F59E0B"
            iconBackground="#FFFBEB"
            title="Pro Tip: Complete Your Profile"
            description="Creators with complete profiles get 3x more campaign approvals"
            onPress={() => console.log('Navigate to profile')}
            showArrow={true}
          />
          
          <View style={styles.spacer} />
          
          <InfoCard
            icon="verified"
            iconColor="#10B981"
            iconBackground="#ECFDF5"
            title="Get Verified"
            description="Verified creators earn 50% more on average"
            onPress={() => console.log('Start verification')}
            showArrow={true}
          />

          <View style={styles.sectionDivider} />

          {/* StatCard Examples */}
          <SectionHeader
            icon="bar-chart"
            iconColor="#8B5CF6"
            title="StatCard Component"
            subtitle="Metrics, KPIs, statistics"
          />

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <StatCard
                icon="assignment"
                iconColor="#6366F1"
                iconBackground="#EEF2FF"
                value="24"
                label="Applications"
              />
            </View>
            <View style={styles.statItem}>
              <StatCard
                icon="check-circle"
                iconColor="#10B981"
                iconBackground="#ECFDF5"
                value="18"
                label="Approved"
              />
            </View>
            <View style={styles.statItem}>
              <StatCard
                icon="attach-money"
                iconColor="#F59E0B"
                iconBackground="#FFFBEB"
                value="$3,250"
                label="Earnings"
                trend={{ value: '+15%', isPositive: true }}
              />
            </View>
            <View style={styles.statItem}>
              <StatCard
                icon="star"
                iconColor="#EF4444"
                iconBackground="#FEF2F2"
                value="4.9"
                label="Rating"
                trend={{ value: '+0.2', isPositive: true }}
              />
            </View>
          </View>

          <View style={styles.sectionDivider} />

          {/* FeatureCard Examples */}
          <SectionHeader
            icon="featured-play-list"
            iconColor="#10B981"
            title="FeatureCard Component"
            subtitle="Campaigns, products, highlights"
          />

          <FeatureCard
            image="https://images.unsplash.com/photo-1445205170230-053b83016050?w=400"
            title="Summer Fashion Campaign"
            description="Create authentic lifestyle content for our summer collection"
            badge="$500"
            badgeColor="#10B981"
            badgeBackground="#ECFDF5"
            onPress={() => console.log('View campaign')}
          />

          <View style={styles.spacer} />

          <FeatureCard
            icon="fitness-center"
            iconColor="#EF4444"
            iconBackground="#FEF2F2"
            title="Fitness Challenge"
            description="Share your workout journey with our community"
            badge="Hot 🔥"
            badgeColor="#EF4444"
            badgeBackground="#FEF2F2"
            onPress={() => console.log('View challenge')}
          />

          <View style={styles.sectionDivider} />

          {/* QuickActionButton Examples */}
          <SectionHeader
            icon="flash-on"
            iconColor="#F59E0B"
            title="QuickActionButton Component"
            subtitle="Navigation shortcuts, actions"
          />

          <View style={styles.actionsGrid}>
            <QuickActionButton
              icon="explore"
              label="Browse"
              iconColor="#6366F1"
              iconBackground="#EEF2FF"
              onPress={() => console.log('Browse')}
            />
            <QuickActionButton
              icon="person"
              label="Profile"
              iconColor="#8B5CF6"
              iconBackground="#FAF5FF"
              onPress={() => console.log('Profile')}
            />
            <QuickActionButton
              icon="work"
              label="Active"
              iconColor="#10B981"
              iconBackground="#ECFDF5"
              badge={3}
              onPress={() => console.log('Active projects')}
            />
            <QuickActionButton
              icon="notifications"
              label="Alerts"
              iconColor="#EF4444"
              iconBackground="#FEF2F2"
              badge={12}
              onPress={() => console.log('Notifications')}
            />
          </View>

          <View style={styles.sectionDivider} />

          {/* ProgressCard Examples */}
          <SectionHeader
            icon="trending-up"
            iconColor="#6366F1"
            title="ProgressCard Component"
            subtitle="Goals, milestones, completion"
          />

          <ProgressCard
            title="Monthly Earnings Goal"
            current={2450}
            total={3000}
            unit="$"
            color="#10B981"
            backgroundColor="#ECFDF5"
            showPercentage={true}
          />

          <View style={styles.spacer} />

          <ProgressCard
            title="Profile Completion"
            current={7}
            total={10}
            unit=" steps"
            color="#6366F1"
            backgroundColor="#EEF2FF"
            showPercentage={true}
          />

          <View style={styles.spacer} />

          <ProgressCard
            title="Campaign Applications This Month"
            current={24}
            total={30}
            color="#8B5CF6"
            backgroundColor="#FAF5FF"
            showPercentage={false}
          />

          <View style={styles.sectionDivider} />

          {/* StatusCard Examples */}
          <SectionHeader
            icon="notifications-active"
            iconColor="#EF4444"
            title="StatusCard Component"
            subtitle="Alerts, notifications, updates"
          />

          <StatusCard
            status="success"
            title="Application Approved! 🎉"
            message="Your application for Summer Fashion Campaign has been approved."
            timestamp="2 hours ago"
            actionLabel="View Details"
            onAction={() => console.log('View details')}
          />

          <View style={styles.spacer} />

          <StatusCard
            status="warning"
            title="Content Due Soon"
            message="Your content submission is due in 24 hours. Don't miss the deadline!"
            timestamp="5 hours ago"
            actionLabel="Submit Now"
            onAction={() => console.log('Submit')}
          />

          <View style={styles.spacer} />

          <StatusCard
            status="info"
            title="New Feature Available"
            message="Check out our new portfolio builder to showcase your best work."
            timestamp="1 day ago"
            actionLabel="Explore"
            onAction={() => console.log('Explore')}
          />

          <View style={styles.spacer} />

          <StatusCard
            status="pending"
            title="Review in Progress"
            message="Your content is being reviewed by the brand team."
            timestamp="2 days ago"
          />

          <View style={styles.spacer} />

          <StatusCard
            status="error"
            title="Payment Failed"
            message="There was an issue processing your payment. Please update your payment method."
            timestamp="3 days ago"
            actionLabel="Fix Now"
            onAction={() => console.log('Fix payment')}
          />

          <View style={styles.sectionDivider} />

          {/* ListItemCard Examples */}
          <SectionHeader
            icon="list"
            iconColor="#8B5CF6"
            title="ListItemCard Component"
            subtitle="Lists, menus, navigation"
          />

          <ListItemCard
            image="https://images.unsplash.com/photo-1445205170230-053b83016050?w=100"
            title="Summer Fashion Campaign"
            subtitle="Completed • Jan 15, 2024"
            rightText="$500"
            badge="Paid"
            badgeColor="#10B981"
            badgeBackground="#ECFDF5"
            onPress={() => console.log('View item')}
          />

          <View style={styles.spacer} />

          <ListItemCard
            icon="settings"
            iconColor="#6366F1"
            iconBackground="#EEF2FF"
            title="Account Settings"
            subtitle="Manage your account preferences"
            onPress={() => console.log('Settings')}
          />

          <View style={styles.spacer} />

          <ListItemCard
            icon="credit-card"
            iconColor="#10B981"
            iconBackground="#ECFDF5"
            title="Payment Methods"
            subtitle="Bank Account •••• 4321"
            badge="Verified"
            badgeColor="#FFFFFF"
            badgeBackground="#10B981"
            onPress={() => console.log('Payment methods')}
          />

          <View style={styles.spacer} />

          <ListItemCard
            icon="help"
            iconColor="#F59E0B"
            iconBackground="#FFFBEB"
            title="Help & Support"
            subtitle="Get help with your account"
            showArrow={true}
            onPress={() => console.log('Help')}
          />

          {/* FREELANCER/UGC PLATFORM COMPONENTS */}
          <View style={styles.sectionDivider} />

          {/* ProposalCard Examples */}
          <SectionHeader
            icon="description"
            iconColor="#6366F1"
            title="ProposalCard Component"
            subtitle="Track submitted proposals and bids"
          />

          <ProposalCard
            projectTitle="Summer Fashion Instagram Campaign"
            clientName="FashionBrand Co."
            budget="$500"
            deadline="7 days"
            status="accepted"
            submittedDate="2 days ago"
            responseTime="Responded in 4h"
            onPress={() => console.log('View proposal')}
          />

          <View style={styles.spacer} />

          <ProposalCard
            projectTitle="Tech Product Review Video"
            clientName="TechStartup Inc."
            budget="$850"
            deadline="5 days"
            status="interview"
            submittedDate="1 day ago"
            responseTime="Interview scheduled"
            onPress={() => console.log('View proposal')}
          />

          <View style={styles.spacer} />

          <ProposalCard
            projectTitle="Fitness Content Series"
            clientName="FitLife Brand"
            budget="$1,200"
            deadline="14 days"
            status="pending"
            submittedDate="5 hours ago"
            onPress={() => console.log('View proposal')}
          />

          <View style={styles.sectionDivider} />

          {/* ClientCard Examples */}
          <SectionHeader
            icon="person"
            iconColor="#10B981"
            title="ClientCard Component"
            subtitle="Display client profiles and collaboration history"
          />

          <ClientCard
            name="Sarah Johnson"
            avatar="https://i.pravatar.cc/150?img=1"
            company="Beauty Brands Inc."
            rating={4.8}
            totalSpent="$8,500"
            projectsCompleted={12}
            location="New York, USA"
            verified={true}
            onPress={() => console.log('View client')}
          />

          <View style={styles.spacer} />

          <ClientCard
            name="Michael Chen"
            avatar="https://i.pravatar.cc/150?img=8"
            company="Tech Innovators"
            rating={4.9}
            totalSpent="$15,000"
            projectsCompleted={25}
            location="San Francisco, USA"
            verified={true}
            onPress={() => console.log('View client')}
          />

          <View style={styles.sectionDivider} />

          {/* PortfolioItem Examples */}
          <SectionHeader
            icon="collections"
            iconColor="#F59E0B"
            title="PortfolioItem Component"
            subtitle="Showcase portfolio work with stats"
          />

          <View style={{flexDirection: 'row', gap: Spacing.md}}>
            <View style={{flex: 1}}>
              <PortfolioItem
                title="Summer Fashion Lookbook 2025"
                thumbnail="https://images.unsplash.com/photo-1445205170230-053b83016050?w=400"
                category="Fashion"
                views="12.5K"
                likes="1.2K"
                engagement="9.6%"
                featured={true}
                onPress={() => console.log('View portfolio item')}
                onEdit={() => console.log('Edit item')}
              />
            </View>
            <View style={{flex: 1}}>
              <PortfolioItem
                title="Tech Review: Latest Gadgets"
                thumbnail="https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?w=400"
                category="Tech"
                views="8.3K"
                likes="850"
                engagement="10.2%"
                onPress={() => console.log('View portfolio item')}
              />
            </View>
          </View>

          <View style={styles.sectionDivider} />

          {/* SkillBadge Examples */}
          <SectionHeader
            icon="workspace-premium"
            iconColor="#8B5CF6"
            title="SkillBadge Component"
            subtitle="Display skills, expertise, and endorsements"
          />

          <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
            <SkillBadge skill="Content Creation" level="expert" verified={true} endorsements={45} />
            <SkillBadge skill="Video Editing" level="expert" verified={true} endorsements={32} />
            <SkillBadge skill="Photography" level="intermediate" endorsements={28} />
            <SkillBadge skill="Social Media Marketing" level="expert" verified={true} />
            <SkillBadge skill="Copywriting" level="intermediate" endorsements={15} />
            <SkillBadge skill="Graphic Design" level="beginner" />
            <SkillBadge skill="Brand Strategy" verified={true} endorsements={20} />
            <SkillBadge skill="Adobe Premiere" level="expert" />
          </View>

          <View style={styles.sectionDivider} />

          {/* DeliverableItem Examples */}
          <SectionHeader
            icon="assignment"
            iconColor="#6366F1"
            title="DeliverableItem Component"
            subtitle="Track project deliverables and submissions"
          />

          <DeliverableItem
            title="Instagram Post #1"
            description="Create engaging content showcasing the summer collection"
            status="approved"
            dueDate="Completed 2 days ago"
            fileCount={3}
            onPress={() => console.log('View deliverable')}
          />

          <View style={styles.spacer} />

          <DeliverableItem
            title="Instagram Reel"
            description="15-second dynamic video featuring product highlights"
            status="submitted"
            dueDate="Under review"
            fileCount={2}
            onPress={() => console.log('View deliverable')}
          />

          <View style={styles.spacer} />

          <DeliverableItem
            title="Instagram Post #2"
            description="Behind-the-scenes content with product placement"
            status="in_progress"
            dueDate="Due in 3 days"
            onPress={() => console.log('View deliverable')}
            onUpload={() => console.log('Upload files')}
          />

          <View style={styles.spacer} />

          <DeliverableItem
            title="Story Highlights Cover"
            description="Custom designed cover images for story highlights"
            status="revision"
            dueDate="Revisions due tomorrow"
            fileCount={1}
            onPress={() => console.log('View deliverable')}
            onUpload={() => console.log('Upload revised files')}
          />

          <View style={styles.sectionDivider} />

          {/* TimelineStep Examples */}
          <SectionHeader
            icon="timeline"
            iconColor="#8B5CF6"
            title="TimelineStep Component"
            subtitle="Project milestones and progress tracking"
          />

          <TimelineStep
            title="Campaign Brief Received"
            description="Initial campaign requirements and creative brief shared by client"
            date="Jan 15, 2025"
            status="completed"
          />
          <TimelineStep
            title="Content Creation"
            description="Filming and editing content according to brand guidelines"
            date="Jan 18-22, 2025"
            status="completed"
          />
          <TimelineStep
            title="Client Review"
            description="Submitted content awaiting client feedback and approval"
            date="Jan 23, 2025"
            status="current"
          />
          <TimelineStep
            title="Revisions & Edits"
            description="Implementing client feedback and making necessary adjustments"
            date="Jan 24-25, 2025"
            status="upcoming"
          />
          <TimelineStep
            title="Final Delivery"
            description="All content approved and delivered to client"
            date="Jan 26, 2025"
            status="upcoming"
            isLast={true}
          />

          <View style={styles.sectionDivider} />

          {/* RatingBreakdown Example */}
          <SectionHeader
            icon="star"
            iconColor="#F59E0B"
            title="RatingBreakdown Component"
            subtitle="Detailed rating categories and feedback"
          />

          <RatingBreakdown
            ratings={{
              communication: 4.9,
              quality: 4.8,
              delivery: 4.7,
              professionalism: 5.0
            }}
          />

          <View style={styles.sectionDivider} />

          {/* ServiceCard Examples */}
          <SectionHeader
            icon="storefront"
            iconColor="#10B981"
            title="ServiceCard Component"
            subtitle="Display available services and gigs"
          />

          <View style={{flexDirection: 'row', gap: Spacing.md}}>
            <View style={{flex: 1}}>
              <ServiceCard
                title="Professional Instagram Content Creation"
                thumbnail="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400"
                price="$250"
                rating={4.9}
                reviewCount={127}
                category="Social Media"
                deliveryTime="5 days"
                featured={true}
                onPress={() => console.log('View service')}
              />
            </View>
            <View style={{flex: 1}}>
              <ServiceCard
                title="UGC Video Content for Brands"
                thumbnail="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400"
                price="$400"
                rating={4.8}
                reviewCount={89}
                category="Video"
                deliveryTime="7 days"
                onPress={() => console.log('View service')}
              />
            </View>
          </View>

          <View style={{ height: Spacing.xl * 2 }} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  spacer: {
    height: Spacing.md,
  },
  sectionDivider: {
    height: Spacing.xl,
    marginVertical: Spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  statItem: {
    width: '47%',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
});

export default ComponentsShowcaseScreen;
