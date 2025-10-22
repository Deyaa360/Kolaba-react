import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import RichTextRenderer from './RichTextRenderer';

interface ContentPackageCardProps {
  packageData: {
    package_title: string;
    quantity: number;
    instructions?: string;
    content_format?: string;
    products?: any[];
  };
  onProductPress?: (productId: string) => void;
}

const ContentPackageCard: React.FC<ContentPackageCardProps> = ({
  packageData,
  onProductPress,
}) => {
  const [expanded, setExpanded] = useState(false);
  const { package_title, quantity, instructions, content_format, products } = packageData;

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={styles.titleRow}>
          <Text style={styles.title}>{package_title}</Text>
          <View style={styles.quantityBadge}>
            <Text style={styles.quantityText}>x{quantity}</Text>
          </View>
        </View>
        <Icon
          name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={24}
          color={Colors.textSecondary}
        />
      </TouchableOpacity>

      {/* Expanded Content */}
      {expanded && (
        <View style={styles.content}>
          {/* Products */}
          {products && products.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Products</Text>
              {products.map((product: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  style={styles.productLink}
                  onPress={() => onProductPress && onProductPress(product.id)}
                >
                  <Text style={styles.productLinkText} numberOfLines={1}>
                    {product.product_name || 'Product'}
                  </Text>
                  <Icon name="chevron-right" size={20} color={Colors.primary} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Instructions */}
          {instructions && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Instructions</Text>
              <RichTextRenderer content={instructions} maxLines={4} />
            </View>
          )}

          {/* Additional Details */}
          <View style={styles.detailsRow}>
            {products && products.length > 0 && (
              <View style={styles.detailItem}>
                <Icon name="inventory-2" size={16} color={Colors.textSecondary} />
                <Text style={styles.detailText}>
                  {products.length} product{products.length > 1 ? 's' : ''} included
                </Text>
              </View>
            )}
            {content_format && (
              <View style={styles.detailItem}>
                <Icon name="aspect-ratio" size={16} color={Colors.textSecondary} />
                <Text style={styles.detailText}>
                  {content_format.replace(/_/g, ' ')}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Spacing.md,
  },
  title: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    flex: 1,
  },
  quantityBadge: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginLeft: Spacing.sm,
  },
  quantityText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  section: {
    marginTop: Spacing.md,
  },
  sectionLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  productLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
  },
  productLinkText: {
    fontSize: Typography.fontSize.base,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
    flex: 1,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.md,
    gap: Spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  detailText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
});

export default ContentPackageCard;
