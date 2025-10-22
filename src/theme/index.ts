// Design System - Instagram-Quality Theme
// Professional color palette and styling constants

export const Colors = {
  // Primary Brand Colors
  primary: '#6C5CE7',           // Purple accent
  primaryDark: '#5B4BD6',       // Darker purple
  primaryLight: '#A29BFE',      // Lighter purple
  
  // Background Colors
  background: '#FFFFFF',         // Main background
  backgroundSecondary: '#F8F9FA', // Secondary background
  surface: '#FFFFFF',            // Card/surface background
  surfaceElevated: '#FFFFFF',    // Elevated surface
  
  // Text Colors
  text: '#1A1A1A',              // Primary text
  textSecondary: '#6B7280',     // Secondary text
  textTertiary: '#9CA3AF',      // Tertiary text
  textDisabled: '#D1D5DB',      // Disabled text
  textInverse: '#FFFFFF',       // Text on dark background
  
  // UI Element Colors
  border: '#E5E7EB',            // Border color
  borderLight: '#F3F4F6',       // Light border
  divider: '#E5E7EB',           // Divider lines
  
  // Status Colors
  success: '#10B981',           // Success green
  successLight: '#D1FAE5',      // Light success background
  error: '#EF4444',             // Error red
  errorLight: '#FEE2E2',        // Light error background
  warning: '#F59E0B',           // Warning orange
  warningLight: '#FEF3C7',      // Light warning background
  info: '#3B82F6',              // Info blue
  infoLight: '#DBEAFE',         // Light info background
  
  // Interactive Colors
  button: '#6C5CE7',            // Button color
  buttonHover: '#5B4BD6',       // Button hover
  buttonDisabled: '#E5E7EB',    // Disabled button
  link: '#6C5CE7',              // Link color
  linkHover: '#5B4BD6',         // Link hover
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)', // Modal overlay
  backdrop: 'rgba(0, 0, 0, 0.3)', // Backdrop
  
  // Social Media Colors
  instagram: '#E4405F',
  tiktok: '#000000',
  youtube: '#FF0000',
  
  // Transparency variants
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const Typography = {
  // Font Families
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  
  // Font Sizes
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 17,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 34,
  },
  
  // Font Weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

export const Animations = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

