import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import supabaseService from '../services/supabase';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../theme';

const ProductDetailsScreen = ({ route, navigation }: any) => {
  const { productId } = route.params;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProductDetails();
  }, [productId]);

  const loadProductDetails = async () => {
    try {
      setLoading(true);
      const productData = await supabaseService.getProductById(productId);
      
      if (!productData) {
        Alert.alert('Error', 'Product not found');
        navigation.goBack();
        return;
      }

      setProduct(productData);
    } catch (error) {
      console.error('Error loading product details:', error);
      Alert.alert('Error', 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const openProductWebsite = async () => {
    if (!product?.website) return;
    
    let url = product.website;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open product link');
      }
    } catch (error) {
      console.error('Error opening product link:', error);
      Alert.alert('Error', 'Failed to open product link');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading product details...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="inventory-2" size={64} color={Colors.textSecondary} />
        <Text style={styles.errorText}>Product not found</Text>
        <TouchableOpacity style={styles.errorButton} onPress={() => navigation.goBack()}>
          <Text style={styles.errorButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Product Image */}
      {product.photo_url && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.photo_url }}
            style={styles.productImage}
            resizeMode="cover"
            onError={() => console.log('Failed to load product image')}
          />
        </View>
      )}

      {!product.photo_url && (
        <View style={styles.imagePlaceholder}>
          <Icon name="inventory-2" size={80} color={Colors.textSecondary} />
        </View>
      )}

      {/* Product Header */}
      <View style={styles.header}>
        <Text style={styles.productName}>{product.name}</Text>
        {product.value && (
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Product Value</Text>
            <Text style={styles.priceValue}>${parseFloat(product.value).toFixed(2)}</Text>
          </View>
        )}
      </View>

      {/* Product Description */}
      {product.description && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="description" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Description</Text>
          </View>
          <Text style={styles.descriptionText}>{product.description}</Text>
        </View>
      )}

      {/* How to Use */}
      {product.how_to_use && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="lightbulb-outline" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>How to Use</Text>
          </View>
          <View style={styles.howToUseBox}>
            <Text style={styles.howToUseText}>{product.how_to_use}</Text>
          </View>
        </View>
      )}

      {/* Product Website Button */}
      {product.website && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.websiteButton}
            onPress={openProductWebsite}
          >
            <Text style={styles.websiteButtonText}>View Product Website</Text>
            <Icon name="open-in-new" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}

      <View style={{ height: Spacing.xl }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.xl,
  },
  errorText: {
    marginTop: Spacing.lg,
    fontSize: Typography.fontSize.lg,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  errorButton: {
    marginTop: Spacing.xl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
  },
  errorButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: Colors.background,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: 300,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: Colors.white,
    padding: Spacing.xl,
  },
  productName: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.success + '10',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  priceLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },
  priceValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.success,
  },
  section: {
    backgroundColor: Colors.white,
    padding: Spacing.xl,
    marginTop: Spacing.md,
    ...Shadow.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginLeft: Spacing.sm,
  },
  descriptionText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  howToUseBox: {
    backgroundColor: Colors.primaryLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  howToUseText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    lineHeight: 24,
  },
  infoSection: {
    backgroundColor: Colors.white,
    padding: Spacing.xl,
    marginTop: Spacing.md,
    ...Shadow.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  infoLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textSecondary,
    width: 100,
  },
  infoValue: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.text,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.xl,
  },
  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    ...Shadow.md,
  },
  websiteButtonText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: '#FFFFFF',
  },
});

export default ProductDetailsScreen;
