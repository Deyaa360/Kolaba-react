# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Kolaba Creators App** - A React Native UGC (User Generated Content) platform connecting content creators with brand campaigns. Built with React Native 0.72.6, TypeScript, and Supabase backend.

## Development Commands

### Running the App
```powershell
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Clear Metro cache if needed
npm run reset-cache
# or
npm start -- --reset-cache
```

### Building
```powershell
# Build Android APK
npm run build:android

# Bundle Android assets
npm run bundle:android
```

### Testing & Quality
```powershell
# Run tests
npm test

# Lint code
npm run lint
```

### Troubleshooting
```powershell
# Clean React Native
npm run clean

# Clean Android build (from project root)
cd android && ./gradlew clean && cd ..

# Reinstall iOS pods (from project root)
cd ios && pod install && cd ..
```

## Architecture & Structure

### Design System Philosophy

The app follows a **strategic color usage** approach - this is a professional platform, not a rainbow. Brand colors are used purposefully:

**Color Distribution:**
- **80%** neutral (grays, white, black)
- **15%** primary (turquoise #11A69F for main actions)
- **4%** semantic (green/red/yellow for statuses)
- **1%** accent (pink #F271B4 for special emphasis)

**Key Colors:**
- Primary Button: `Colors.primary` (#11A69F - darker turquoise)
- Background: `Colors.background` (#E7E9EF - light cool gray)
- Section Divider: `Colors.backgroundSecondary` (#CED2DE)
- Brand Black: `Colors.black` (#101319)
- Accent: `Colors.accent` (#F271B4 - use sparingly!)

### Theme System (`src/theme/index.ts`)

The design system is centralized and includes:
- **Colors**: Full palette with turquoise, pink, yellow families + blue-gray and cool gray scales
- **Typography**: Apple-style (SF Pro inspired) text styles - use `Typography.title1`, `Typography.body`, etc.
- **Spacing**: 4pt/8pt grid system - `Spacing.xs` (8), `Spacing.md` (16), `Spacing.xl` (24)
- **BorderRadius**: From `BorderRadius.xs` (4) to `BorderRadius.full` (9999)
- **Animations**: Duration and easing constants

**ALWAYS** use theme constants instead of hardcoded values:
```tsx
// Good
backgroundColor: Colors.background
padding: Spacing.md
borderRadius: BorderRadius.lg

// Bad
backgroundColor: '#E7E9EF'
padding: 16
borderRadius: 10
```

### TypeScript Path Aliases

The project uses path aliases (configured in `tsconfig.json`):
```tsx
import { Colors, Typography } from '@/theme'
import { StatCard, InfoCard } from '@/components'
import DashboardScreen from '@/screens/DashboardScreen'
import supabase from '@/services/supabase'
```

Available aliases: `@/components/*`, `@/screens/*`, `@/navigation/*`, `@/data/*`, `@/utils/*`, `@/types/*`, `@/styles/*`

### Reusable Component Library

8 core reusable components (all in `src/components/`):
1. **StatCard** - Dashboard metrics, KPIs (with optional trend indicators)
2. **InfoCard** - Tips, notifications, announcements (with optional arrow)
3. **FeatureCard** - Featured content, campaigns (horizontal/vertical layouts)
4. **QuickActionButton** - Navigation shortcuts (with optional badge)
5. **ProgressCard** - Progress tracking, goals (with percentage)
6. **StatusCard** - Notifications, alerts (5 status types: success/warning/error/info/pending)
7. **ListItemCard** - List items, menu items (with image/icon variants)
8. **SectionHeader** - Page sections with optional action buttons

All components:
- Use 4px border radius consistently
- Are fully TypeScript typed
- Accept optional props for flexibility
- Follow theme system colors/spacing
- Include JSDoc documentation

### Navigation Structure

**Stack Navigator:**
- Auth Flow: Login → Signup
- Main App: Bottom Tabs + Detail Screens

**Bottom Tabs** (5 tabs):
1. Dashboard (Home)
2. Campaigns
3. Orders (Projects)
4. Messages
5. Settings

**Detail Screens:**
- CampaignDetails
- ProductDetails
- Notifications
- Earnings
- ContentLibrary
- ComponentsShowcase (dev/demo only)

### Supabase Backend Integration

**Service Singleton:** `src/services/supabase.ts` - Use `SupabaseService.getInstance()`

**Key Methods:**
- Auth: `signUp()`, `signIn()`, `signOut()`, `getCurrentUser()`
- Campaigns: `getCampaigns()`, `getCampaignById()`, `hasAppliedToCampaign()`
- Applications: `submitApplication()`, `getCreatorApplications()`, `getActiveCollaborations()`
- Profile: `getUserProfile()`, `getCreatorProfile()`, `createOrUpdateCreatorProfile()`
- Stats: `getUserStats()` - returns applications, earnings, completed campaigns
- Content: `submitContent()`, `getContentSubmissions()`
- Notifications: `getNotifications()`, `markNotificationAsRead()`

**Database Schema (key tables):**
- `user_profiles` - User accounts (auth_id, email, full_name, user_type)
- `creator_profiles` - Creator details (display_name, bio, categories, social_links)
- `campaigns` - Brand campaigns (with nested brands and campaign_content_packages)
- `applications` - Creator campaign applications (status: pending/approved/rejected)
- `content_submissions` - Submitted UGC content (status: submitted/approved/rejected)
- `products` - Physical products included in campaigns
- `notifications` - User notifications

### Important Design Patterns

**1. Badge Colors (Objectives & Shipping)**
Use specific color combinations from `FINAL_COLOR_SYSTEM.md`:
- Paid Media: yellow50 bg + yellow500 text
- Organic Social: turquoise50 bg + turquoise500 text
- Products Included: turquoise50 bg + turquoise500 text
- Content Only: yellow50 bg + yellow500 text
- Creative Asset: pink50 bg + pink400 text

**2. Button Consistency**
Primary buttons MUST use `Colors.primary` (#11A69F) everywhere. Secondary buttons use white bg with gray border.

**3. Background Hierarchy**
- Main app screens: `Colors.background` (#E7E9EF)
- Section dividers: `Colors.backgroundSecondary` (#CED2DE)
- Cards/surfaces: `Colors.surface` (#FFFFFF)

**4. Text Hierarchy**
- Headers: `Colors.text` (brand black #101319)
- Body: `Colors.textSecondary` (blue-gray #505F7C)
- Placeholder: `Colors.textTertiary` (cool gray #9DA5BE)

## Common Development Patterns

### Component Props Pattern

All reusable components follow this TypeScript interface pattern:
```tsx
interface ComponentNameProps {
  // Required props first
  title: string;
  value: number;
  
  // Optional props with ?
  icon?: string;
  onPress?: () => void;
  
  // Complex optional props
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

const ComponentName: React.FC<ComponentNameProps> = ({
  title,
  value,
  icon,
  onPress,
  trend,
}) => {
  // Implementation
};
```

### Error Handling Pattern

All Supabase calls should use this error handling pattern:
```tsx
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

try {
  setLoading(true);
  setError(null);
  
  const data = await supabase.getCampaigns();
  // Process data
  
} catch (err) {
  console.error('Error description:', err);
  setError('User-friendly error message');
  showToast('Failed to load data', 'error');
} finally {
  setLoading(false);
}
```

### Loading States Pattern

Use skeleton loaders for better UX:
```tsx
if (loading) {
  return (
    <View style={styles.container}>
      <SkeletonStatCardNew />
      <SkeletonListItemNew />
    </View>
  );
}

if (error) {
  return (
    <EmptyState
      icon="error-outline"
      title="Something went wrong"
      description={error}
      actionLabel="Try Again"
      onAction={loadData}
    />
  );
}
```

### Navigation Pattern

Use type-safe navigation:
```tsx
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();

// Navigate to tab screen
navigation.navigate('Campaigns');

// Navigate with params (cast needed for params)
(navigation as any).navigate('CampaignDetails', { 
  campaignId: campaign.id 
});

// Go back
navigation.goBack();
```

### Toast Notifications Pattern

Show user feedback consistently:
```tsx
const [toastVisible, setToastVisible] = useState(false);
const [toastMessage, setToastMessage] = useState('');
const [toastType, setToastType] = useState<'success'|'error'|'info'|'warning'>('info');

const showToast = (message: string, type: 'success'|'error'|'info'|'warning') => {
  setToastMessage(message);
  setToastType(type);
  setToastVisible(true);
};

// In JSX
<ToastNotification
  visible={toastVisible}
  message={toastMessage}
  type={toastType}
  onHide={() => setToastVisible(false)}
/>
```

## Development Workflow

### Adding New Features

1. **Check existing components** - Review `COMPONENTS_LIBRARY.md` before creating new UI elements
2. **Define TypeScript interfaces** - Create interfaces for all props and data structures
3. **Use theme system** - Always import from `@/theme` and use constants
4. **Implement error handling** - Use try/catch with loading states
5. **Add loading skeletons** - Use skeleton components for better UX
6. **Test both platforms** - Run on Android and iOS (if available)

### Connecting to Supabase

When adding new data fetching:
```tsx
import supabase from '@/services/supabase';

// Example: Fetch campaigns
const campaigns = await supabase.getCampaigns(20, 'active');

// Example: Check auth
const user = await supabase.getCurrentUser();
if (!user) {
  // Handle unauthenticated
}

// Example: Real-time subscription
supabase.client
  .channel('notifications')
  .on('postgres_changes', { 
    event: 'INSERT', 
    schema: 'public', 
    table: 'notifications' 
  }, (payload) => {
    // Update UI
  })
  .subscribe();
```

### Styling Guidelines

**DO:**
- Use theme constants for all colors, spacing, typography
- Follow 4px border radius standard
- Use subtle shadows (0.05-0.1 opacity)
- Keep text hierarchy consistent
- Use Material Icons (`react-native-vector-icons/MaterialIcons`)

**DON'T:**
- Hardcode colors, spacing, or font sizes
- Overuse brand colors (turquoise/pink/yellow)
- Create new component variants when reusable ones exist
- Use different border radius values than theme
- Mix icon libraries

## Platform Specifics

### Windows Development (Current Environment)
- Use PowerShell commands
- Android development via Android Studio
- React Native version: 0.72.6
- Node.js >= 16 required

### iOS Development
Requires CocoaPods:
```bash
cd ios && pod install && cd ..
```

### React Native Configuration
- Metro bundler config: `metro.config.js`
- Babel config: `babel.config.js` (includes react-native-reanimated plugin)
- TypeScript config: `tsconfig.json` (strict mode enabled)

## Additional Documentation

Comprehensive docs available:
- `DESIGN_SYSTEM.md` - Full color strategy and design principles
- `FINAL_COLOR_SYSTEM.md` - Badge colors and screen-specific consistency
- `COMPONENTS_LIBRARY.md` - Detailed component API and usage examples
- `PAGES_DOCUMENTATION.md` - Screen-specific documentation
- `README.md` - Original project overview and features

## Common Gotchas & Solutions

### 1. TypeScript Path Aliases Not Resolving
If `@/` imports show errors:
- Restart TypeScript server in your editor
- Check `tsconfig.json` has correct paths configuration
- Run `npm run clean` and restart Metro bundler

### 2. Metro Bundler Cache Issues
If changes aren't reflecting:
```powershell
npm run reset-cache
# or clear specific cache
rm -rf $env:TEMP\metro-* -Force
```

### 3. Android Build Failures
```powershell
cd android
.\gradlew clean
cd ..
npm run android
```

### 4. Image Loading Issues
- Always use `FastImage` for remote images (better caching)
- Use `Image` for local assets only
- Add error handling for failed image loads
```tsx
<FastImage
  source={{ uri: imageUrl }}
  style={styles.image}
  resizeMode="cover"
  onError={() => console.log('Image failed to load')}
/>
```

### 5. Supabase Authentication State
Always check auth before data operations:
```tsx
const user = await supabase.getCurrentUser();
if (!user) {
  navigation.navigate('Login');
  return;
}
```

### 6. Component Re-renders
Use `useMemo` and `useCallback` for expensive operations:
```tsx
const filteredData = useMemo(() => 
  data.filter(item => item.status === 'active'),
  [data]
);

const handlePress = useCallback(() => {
  navigation.navigate('Details');
}, [navigation]);
```

## Testing

### Manual Testing Checklist
- [ ] Test on both Android and iOS (if available)
- [ ] Test with slow network (Chrome DevTools throttling)
- [ ] Test error states (disconnect network)
- [ ] Test loading states (add delays)
- [ ] Test empty states (new user)
- [ ] Test with long content (text overflow)
- [ ] Test with missing images (broken URLs)

### Running Tests
```powershell
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Important Notes

- **User Type Restriction:** App is creator-only. Sign-in checks `user_metadata.user_type === 'creator'`
- **Supabase Config:** URL and anon key in `src/config/supabase.ts` (production environment)
- **FastImage:** Used for optimized image loading (from `react-native-fast-image`)
- **Navigation:** Uses React Navigation v6 (native-stack + bottom-tabs)
- **State Management:** No Redux/MobX - uses React state + Supabase real-time
- **Icon Library:** Material Icons only (`react-native-vector-icons/MaterialIcons`)
- **No Tests Yet:** Test infrastructure exists but no test files written
