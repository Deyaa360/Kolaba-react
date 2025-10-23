import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors, Spacing } from '../theme';

interface DeliverableItemProps {
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'submitted' | 'approved' | 'revision';
  dueDate: string;
  fileCount?: number;
  onPress?: () => void;
  onUpload?: () => void;
}

/**
 * DeliverableItem - Track project deliverables and submissions
 * Perfect for: Project tracking, milestone management, file submissions
 */
const DeliverableItem: React.FC<DeliverableItemProps> = ({
  title,
  description,
  status,
  dueDate,
  fileCount,
  onPress,
  onUpload,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'approved':
        return { color: '#10B981', bg: '#ECFDF5', icon: 'check-circle', label: 'Approved' };
      case 'submitted':
        return { color: '#6366F1', bg: '#EEF2FF', icon: 'upload-file', label: 'Submitted' };
      case 'in_progress':
        return { color: '#F59E0B', bg: '#FFFBEB', icon: 'pending', label: 'In Progress' };
      case 'revision':
        return { color: '#EF4444', bg: '#FEF2F2', icon: 'edit', label: 'Needs Revision' };
      default:
        return { color: '#9CA3AF', bg: '#F9FAFB', icon: 'schedule', label: 'Pending' };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {/* Status Indicator */}
      <View style={[styles.statusBar, { backgroundColor: statusConfig.color }]} />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.iconContainer, { backgroundColor: statusConfig.bg }]}>
              <Icon name={statusConfig.icon} size={20} color={statusConfig.color} />
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
                <Text style={[styles.statusText, { color: statusConfig.color }]}>
                  {statusConfig.label}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.dueDateContainer}>
            <Icon name="schedule" size={16} color="#6B7280" />
            <Text style={styles.dueDate}>{dueDate}</Text>
          </View>

          <View style={styles.actions}>
            {fileCount !== undefined && fileCount > 0 && (
              <View style={styles.fileCount}>
                <Icon name="attach-file" size={16} color="#6B7280" />
                <Text style={styles.fileCountText}>{fileCount} files</Text>
              </View>
            )}

            {onUpload && (status === 'pending' || status === 'in_progress' || status === 'revision') && (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={onUpload}
              >
                <Icon name="upload" size={16} color="#6366F1" />
                <Text style={styles.uploadText}>Upload</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statusBar: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
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
    alignItems: 'flex-start',
    gap: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  description: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDate: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  fileCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  fileCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#EEF2FF',
    borderRadius: 6,
  },
  uploadText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6366F1',
  },
});

export default DeliverableItem;
