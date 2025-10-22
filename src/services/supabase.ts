// Supabase Client Service
// Handles all backend communication

import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config/supabase';

class SupabaseService {
  private static instance: SupabaseService;
  public client: SupabaseClient;

  private constructor() {
    this.client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  }

  public static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  // Auth methods
  async signUp(email: string, password: string, userData?: any) {
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_type: 'creator',
          ...userData,
        },
      },
    });
    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    // Check if user is a creator
    if (data.user?.user_metadata?.user_type !== 'creator') {
      await this.signOut();
      throw new Error('This app is for creators only. Please use the brand portal.');
    }

    return data;
  }

  async signOut() {
    const { error } = await this.client.auth.signOut();
    if (error) throw error;
  }

  async resetPassword(email: string) {
    const { error } = await this.client.auth.resetPasswordForEmail(email);
    if (error) throw error;
  }

  async getCurrentUser(): Promise<User | null> {
    const { data } = await this.client.auth.getUser();
    return data.user;
  }

  async getSession(): Promise<Session | null> {
    const { data } = await this.client.auth.getSession();
    return data.session;
  }

  // User Profile methods
  async getUserProfile() {
    const user = await this.getCurrentUser();
    if (!user) return null;

    const { data, error } = await this.client
      .from('user_profiles')
      .select('*')
      .eq('auth_id', user.id)
      .single();

    if (error) throw error;
    return data;
  }

  async getCreatorProfile() {
    const profile = await this.getUserProfile();
    if (!profile) return null;

    const { data, error } = await this.client
      .from('creator_profiles')
      .select('*')
      .eq('user_id', profile.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  // Campaigns methods
  async getCampaigns(limit = 20, status = 'active') {
    const { data, error } = await this.client
      .from('campaigns')
      .select(`
        *,
        brands (
          id,
          brand_name,
          logo_url,
          website,
          instagram_handle,
          tiktok_handle,
          description
        ),
        campaign_content_packages (
          id,
          title,
          content_type,
          product_ids,
          quantity_needed,
          instructions
        )
      `)
      .eq('status', status)
      .eq('recruitment_type', 'public')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  async getCampaignById(id: string) {
    const { data, error} = await this.client
      .from('campaigns')
      .select(`
        *,
        brands (
          id,
          brand_name,
          logo_url,
          website,
          instagram_handle,
          tiktok_handle,
          description
        ),
        campaign_content_packages (
          id,
          title,
          content_type,
          product_ids,
          crop,
          video_duration,
          video_crop,
          instructions,
          reference_files,
          display_order,
          quantity_needed
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    // Fetch products for this campaign
    if (data) {
      const { data: campaignProducts, error: productsError } = await this.client
        .from('campaign_products')
        .select(`
          products (
            id,
            name,
            description,
            photo_url,
            website,
            value,
            how_to_use
          )
        `)
        .eq('campaign_id', id);

      if (!productsError && campaignProducts) {
        data.products = campaignProducts.map((cp: any) => cp.products).filter(Boolean);
      }
    }

    return data;
  }

  // Applications methods
  async getCreatorApplications() {
    const profile = await this.getUserProfile();
    if (!profile) return [];

    const { data, error } = await this.client
      .from('applications')
      .select(`
        *,
        campaigns (
          id,
          title,
          description,
          status,
          brands (
            id,
            brand_name,
            logo_url
          )
        )
      `)
      .eq('creator_id', profile.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async submitApplication(campaignId: string, message?: string) {
    const profile = await this.getUserProfile();
    if (!profile) throw new Error('User not authenticated');

    const { data, error } = await this.client
      .from('applications')
      .insert({
        campaign_id: campaignId,
        creator_id: profile.id,
        message,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async hasAppliedToCampaign(campaignId: string): Promise<boolean> {
    const profile = await this.getUserProfile();
    if (!profile) return false;

    const { data, error } = await this.client
      .from('applications')
      .select('id')
      .eq('campaign_id', campaignId)
      .eq('creator_id', profile.id)
      .limit(1);

    if (error) return false;
    return (data?.length || 0) > 0;
  }

  // Stats methods
  async getUserStats() {
    const profile = await this.getUserProfile();
    if (!profile) {
      return {
        totalApplications: 0,
        approvedApplications: 0,
        totalEarnings: 0,
        completedCampaigns: 0,
      };
    }

    const { data: applications } = await this.client
      .from('applications')
      .select('id, status')
      .eq('creator_id', profile.id);

    const totalApplications = applications?.length || 0;
    const approvedApplications = applications?.filter(a => a.status === 'approved').length || 0;

    const { data: submissions } = await this.client
      .from('content_submissions')
      .select('id')
      .eq('creator_id', profile.id)
      .eq('status', 'approved');

    const completedCampaigns = submissions?.length || 0;
    const totalEarnings = completedCampaigns * 50; // Mock calculation

    return {
      totalApplications,
      approvedApplications,
      totalEarnings,
      completedCampaigns,
    };
  }

  // Content Submission methods
  async getContentSubmissions() {
    const profile = await this.getUserProfile();
    if (!profile) return [];

    const { data, error } = await this.client
      .from('content_submissions')
      .select(`
        *,
        campaigns (
          id,
          title,
          brands (
            id,
            brand_name,
            logo_url
          )
        )
      `)
      .eq('creator_id', profile.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async submitContent(campaignId: string, contentData: {
    content_type: string;
    content_urls: string[];
    caption?: string;
    description?: string;
  }) {
    const profile = await this.getUserProfile();
    if (!profile) throw new Error('User not authenticated');

    const { data, error } = await this.client
      .from('content_submissions')
      .insert({
        campaign_id: campaignId,
        creator_id: profile.id,
        ...contentData,
        status: 'submitted',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Product methods
  async getProductById(productId: string) {
    const { data, error } = await this.client
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error) throw error;
    return data;
  }

  async getProductsByCampaign(campaignId: string) {
    const { data, error } = await this.client
      .from('campaign_content_packages')
      .select(`
        *,
        products (*)
      `)
      .eq('campaign_id', campaignId);

    if (error) throw error;
    return data || [];
  }

  // Notifications methods
  async getNotifications() {
    const user = await this.getCurrentUser();
    if (!user) return [];

    const { data, error } = await this.client
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  }

  async markNotificationAsRead(notificationId: string) {
    const { error } = await this.client
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;
  }

  // Creator Profile methods
  async createOrUpdateCreatorProfile(profileData: {
    display_name: string;
    bio?: string;
    categories?: string[];
    location?: string;
    portfolio_url?: string;
    instagram_handle?: string;
    tiktok_handle?: string;
    youtube_handle?: string;
  }) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    // First, get or create user profile
    let userProfile = await this.getUserProfile();
    
    if (!userProfile) {
      const { data: newProfile, error: profileError } = await this.client
        .from('user_profiles')
        .insert({
          auth_id: user.id,
          email: user.email,
          full_name: profileData.display_name,
          user_type: 'creator',
        })
        .select()
        .single();

      if (profileError) throw profileError;
      userProfile = newProfile;
    }

    // Then create or update creator profile
    const { data, error } = await this.client
      .from('creator_profiles')
      .upsert({
        user_id: userProfile.id,
        display_name: profileData.display_name,
        bio: profileData.bio,
        categories: profileData.categories,
        location: profileData.location,
        portfolio_url: profileData.portfolio_url,
        social_links: {
          instagram: profileData.instagram_handle,
          tiktok: profileData.tiktok_handle,
          youtube: profileData.youtube_handle,
        },
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async isCreatorOnboardingComplete(): Promise<boolean> {
    const creatorProfile = await this.getCreatorProfile();
    return creatorProfile !== null && creatorProfile.display_name !== null;
  }

  // Application Details
  async getApplicationById(applicationId: string) {
    const { data, error } = await this.client
      .from('applications')
      .select(`
        *,
        campaigns (
          *,
          brands (
            id,
            brand_name,
            logo_url,
            website,
            instagram_handle,
            tiktok_handle
          )
        )
      `)
      .eq('id', applicationId)
      .single();

    if (error) throw error;
    return data;
  }

  async getApplicationsByCampaign(campaignId: string) {
    const profile = await this.getUserProfile();
    if (!profile) return [];

    const { data, error } = await this.client
      .from('applications')
      .select('*')
      .eq('campaign_id', campaignId)
      .eq('creator_id', profile.id);

    if (error) throw error;
    return data || [];
  }

  // Get approved collaborations (active campaigns)
  async getActiveCollaborations() {
    const profile = await this.getUserProfile();
    if (!profile) return [];

    const { data, error } = await this.client
      .from('applications')
      .select(`
        *,
        campaigns (
          *,
          brands (
            id,
            brand_name,
            logo_url
          )
        )
      `)
      .eq('creator_id', profile.id)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}

export default SupabaseService.getInstance();
