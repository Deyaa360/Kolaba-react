import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';
import { Colors, Spacing } from '../theme';

/**
 * Orders/Projects Screen - Clean design with scrollable title
 */
const OrdersScreen = ({ navigation }: any) => {
  const [selectedTab, setSelectedTab] = React.useState<'active' | 'completed' | 'pending'>('active');

  const [activeProjects] = React.useState([
    {
      id: '1',
      name: 'Summer Fashion Campaign',
      brand: 'Fashion Brand Co.',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
      status: 'in_progress',
      progress: 65,
      dueDate: 'Due in 5 days',
      dueDateShort: '5 days',
      amount: 500,
      deliverables: 3,
      completed: 2,
      priority: 'high',
    },
    {
      id: '2',
      name: 'Tech Product Review',
      brand: 'Tech Innovators Inc.',
      image: 'https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?w=400',
      status: 'review',
      progress: 90,
      dueDate: 'Due in 2 days',
      dueDateShort: '2 days',
      amount: 850,
      deliverables: 2,
      completed: 2,
      priority: 'high',
    },
    {
      id: '3',
      name: 'Fitness Challenge Series',
      brand: 'FitLife Brand',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
      status: 'revision',
      progress: 75,
      dueDate: 'Due tomorrow',
      dueDateShort: '1 day',
      amount: 600,
      deliverables: 4,
      completed: 3,
      priority: 'medium',
    },
  ]);

  const [completedProjects] = React.useState([
    {
      id: '4',
      name: 'Beauty Product Launch',
      brand: 'Glow Cosmetics',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
      status: 'completed',
      progress: 100,
      dueDate: 'Completed',
      dueDateShort: 'Done',
      amount: 1200,
      deliverables: 5,
      completed: 5,
      priority: 'high',
    },
  ]);

  const [pendingProjects] = React.useState([
    {
      id: '5',
      name: 'Travel Destination Showcase',
      brand: 'Wanderlust Travel',
      image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400',
      status: 'pending',
      progress: 0,
      dueDate: 'Not started',
      dueDateShort: 'Pending',
      amount: 950,
      deliverables: 3,
      completed: 0,
      priority: 'low',
    },
  ]);

  const projects = [...activeProjects, ...completedProjects, ...pendingProjects];

  const filteredProjects = projects.filter(p => 
    selectedTab === 'active' ? p.status !== 'completed' && p.status !== 'pending' :
    selectedTab === 'completed' ? p.status === 'completed' :
    p.status === 'pending'
  );

  const totalActive = activeProjects.length;
  const totalCompleted = completedProjects.length;
  const totalPending = pendingProjects.length;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'in_progress':
        return { color: '#6366F1', bg: '#EEF2FF', label: 'In Progress', icon: 'pending' };
      case 'review':
        return { color: '#F59E0B', bg: '#FFFBEB', label: 'Under Review', icon: 'rate-review' };
      case 'revision':
        return { color: '#EF4444', bg: '#FEF2F2', label: 'Needs Revision', icon: 'edit' };
      case 'awaiting_payment':
        return { color: '#8B5CF6', bg: '#FAF5FF', label: 'Awaiting Payment', icon: 'schedule' };
      default:
        return { color: '#10B981', bg: '#ECFDF5', label: 'Completed', icon: 'check-circle' };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const renderProjectCard = (project: typeof projects[0]) => {
    const statusConfig = getStatusConfig(project.status);
    const progressPercent = Math.round(project.progress);

    return (
      <TouchableOpacity
        key={project.id}
        style={styles.projectCard}
        activeOpacity={0.7}
        onPress={() => console.log(`View project ${project.id}`)}
      >
        {/* Project Image & Priority */}
        <View style={styles.projectImageContainer}>
          <FastImage
            source={{ uri: project.image }}
            style={styles.projectImage}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(project.priority) }]}>
            <Icon name="flag" size={12} color="#FFFFFF" />
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.color }]}>
            <Icon name={statusConfig.icon} size={14} color="#FFFFFF" />
            <Text style={styles.statusBadgeText}>{statusConfig.label}</Text>
          </View>
        </View>

        {/* Project Info */}
        <View style={styles.projectInfo}>
          <View style={styles.projectHeader}>
            <View style={styles.projectHeaderLeft}>
              <Text style={styles.projectName} numberOfLines={1}>
                {project.name}
              </Text>
              <View style={styles.brandRow}>
                <Icon name="business" size={14} color="#6B7280" />
                <Text style={styles.brandName}>{project.brand}</Text>
              </View>
            </View>
            <View style={styles.projectAmount}>
              <Text style={styles.amountValue}>${project.amount}</Text>
            </View>
          </View>

          {/* Progress Section */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progress</Text>
              <Text style={styles.progressValue}>{progressPercent}%</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { 
                    width: `${progressPercent}%`,
                    backgroundColor: statusConfig.color 
                  }
                ]} 
              />
            </View>
            <View style={styles.deliverablesRow}>
              <Icon name="assignment" size={14} color="#6B7280" />
              <Text style={styles.deliverablesText}>
                {project.completed} of {project.deliverables} deliverables completed
              </Text>
            </View>
          </View>

          {/* Action Section */}
          <View style={styles.actionSection}>
            <View style={styles.dueDateRow}>
              <Icon name="schedule" size={16} color="#6B7280" />
              <Text style={styles.dueDate}>{project.dueDateShort}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.submitButton, { backgroundColor: statusConfig.color }]}
              onPress={() => console.log(`Submit project ${project.id}`)}
            >
              <Icon name="send" size={16} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Page Title - Scrolls with content */}
        <Text style={styles.pageTitle}>My Projects</Text>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'active' && styles.tabActive]}
            onPress={() => setSelectedTab('active')}
          >
            <Icon 
              name="work" 
              size={18} 
              color={selectedTab === 'active' ? '#FFFFFF' : '#6B7280'} 
            />
            <Text style={[styles.tabText, selectedTab === 'active' && styles.tabTextActive]}>
              Active
            </Text>
            <View style={[styles.tabBadge, selectedTab === 'active' && styles.tabBadgeActive]}>
              <Text style={[styles.tabBadgeText, selectedTab === 'active' && styles.tabBadgeTextActive]}>
                {totalActive}
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'completed' && styles.tabActive]}
            onPress={() => setSelectedTab('completed')}
          >
            <Icon 
              name="check-circle" 
              size={18} 
              color={selectedTab === 'completed' ? '#FFFFFF' : '#6B7280'} 
            />
            <Text style={[styles.tabText, selectedTab === 'completed' && styles.tabTextActive]}>
              Completed
            </Text>
            <View style={[styles.tabBadge, selectedTab === 'completed' && styles.tabBadgeActive]}>
              <Text style={[styles.tabBadgeText, selectedTab === 'completed' && styles.tabBadgeTextActive]}>
                {totalCompleted}
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'pending' && styles.tabActive]}
            onPress={() => setSelectedTab('pending')}
          >
            <Icon 
              name="schedule" 
              size={18} 
              color={selectedTab === 'pending' ? '#FFFFFF' : '#6B7280'} 
            />
            <Text style={[styles.tabText, selectedTab === 'pending' && styles.tabTextActive]}>
              Pending
            </Text>
            <View style={[styles.tabBadge, selectedTab === 'pending' && styles.tabBadgeActive]}>
              <Text style={[styles.tabBadgeText, selectedTab === 'pending' && styles.tabBadgeTextActive]}>
                {totalPending}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Projects List */}
        {filteredProjects.map(project => renderProjectCard(project))}

        {/* Bottom Spacing */}
        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
    marginBottom: Spacing.md,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 6,
  },
  tabActive: {
    backgroundColor: '#6366F1',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  tabBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  tabBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
  },
  tabBadgeTextActive: {
    color: '#FFFFFF',
  },
  projectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  projectImageContainer: {
    position: 'relative',
    height: 180,
  },
  projectImage: {
    width: '100%',
    height: '100%',
  },
  priorityBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  projectInfo: {
    padding: Spacing.md,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  projectHeaderLeft: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  brandName: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  projectAmount: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  amountValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#10B981',
  },
  progressSection: {
    marginBottom: Spacing.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  deliverablesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deliverablesText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  actionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDate: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default OrdersScreen;
