import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import supabaseService from '../services/supabase';

/**
 * Auth Context Types
 */
interface UserProfile {
  id: string;
  auth_id: string;
  email: string;
  full_name: string | null;
  user_type: string;
  created_at: string;
  updated_at: string;
}

interface CreatorProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  bio: string | null;
  categories: string[] | null;
  location: string | null;
  portfolio_url: string | null;
  social_links: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  } | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface UserStats {
  totalApplications: number;
  approvedApplications: number;
  totalEarnings: number;
  completedCampaigns: number;
}

interface AuthContextType {
  // Auth state
  user: User | null;
  userProfile: UserProfile | null;
  creatorProfile: CreatorProfile | null;
  stats: UserStats | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData?: any) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshStats: () => Promise<void>;
  updateCreatorProfile: (data: Partial<CreatorProfile>) => Promise<void>;
}

/**
 * Create Auth Context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider Component
 * Manages authentication state and user data centrally
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();

    // Listen for auth state changes
    const { data: authListener } = supabaseService.client.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          await loadUserData(session.user);
        } else {
          setUser(null);
          setUserProfile(null);
          setCreatorProfile(null);
          setStats(null);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  /**
   * Initialize authentication state
   */
  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      const session = await supabaseService.getSession();
      
      if (session?.user) {
        setUser(session.user);
        await loadUserData(session.user);
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Load all user-related data
   */
  const loadUserData = async (currentUser: User) => {
    try {
      // Load user profile
      const profile = await supabaseService.getUserProfile();
      setUserProfile(profile);

      // Load creator profile
      const creator = await supabaseService.getCreatorProfile();
      setCreatorProfile(creator);

      // Load stats
      const userStats = await supabaseService.getUserStats();
      setStats(userStats);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  /**
   * Sign in user
   */
  const signIn = async (email: string, password: string) => {
    try {
      const { user: signedInUser } = await supabaseService.signIn(email, password);
      setUser(signedInUser);
      await loadUserData(signedInUser);
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    }
  };

  /**
   * Sign up new user
   */
  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      const { user: newUser } = await supabaseService.signUp(email, password, userData);
      if (newUser) {
        setUser(newUser);
        await loadUserData(newUser);
      }
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    }
  };

  /**
   * Sign out user
   */
  const signOut = async () => {
    try {
      await supabaseService.signOut();
      setUser(null);
      setUserProfile(null);
      setCreatorProfile(null);
      setStats(null);
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  };

  /**
   * Refresh user profile data
   */
  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      const profile = await supabaseService.getUserProfile();
      setUserProfile(profile);

      const creator = await supabaseService.getCreatorProfile();
      setCreatorProfile(creator);
    } catch (error) {
      console.error('Failed to refresh profile:', error);
      throw error;
    }
  };

  /**
   * Refresh user stats
   */
  const refreshStats = async () => {
    if (!user) return;
    
    try {
      const userStats = await supabaseService.getUserStats();
      setStats(userStats);
    } catch (error) {
      console.error('Failed to refresh stats:', error);
      throw error;
    }
  };

  /**
   * Update creator profile
   */
  const updateCreatorProfile = async (data: Partial<CreatorProfile>) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      await supabaseService.createOrUpdateCreatorProfile(data as any);
      await refreshProfile();
    } catch (error) {
      console.error('Failed to update creator profile:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    creatorProfile,
    stats,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
    refreshStats,
    updateCreatorProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use auth context
 * @throws Error if used outside AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;
