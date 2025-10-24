/**
 * Cache Utility Service
 * Wrapper around AsyncStorage for offline data caching
 * Provides automatic serialization/deserialization and TTL support
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl?: number; // Time to live in milliseconds
}

/**
 * Cache Service
 */
class CacheService {
  private prefix = '@kolaba_cache:';

  /**
   * Get full cache key with prefix
   */
  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * Set cached data
   * @param key - Cache key
   * @param data - Data to cache
   * @param ttl - Time to live in milliseconds (optional)
   */
  async set<T>(key: string, data: T, ttl?: number): Promise<void> {
    try {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        ttl,
      };
      
      const serialized = JSON.stringify(cacheItem);
      await AsyncStorage.setItem(this.getKey(key), serialized);
    } catch (error) {
      console.error(`Failed to set cache for key "${key}":`, error);
    }
  }

  /**
   * Get cached data
   * @param key - Cache key
   * @returns Cached data or null if not found or expired
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const serialized = await AsyncStorage.getItem(this.getKey(key));
      
      if (!serialized) {
        return null;
      }

      const cacheItem: CacheItem<T> = JSON.parse(serialized);

      // Check if cache has expired
      if (cacheItem.ttl) {
        const age = Date.now() - cacheItem.timestamp;
        if (age > cacheItem.ttl) {
          // Cache expired, remove it
          await this.remove(key);
          return null;
        }
      }

      return cacheItem.data;
    } catch (error) {
      console.error(`Failed to get cache for key "${key}":`, error);
      return null;
    }
  }

  /**
   * Remove cached data
   * @param key - Cache key
   */
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.error(`Failed to remove cache for key "${key}":`, error);
    }
  }

  /**
   * Clear all cached data with our prefix
   */
  async clearAll(): Promise<void> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const ourKeys = allKeys.filter(key => key.startsWith(this.prefix));
      await AsyncStorage.multiRemove(ourKeys);
    } catch (error) {
      console.error('Failed to clear all cache:', error);
    }
  }

  /**
   * Check if cache exists and is valid
   * @param key - Cache key
   * @returns True if cache exists and is not expired
   */
  async has(key: string): Promise<boolean> {
    const data = await this.get(key);
    return data !== null;
  }

  /**
   * Get or fetch pattern
   * Returns cached data if available, otherwise fetches fresh data
   * @param key - Cache key
   * @param fetchFn - Function to fetch fresh data
   * @param ttl - Time to live for cached data
   * @returns Data (from cache or fresh fetch)
   */
  async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    // Try to get from cache first
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Cache miss, fetch fresh data
    const fresh = await fetchFn();
    
    // Cache the fresh data
    await this.set(key, fresh, ttl);
    
    return fresh;
  }
}

// Export singleton instance
export const cache = new CacheService();

/**
 * Cache keys for common data
 * Centralize cache keys to avoid typos and ensure consistency
 */
export const CACHE_KEYS = {
  // User data
  USER_PROFILE: 'user_profile',
  CREATOR_PROFILE: 'creator_profile',
  USER_STATS: 'user_stats',
  
  // Campaigns
  CAMPAIGNS_LIST: 'campaigns_list',
  CAMPAIGN_DETAILS: (id: string) => `campaign_${id}`,
  
  // Applications
  MY_APPLICATIONS: 'my_applications',
  ACTIVE_COLLABORATIONS: 'active_collaborations',
  
  // Products
  PRODUCT_DETAILS: (id: string) => `product_${id}`,
};

/**
 * Cache TTL constants (in milliseconds)
 */
export const CACHE_TTL = {
  ONE_MINUTE: 60 * 1000,
  FIVE_MINUTES: 5 * 60 * 1000,
  TEN_MINUTES: 10 * 60 * 1000,
  THIRTY_MINUTES: 30 * 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
};

export default cache;
