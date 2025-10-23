import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors, Spacing } from '../theme';

interface SkillBadgeProps {
  skill: string;
  level?: 'beginner' | 'intermediate' | 'expert';
  verified?: boolean;
  endorsements?: number;
  removable?: boolean;
  onRemove?: () => void;
  onPress?: () => void;
}

/**
 * SkillBadge - Display skills with levels and verification
 * Perfect for: Profile skills, expertise showcase, skill filtering
 */
const SkillBadge: React.FC<SkillBadgeProps> = ({
  skill,
  level,
  verified = false,
  endorsements,
  removable = false,
  onRemove,
  onPress,
}) => {
  const getLevelConfig = () => {
    switch (level) {
      case 'expert':
        return { color: '#10B981', bg: '#ECFDF5', label: 'Expert' };
      case 'intermediate':
        return { color: '#F59E0B', bg: '#FFFBEB', label: 'Intermediate' };
      case 'beginner':
        return { color: '#6366F1', bg: '#EEF2FF', label: 'Beginner' };
      default:
        return null;
    }
  };

  const levelConfig = level ? getLevelConfig() : null;

  return onPress ? (
    <TouchableOpacity
      style={[
        styles.container,
        verified && styles.containerVerified,
        levelConfig && { borderColor: levelConfig.color },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={styles.skillText}>{skill}</Text>
        
        {verified && (
          <Icon name="verified" size={14} color="#10B981" style={styles.verifiedIcon} />
        )}

        {endorsements !== undefined && endorsements > 0 && (
          <View style={styles.endorsementBadge}>
            <Text style={styles.endorsementText}>{endorsements}</Text>
          </View>
        )}
      </View>

      {levelConfig && (
        <View style={[styles.levelBadge, { backgroundColor: levelConfig.bg }]}>
          <Text style={[styles.levelText, { color: levelConfig.color }]}>
            {levelConfig.label}
          </Text>
        </View>
      )}

      {removable && onRemove && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={onRemove}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="close" size={14} color="#6B7280" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  ) : (
    <View
      style={[
        styles.container,
        verified && styles.containerVerified,
        levelConfig && { borderColor: levelConfig.color },
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.skillText}>{skill}</Text>
        
        {verified && (
          <Icon name="verified" size={14} color="#10B981" style={styles.verifiedIcon} />
        )}

        {endorsements !== undefined && endorsements > 0 && (
          <View style={styles.endorsementBadge}>
            <Text style={styles.endorsementText}>{endorsements}</Text>
          </View>
        )}
      </View>

      {levelConfig && (
        <View style={[styles.levelBadge, { backgroundColor: levelConfig.bg }]}>
          <Text style={[styles.levelText, { color: levelConfig.color }]}>
            {levelConfig.label}
          </Text>
        </View>
      )}

      {removable && onRemove && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={onRemove}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="close" size={14} color="#6B7280" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  containerVerified: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  skillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  verifiedIcon: {
    marginLeft: 2,
  },
  endorsementBadge: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 20,
    alignItems: 'center',
  },
  endorsementText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  levelText: {
    fontSize: 10,
    fontWeight: '700',
  },
  removeButton: {
    marginLeft: 4,
    padding: 2,
  },
});

export default SkillBadge;
