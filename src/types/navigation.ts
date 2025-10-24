/**
 * Navigation Types
 * Type-safe navigation parameter definitions for all screens
 */

import { NavigationProp as RNNavigationProp, RouteProp } from '@react-navigation/native';

/**
 * Root Stack Parameter List
 * Defines all screens and their required parameters
 */
export type RootStackParamList = {
  // Auth screens
  Login: undefined;
  Signup: undefined;
  
  // Main tab navigator
  MainTabs: undefined;
  
  // Tab screens
  Dashboard: undefined;
  Campaigns: undefined;
  Orders: undefined;
  Messages: undefined;
  Settings: undefined;
  
  // Detail screens
  CampaignDetails: {
    campaignId: string;
  };
  ProductDetails: {
    productId: string;
  };
  Profile: {
    userId?: string;
  };
  Notifications: undefined;
  Earnings: undefined;
  ContentLibrary: undefined;
  Reviews: undefined;
  
  // Dev/showcase screens
  ComponentsShowcase: undefined;
};

/**
 * Navigation prop type helper
 * Use this for navigation prop in screens
 * 
 * @example
 * ```tsx
 * const navigation = useNavigation<NavigationProp>();
 * navigation.navigate('CampaignDetails', { campaignId: '123' });
 * ```
 */
export type NavigationProp = RNNavigationProp<RootStackParamList>;

/**
 * Route prop type helper
 * Use this for route prop in screens
 * 
 * @example
 * ```tsx
 * const route = useRoute<ScreenRouteProp<'CampaignDetails'>>();
 * const { campaignId } = route.params;
 * ```
 */
export type ScreenRouteProp<T extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  T
>;

/**
 * Screen props type helper
 * Combines navigation and route props
 * 
 * @example
 * ```tsx
 * const CampaignDetailsScreen: React.FC<ScreenProps<'CampaignDetails'>> = ({
 *   navigation,
 *   route
 * }) => {
 *   const { campaignId } = route.params;
 *   // ...
 * };
 * ```
 */
export type ScreenProps<T extends keyof RootStackParamList> = {
  navigation: RNNavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
};
