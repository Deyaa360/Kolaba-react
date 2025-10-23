import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors, Spacing } from '../theme';
import { SectionHeader, ListItemCard, StatCard, ProgressCard } from '../components';

/**
 * Earnings Screen - Fully reusable page
 * Shows earnings, payments, progress using reusable components
 */
const EarningsScreen = ({ navigation }: any) => {
  const [stats] = React.useState({
    totalEarnings: 2450,
    pending: 450,
    paid: 2000,
    thisMonth: 850,
  });

  const [paymentHistory] = React.useState([
    {
      id: '1',
      campaign: 'Summer Fashion Campaign',
      amount: 500,
      status: 'paid',
      date: 'Jan 15, 2024',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=100',
    },
    {
      id: '2',
      campaign: 'Beauty Product Review',
      amount: 250,
      status: 'paid',
      date: 'Jan 10, 2024',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100',
    },
    {
      id: '3',
      campaign: 'Fitness Brand Collab',
      amount: 450,
      status: 'pending',
      date: 'Expected: Jan 25',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100',
    },
  ]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Page Title - Scrolls with content */}
          <Text style={styles.pageTitle}>Earnings</Text>

          {/* Earnings Overview */}
          <SectionHeader
            icon="account-balance-wallet"
            iconColor="#10B981"
            title="Overview"
            subtitle="Your earnings at a glance"
          />

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <StatCard
                icon="attach-money"
                iconColor="#10B981"
                iconBackground="#ECFDF5"
                value={`$${stats.totalEarnings}`}
                label="Total Earnings"
              />
            </View>
            <View style={styles.statItem}>
              <StatCard
                icon="schedule"
                iconColor="#F59E0B"
                iconBackground="#FFFBEB"
                value={`$${stats.pending}`}
                label="Pending"
              />
            </View>
            <View style={styles.statItem}>
              <StatCard
                icon="check-circle"
                iconColor="#6366F1"
                iconBackground="#EEF2FF"
                value={`$${stats.paid}`}
                label="Paid Out"
              />
            </View>
            <View style={styles.statItem}>
              <StatCard
                icon="trending-up"
                iconColor="#8B5CF6"
                iconBackground="#FAF5FF"
                value={`$${stats.thisMonth}`}
                label="This Month"
                trend={{ value: '+12%', isPositive: true }}
              />
            </View>
          </View>

          {/* Progress Card */}
          <View style={styles.progressSection}>
            <ProgressCard
              title="Monthly Goal"
              current={850}
              total={1000}
              unit="$"
              color="#10B981"
              backgroundColor="#ECFDF5"
              showPercentage={true}
            />
          </View>

          {/* Payment History */}
          <SectionHeader
            icon="history"
            iconColor="#6B7280"
            title="Payment History"
            subtitle={`${paymentHistory.length} transactions`}
            actionLabel="View All"
            actionIcon="arrow-forward"
            onAction={() => console.log('View all payments')}
          />

          <View style={styles.paymentsList}>
            {paymentHistory.map((payment) => (
              <View key={payment.id} style={styles.paymentItem}>
                <ListItemCard
                  image={payment.image}
                  title={payment.campaign}
                  subtitle={payment.date}
                  rightText={`$${payment.amount}`}
                  badge={payment.status === 'paid' ? 'Paid' : 'Pending'}
                  badgeColor={payment.status === 'paid' ? '#10B981' : '#F59E0B'}
                  badgeBackground={payment.status === 'paid' ? '#ECFDF5' : '#FFFBEB'}
                  onPress={() => console.log(`View payment ${payment.id}`)}
                />
              </View>
            ))}
          </View>

          {/* Payout Settings */}
          <View style={styles.settingsSection}>
            <SectionHeader
              icon="settings"
              iconColor="#6B7280"
              title="Payout Settings"
            />
            
            <ListItemCard
              icon="credit-card"
              iconColor="#6366F1"
              iconBackground="#EEF2FF"
              title="Payment Method"
              subtitle="Bank Account •••• 4321"
              onPress={() => console.log('Update payment method')}
            />
            
            <View style={styles.spacer} />
            
            <ListItemCard
              icon="calendar-today"
              iconColor="#8B5CF6"
              iconBackground="#FAF5FF"
              title="Payout Schedule"
              subtitle="Monthly on the 1st"
              onPress={() => console.log('Update payout schedule')}
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statItem: {
    width: '47%',
  },
  progressSection: {
    marginBottom: Spacing.xl,
  },
  paymentsList: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  paymentItem: {
    // Container for each ListItemCard
  },
  settingsSection: {
    marginTop: Spacing.lg,
  },
  spacer: {
    height: Spacing.md,
  },
});

export default EarningsScreen;
