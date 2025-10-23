import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors, Spacing } from '../theme';

interface ProposalCardProps {
  projectTitle: string;
  clientName: string;
  budget: string;
  deadline: string;
  status: 'pending' | 'accepted' | 'rejected' | 'interview';
  submittedDate: string;
  responseTime?: string;
  onPress?: () => void;
}

/**
 * ProposalCard - Display submitted proposals with status
 * Perfect for: Proposals list, bid tracking, application history
 */
const ProposalCard: React.FC<ProposalCardProps> = ({
  projectTitle,
  clientName,
  budget,
  deadline,
  status,
  submittedDate,
  responseTime,
  onPress,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'accepted':
        return { color: '#10B981', bg: '#ECFDF5', icon: 'check-circle', label: 'Accepted' };
      case 'rejected':
        return { color: '#EF4444', bg: '#FEF2F2', icon: 'cancel', label: 'Rejected' };
      case 'interview':
        return { color: '#F59E0B', bg: '#FFFBEB', icon: 'video-call', label: 'Interview' };
      default:
        return { color: '#6366F1', bg: '#EEF2FF', icon: 'schedule', label: 'Pending' };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="description" size={20} color="#6B7280" />
          <Text style={styles.projectTitle} numberOfLines={1}>
            {projectTitle}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
          <Icon name={statusConfig.icon} size={14} color={statusConfig.color} />
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </View>
      </View>

      {/* Client Info */}
      <View style={styles.clientRow}>
        <Icon name="person" size={16} color="#9CA3AF" />
        <Text style={styles.clientName}>{clientName}</Text>
      </View>

      {/* Details Grid */}
      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <Icon name="attach-money" size={18} color="#10B981" />
          <View>
            <Text style={styles.detailLabel}>Budget</Text>
            <Text style={styles.detailValue}>{budget}</Text>
          </View>
        </View>
        <View style={styles.detailItem}>
          <Icon name="schedule" size={18} color="#F59E0B" />
          <View>
            <Text style={styles.detailLabel}>Deadline</Text>
            <Text style={styles.detailValue}>{deadline}</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.submittedDate}>Submitted {submittedDate}</Text>
        {responseTime && (
          <View style={styles.responseTime}>
            <Icon name="timer" size={14} color="#6B7280" />
            <Text style={styles.responseTimeText}>{responseTime}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: Spacing.sm,
  },
  projectTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.md,
  },
  clientName: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  submittedDate: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  responseTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  responseTimeText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
});

export default ProposalCard;
