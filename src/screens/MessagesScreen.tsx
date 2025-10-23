import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';
import { Colors, Spacing } from '../theme';

/**
 * Messages Screen - Clean design with scrollable title
 */
const MessagesScreen = ({ navigation }: any) => {
  const [selectedTab, setSelectedTab] = React.useState<'all' | 'unread' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  const unreadCount = 2;

  const conversations = [
    {
      id: '1',
      brandName: 'Fashion Brand Co.',
      brandImage: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=100',
      lastMessage: 'Great! Looking forward to your content submission.',
      timestamp: '2m ago',
      unread: true,
      unreadCount: 2,
    },
    {
      id: '2',
      brandName: 'Tech Innovators Inc.',
      brandImage: 'https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?w=100',
      lastMessage: 'The draft looks perfect. Approved!',
      timestamp: '1h ago',
      unread: false,
      unreadCount: 0,
    },
    {
      id: '3',
      brandName: 'FitLife Brand',
      brandImage: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=100',
      lastMessage: 'Could you provide a revised version?',
      timestamp: '3h ago',
      unread: false,
      unreadCount: 0,
    },
  ];

  const renderConversation = (conversation: typeof conversations[0]) => {
    return (
      <TouchableOpacity
        key={conversation.id}
        style={[styles.conversationCard, conversation.unread && styles.conversationUnread]}
        activeOpacity={0.7}
        onPress={() => console.log(`Open conversation ${conversation.id}`)}
      >
        <View style={styles.avatarContainer}>
          <FastImage
            source={{ uri: conversation.brandImage }}
            style={styles.avatar}
            resizeMode={FastImage.resizeMode.cover}
          />
          {conversation.unread && <View style={styles.unreadDot} />}
        </View>

        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={[styles.brandName, conversation.unread && styles.brandNameUnread]}>
              {conversation.brandName}
            </Text>
            <Text style={styles.timestamp}>{conversation.timestamp}</Text>
          </View>
          <View style={styles.messageRow}>
            <Text 
              style={[styles.lastMessage, conversation.unread && styles.lastMessageUnread]} 
              numberOfLines={1}
            >
              {conversation.lastMessage}
            </Text>
            {conversation.unread && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{conversation.unreadCount}</Text>
              </View>
            )}
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
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Messages</Text>
          {unreadCount > 0 && (
            <View style={styles.titleBadge}>
              <Text style={styles.titleBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'all' && styles.tabActive]}
            onPress={() => setSelectedTab('all')}
          >
            <Icon 
              name="forum" 
              size={18} 
              color={selectedTab === 'all' ? '#FFFFFF' : '#6B7280'} 
            />
            <Text style={[styles.tabText, selectedTab === 'all' && styles.tabTextActive]}>
              All
            </Text>
            <View style={[styles.tabBadge, selectedTab === 'all' && styles.tabBadgeActive]}>
              <Text style={[styles.tabBadgeText, selectedTab === 'all' && styles.tabBadgeTextActive]}>
                5
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'unread' && styles.tabActive]}
            onPress={() => setSelectedTab('unread')}
          >
            <Icon 
              name="mark-email-unread" 
              size={18} 
              color={selectedTab === 'unread' ? '#FFFFFF' : '#6B7280'} 
            />
            <Text style={[styles.tabText, selectedTab === 'unread' && styles.tabTextActive]}>
              Unread
            </Text>
            <View style={[styles.tabBadge, selectedTab === 'unread' && styles.tabBadgeActive]}>
              <Text style={[styles.tabBadgeText, selectedTab === 'unread' && styles.tabBadgeTextActive]}>
                2
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'archived' && styles.tabActive]}
            onPress={() => setSelectedTab('archived')}
          >
            <Icon 
              name="archive" 
              size={18} 
              color={selectedTab === 'archived' ? '#FFFFFF' : '#6B7280'} 
            />
            <Text style={[styles.tabText, selectedTab === 'archived' && styles.tabTextActive]}>
              Archived
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => console.log('Contact Brands')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#EEF2FF' }]}>
              <Icon name="business" size={24} color="#6366F1" />
            </View>
            <Text style={styles.quickActionTitle}>Contact Brands</Text>
            <Text style={styles.quickActionSubtitle}>Find opportunities</Text>
            <Icon name="arrow-forward" size={20} color="#6B7280" style={styles.quickActionArrow} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => console.log('Get Support')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#ECFDF5' }]}>
              <Icon name="support-agent" size={24} color="#10B981" />
            </View>
            <Text style={styles.quickActionTitle}>Get Support</Text>
            <Text style={styles.quickActionSubtitle}>We're here to help</Text>
            <Icon name="arrow-forward" size={20} color="#6B7280" style={styles.quickActionArrow} />
          </TouchableOpacity>
        </View>

        {/* Platform Tip */}
        <View style={styles.tipCard}>
          <View style={styles.tipIcon}>
            <Icon name="info" size={20} color="#6366F1" />
          </View>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Stay Professional</Text>
            <Text style={styles.tipText}>
              Keep all communication within the platform to ensure protection and support.
            </Text>
          </View>
        </View>

        {/* Conversations List */}
        {conversations.map(conversation => renderConversation(conversation))}

        {/* Bottom Spacing */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => console.log('New message')}
        activeOpacity={0.8}
      >
        <Icon name="edit" size={24} color="#FFFFFF" />
      </TouchableOpacity>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.md,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  titleBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    marginLeft: 8,
    padding: 0,
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
  quickActionsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  quickActionArrow: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    gap: 12,
  },
  tipIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: '#3B82F6',
    lineHeight: 18,
  },
  conversationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  conversationUnread: {
    borderLeftWidth: 3,
    borderLeftColor: '#6366F1',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3F4F6',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  brandName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  brandNameUnread: {
    fontWeight: '800',
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
  },
  lastMessageUnread: {
    color: '#111827',
    fontWeight: '600',
  },
  unreadBadge: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default MessagesScreen;
