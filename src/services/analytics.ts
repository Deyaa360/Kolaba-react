/**
 * Analytics Service
 * Centralized analytics tracking for the app
 * Ready to integrate with Firebase Analytics or other providers
 */

/**
 * Analytics event types
 */
export type AnalyticsEvent =
  | 'screen_view'
  | 'campaign_viewed'
  | 'campaign_applied'
  | 'profile_updated'
  | 'login'
  | 'signup'
  | 'logout'
  | 'error_occurred'
  | 'search_performed'
  | 'filter_applied'
  | 'content_submitted'
  | 'notification_opened';

/**
 * Analytics Service Class
 */
class AnalyticsService {
  private isEnabled: boolean = true;

  /**
   * Initialize analytics
   * Call this in App.tsx on mount
   */
  initialize(): void {
    // TODO: Initialize Firebase Analytics or other provider
    // import analytics from '@react-native-firebase/analytics';
    // await analytics().setAnalyticsCollectionEnabled(true);
    
    console.log('[Analytics] Service initialized');
  }

  /**
   * Enable or disable analytics tracking
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    console.log(`[Analytics] Tracking ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Log a screen view
   * @param screenName - Name of the screen
   */
  logScreenView(screenName: string): void {
    if (!this.isEnabled) return;

    console.log('[Analytics] Screen view:', screenName);
    
    // TODO: Implement Firebase Analytics
    // analytics().logScreenView({
    //   screen_name: screenName,
    //   screen_class: screenName,
    // });
  }

  /**
   * Log a custom event
   * @param eventName - Name of the event
   * @param params - Event parameters
   */
  logEvent(eventName: AnalyticsEvent, params?: Record<string, any>): void {
    if (!this.isEnabled) return;

    console.log('[Analytics] Event:', eventName, params);
    
    // TODO: Implement Firebase Analytics
    // analytics().logEvent(eventName, params);
  }

  /**
   * Log user login
   * @param method - Login method (email, google, etc.)
   */
  logLogin(method: string = 'email'): void {
    this.logEvent('login', { method });
  }

  /**
   * Log user signup
   * @param method - Signup method (email, google, etc.)
   */
  logSignup(method: string = 'email'): void {
    this.logEvent('signup', { method });
  }

  /**
   * Log campaign view
   * @param campaignId - ID of the campaign
   * @param campaignTitle - Title of the campaign
   */
  logCampaignView(campaignId: string, campaignTitle?: string): void {
    this.logEvent('campaign_viewed', {
      campaign_id: campaignId,
      campaign_title: campaignTitle,
    });
  }

  /**
   * Log campaign application
   * @param campaignId - ID of the campaign
   */
  logCampaignApply(campaignId: string): void {
    this.logEvent('campaign_applied', {
      campaign_id: campaignId,
    });
  }

  /**
   * Log search performed
   * @param searchQuery - Search query string
   * @param resultsCount - Number of results
   */
  logSearch(searchQuery: string, resultsCount: number): void {
    this.logEvent('search_performed', {
      search_term: searchQuery,
      results_count: resultsCount,
    });
  }

  /**
   * Log filter applied
   * @param filterType - Type of filter
   * @param filterValue - Filter value
   */
  logFilter(filterType: string, filterValue: string): void {
    this.logEvent('filter_applied', {
      filter_type: filterType,
      filter_value: filterValue,
    });
  }

  /**
   * Log error occurred
   * @param errorMessage - Error message
   * @param errorContext - Context where error occurred
   */
  logError(errorMessage: string, errorContext?: string): void {
    this.logEvent('error_occurred', {
      error_message: errorMessage,
      error_context: errorContext,
    });
  }

  /**
   * Set user ID for tracking
   * @param userId - User ID
   */
  setUserId(userId: string | null): void {
    if (!this.isEnabled) return;

    console.log('[Analytics] User ID set:', userId);
    
    // TODO: Implement Firebase Analytics
    // if (userId) {
    //   analytics().setUserId(userId);
    // }
  }

  /**
   * Set user properties
   * @param properties - User properties
   */
  setUserProperties(properties: Record<string, any>): void {
    if (!this.isEnabled) return;

    console.log('[Analytics] User properties set:', properties);
    
    // TODO: Implement Firebase Analytics
    // Object.entries(properties).forEach(([key, value]) => {
    //   analytics().setUserProperty(key, value);
    // });
  }
}

// Export singleton instance
export const analytics = new AnalyticsService();

export default analytics;
