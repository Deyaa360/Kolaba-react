import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors, Spacing } from '../theme';
import { SectionHeader, ListItemCard, StatusCard } from '../components';

/**
 * Notifications Screen - Fully reusable page
 * Shows system notifications, updates, alerts using reusable components
 */
const NotificationsScreen = ({ navigation }: any) => {
  const [notifications] = React.useState([
    {
      id: '1',
      type: 'success' as const,
      title: 'Application Approved! 🎉',
      message: 'Your application for "Summer Fashion Campaign" has been approved. Check your email for next steps.',
      timestamp: '2 hours ago',
      actionLabel: 'View Details',
    },
    {
      id: '2',
      type: 'info' as const,
      title: 'New Campaign Available',
      message: 'A new campaign matching your profile has been posted. Apply before it fills up!',
      timestamp: '5 hours ago',
      actionLabel: 'Browse',
    },
    {
      id: '3',
      type: 'warning' as const,
      title: 'Content Due Soon',
      message: 'Your content for "Fitness Brand Collab" is due in 2 days. Make sure to submit on time!',
      timestamp: '1 day ago',
      actionLabel: 'Submit',
    },
    {
      id: '4',
      type: 'success' as const,
      title: 'Payment Received',
      message: 'Payment of $250 for "Beauty Product Review" has been processed.',
      timestamp: '2 days ago',
    },
    {
      id: '5',
      type: 'pending' as const,
      title: 'Review in Progress',
      message: 'Your submitted content is being reviewed by the brand team.',
      timestamp: '3 days ago',
    },
  ]);

  const handleAction = (id: string, action: string) => {
    console.log(`Action ${action} for notification ${id}`);
    // Navigate or perform action based on notification type
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Page Title - Scrolls with content */}
          <Text style={styles.pageTitle}>Notifications</Text>

          {/* Section Header */}
          <SectionHeader
            icon="notifications-active"
            iconColor="#6366F1"
            title="Recent Updates"
            subtitle={`${notifications.length} notifications`}
            actionLabel="Mark all read"
            onAction={() => console.log('Mark all as read')}
          />

          {/* Notifications List */}
          <View style={styles.notificationsList}>
            {notifications.map((notification) => (
              <View key={notification.id} style={styles.notificationItem}>
                <StatusCard
                  status={notification.type}
                  title={notification.title}
                  message={notification.message}
                  timestamp={notification.timestamp}
                  actionLabel={notification.actionLabel}
                  onAction={notification.actionLabel ? () => handleAction(notification.id, notification.actionLabel!) : undefined}
                />
              </View>
            ))}
          </View>

          {/* Settings Section */}
          <View style={styles.settingsSection}>
            <SectionHeader
              icon="settings"
              iconColor="#6B7280"
              title="Notification Settings"
            />
            
            <ListItemCard
              icon="email"
              iconColor="#6366F1"
              iconBackground="#EEF2FF"
              title="Email Notifications"
              subtitle="Receive updates via email"
              badge="On"
              badgeColor="#10B981"
              badgeBackground="#ECFDF5"
              onPress={() => console.log('Toggle email notifications')}
            />
            
            <View style={styles.spacer} />
            
            <ListItemCard
              icon="notifications"
              iconColor="#8B5CF6"
              iconBackground="#FAF5FF"
              title="Push Notifications"
              subtitle="Get instant alerts"
              badge="On"
              badgeColor="#10B981"
              badgeBackground="#ECFDF5"
              onPress={() => console.log('Toggle push notifications')}
            />
          </View>
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
  notificationsList: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  notificationItem: {
    // Container for each StatusCard
  },
  settingsSection: {
    marginTop: Spacing.lg,
  },
  spacer: {
    height: Spacing.md,
  },
});

export default NotificationsScreen;
