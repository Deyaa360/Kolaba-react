// Design System - Professional & Modern
// Strategic use of brand colors for a serious, polished platform

export const Colors = {
  // === PRIMARY BRAND COLORS (Use consistently) ===
  primary: '#11A69F',           // Darker Turquoise - Main CTAs, active states (from your palette)
  accent: '#F271B4',            // Hot Pink - Highlights, badges, special emphasis (sparingly)
  secondary: '#FAB422',         // Yellow - Warnings, pending states (minimal use)
  
  // === TURQUOISE SHADES (Full palette from screenshot) ===
  turquoise50: '#EDFDFC',       // Lightest
  turquoise100: '#A3F5F1',      // Very light
  turquoise200: '#59EEE6',      // Light
  turquoise300: '#17DED4',      // Original brand turquoise
  turquoise400: '#11A69F',      // Main (darker, more professional)
  turquoise500: '#0C6F6A',      // Dark
  turquoise600: '#063735',      // Darkest
  
  // === PINK SHADES (Full palette from screenshot) ===
  pink50: '#FDECF5',            // Lightest
  pink100: '#F8B4D7',           // Very light
  pink200: '#F271B4',           // Brand pink (main)
  pink300: '#EE449C',           // Medium
  pink400: '#E0157E',           // Dark
  pink500: '#A8105E',           // Darker
  pink600: '#700A3F',           // Darkest
  
  // === YELLOW SHADES (Full palette from screenshot) ===
  yellow50: '#FEF2D7',          // Lightest
  yellow100: '#FDDE9B',         // Very light
  yellow200: '#FCCA5F',         // Light
  yellow300: '#FAB422',         // Brand yellow (main)
  yellow400: '#DC9804',         // Dark
  yellow500: '#A06E03',         // Darker
  yellow600: '#644502',         // Darkest
  
  // === BLUE-GRAY SHADES (From dark palette screenshot) ===
  blueGray50: '#5F7195',        // Lightest
  blueGray100: '#505F7C',       // Very light
  blueGray200: '#404C64',       // Light
  blueGray300: '#30394B',       // Medium
  blueGray400: '#202632',       // Dark
  blueGray500: '#101319',       // Brand black (darkest)
  blueGray600: '#08090C',       // Extra dark
  
  // === COOL GRAY SHADES (From light gray palette) ===
  gray50: '#FFFFFF',            // White
  gray100: '#E7E9EF',           // Very light
  gray200: '#CED2DE',           // Light
  gray300: '#B6BCCE',           // Medium light
  gray400: '#9DA5BE',           // Medium
  gray500: '#858FAD',           // Medium dark
  gray600: '#6C789D',           // Dark
  
  // === BASE COLORS ===
  black: '#101319',             // Rich Black - Primary text, headers
  white: '#FFFFFF',             // White - Backgrounds, cards
  
  // === SEMANTIC COLORS ===
  success: '#10B981',          // Green - Approvals, success
  error: '#EF4444',            // Red - Errors, rejections
  warning: '#FAB422',          // Yellow (brand) - Warnings, pending
  info: '#11A69F',             // Turquoise (brand darker) - Info tips
  
  // === BACKGROUNDS ===
  background: '#E7E9EF',       // Light cool gray background (main app)
  backgroundSecondary: '#CED2DE', // Section divider color (between sections)
  surface: '#FFFFFF',          // Cards, modals
  surfaceElevated: '#FFFFFF',  // Elevated cards
  
  // === TEXT (Consistent hierarchy) ===
  text: '#101319',             // Primary text (brand black)
  textSecondary: '#505F7C',    // Secondary text (blue-gray)
  textTertiary: '#9DA5BE',     // Tertiary/placeholder (cool gray)
  textDisabled: '#CED2DE',     // Disabled text
  textInverse: '#FFFFFF',      // Text on dark backgrounds
  
  // === BORDERS ===
  border: '#CED2DE',           // Standard borders (light gray)
  borderLight: '#E7E9EF',      // Light borders
  divider: '#CED2DE',          // Dividers
  
  // === BUTTONS (Consistent across app) ===
  button: '#11A69F',           // Primary button (darker turquoise)
  buttonHover: '#0C6F6A',      // Hover state (even darker turquoise)
  buttonDisabled: '#CED2DE',   // Disabled button
  
  // === LINKS ===
  link: '#11A69F',             // Links (darker turquoise)
  linkHover: '#0C6F6A',        // Link hover
  
  // === OVERLAYS ===
  overlay: 'rgba(16, 19, 25, 0.7)',    // Dark overlay using brand black
  backdrop: 'rgba(16, 19, 25, 0.5)',   // Lighter backdrop
  
  // === COMPATIBILITY ===
  instagram: '#E4405F',
  tiktok: '#000000',
  youtube: '#FF0000',
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

