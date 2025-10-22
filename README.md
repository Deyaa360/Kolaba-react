# Influee - Social Media App (Mock/Offline Version)

A pixel-perfect recreation of the Influee social media application with complete offline functionality. This app runs entirely with mock data - no backend, no API calls, just pure UI/UX with realistic mock data.

## 📱 Features

### Core Functionality
- **Home Feed**: Scrollable feed with posts, stories, likes, comments, and shares
- **Search/Explore**: Search for posts, people, and hashtags with filtering
- **Camera/Create**: Mock camera interface for creating new posts
- **Notifications**: Activity feed showing likes, comments, follows, and mentions
- **Profile**: User profile with posts grid, stats, and bio

### UI Components
- **Stories Bar**: Horizontal scrolling stories with gradient rings
- **Post Cards**: Full-featured post cards with images, likes, comments, shares
- **User Avatars**: Profile pictures with verification badges and story rings
- **Notifications**: Rich notification items with icons and thumbnails
- **Search Tabs**: Filter search results by posts, people, or tags

### Mock Data
- 11 realistic user profiles with avatars and bios
- 10+ posts with images, captions, and engagement metrics
- 7 stories from different users
- Multiple comments per post
- 8+ notifications (likes, comments, follows, mentions)
- 10 trending hashtags

## 🎨 Design Features

### Colors
- **Dark Theme**: Black background (#0A0A0A) with dark surfaces
- **Primary Purple**: #6C5CE7 brand color with gradients
- **Accent Colors**: Teal (#00CEC9), Red (#FF6B6B) for actions
- **Text Hierarchy**: Primary (#FFFFFF), Secondary (#B8B8B8), Tertiary (#6B6B6B)

### Typography
- **Font Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Font Sizes**: 10-32px range with proper line heights
- **Text Styles**: Headings, body text, captions, labels, buttons

### Spacing & Layout
- **Consistent Spacing**: 4px base unit (xxs: 4, xs: 8, sm: 12, md: 16, lg: 20, xl: 24)
- **Border Radius**: From 4px (xs) to 24px (xxl) with rounded option
- **Icon Sizes**: 16-48px range
- **Avatar Sizes**: 24-120px range

## 🚀 Getting Started

### Prerequisites
- Node.js >= 16
- React Native development environment
- Android Studio (for Android) or Xcode (for iOS)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Link native dependencies**
   ```bash
   npm run link
   # or
   yarn link
   ```

3. **Install CocoaPods (iOS only)**
   ```bash
   cd ios && pod install && cd ..
   ```

### Running the App

#### Android
```bash
npm run android
# or
yarn android
```

#### iOS
```bash
npm run ios
# or
yarn ios
```

### Development
```bash
# Start Metro bundler
npm start
# or
yarn start

# Clear cache if needed
npm run reset-cache
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── UserAvatar.tsx   # Avatar with verification and story ring
│   ├── PostCard.tsx     # Complete post card component
│   └── StoriesBar.tsx   # Horizontal stories scrollbar
├── data/
│   └── mockData.ts      # All mock data (users, posts, stories, etc.)
├── navigation/
│   └── AppNavigator.tsx # Bottom tabs and stack navigation
├── screens/             # Main app screens
│   ├── HomeScreen.tsx   # Feed with posts and stories
│   ├── SearchScreen.tsx # Search with tabs (posts/people/tags)
│   ├── CameraScreen.tsx # Mock camera/create interface
│   ├── NotificationsScreen.tsx # Activity notifications
│   └── ProfileScreen.tsx # User profile with grid
└── styles/             # Style utilities
    ├── Colors.ts       # Color palette
    └── Typography.ts   # Text styles and spacing
```

## 🎯 Mock Data Structure

### Users
- Username, display name, avatar URL
- Bio, verification status
- Followers, following, posts count
- Following relationship status

### Posts
- User info, image URL, caption
- Likes, comments, shares count
- Timestamp, location
- Like/bookmark status
- Hashtags array

### Stories
- User info, image URL
- Timestamp, viewed status

### Comments
- User info, comment text
- Likes count, timestamp
- Nested replies support

### Notifications
- Type (like/comment/follow/mention)
- User info, post reference
- Text content, timestamp
- Read/unread status

## 🔧 Customization

### Adding More Mock Data

Edit `src/data/mockData.ts`:

```typescript
// Add new users
export const mockUsers: User[] = [
  // ... existing users
  {
    id: 'new_user_id',
    username: 'newuser',
    displayName: 'New User',
    // ... other properties
  },
];

// Add new posts
export const mockPosts: Post[] = [
  // ... existing posts
  {
    id: 'new_post_id',
    user: mockUsers[0],
    imageUrl: 'https://...',
    // ... other properties
  },
];
```

### Changing Colors

Edit `src/styles/Colors.ts`:

```typescript
export const Colors = {
  primary: '#6C5CE7',  // Change brand color
  background: '#0A0A0A', // Change background
  // ... other colors
};
```

### Modifying Typography

Edit `src/styles/Typography.ts`:

```typescript
export const Typography = {
  h1: {
    fontSize: 32,  // Change size
    fontWeight: '700',  // Change weight
    // ... other properties
  },
  // ... other styles
};
```

## 📱 Screens Overview

### Home Screen
- Stories bar at the top
- Infinite scrollable feed
- Pull to refresh
- Like/comment/share/bookmark actions
- Navigate to user profiles

### Search Screen
- Search bar with clear button
- Three tabs: Posts, People, Tags
- Posts: Grid layout with overlay stats
- People: List with follow buttons
- Tags: List with post counts

### Camera Screen
- Mock camera preview
- Gallery, camera, video options
- Filter selection (8+ filters)
- Caption input (2200 char limit)
- Location, tagging, music options

### Notifications Screen
- Two tabs: All, Following
- Different notification types with icons
- Unread indicators
- Post thumbnails for relevant notifications
- Follow buttons for follow notifications

### Profile Screen
- Large avatar with gradient ring
- Stats: Posts, Followers, Following
- Bio section
- Edit profile button
- Story highlights placeholder
- Posts/Tagged tabs
- Grid layout for posts

## 🎨 Icons

The app uses `react-native-vector-icons/Ionicons` with these main icons:
- `home`, `search`, `camera`, `heart`, `person` (Tab bar)
- `chatbubble`, `paper-plane`, `bookmark` (Post actions)
- `add-circle`, `ellipsis-horizontal`, `menu` (Headers)
- `grid`, `people`, `pricetag` (Search tabs)
- `location`, `musical-notes`, `settings` (Options)

## 🐛 Troubleshooting

### Metro bundler issues
```bash
npm start -- --reset-cache
```

### Android build issues
```bash
cd android && ./gradlew clean && cd ..
npm run android
```

### iOS build issues
```bash
cd ios && pod install && cd ..
npm run ios
```

### Image loading issues
- Mock images use Pravatar and Picsum services
- Images require internet connection to load
- Replace with local assets if needed

## 📄 License

MIT License - This is a mock/demo application created for educational purposes.

## 👥 Credits

- **Original App**: Influee (co.influee.InflueeApp)
- **Recreation**: Complete offline mock version
- **Images**: Pravatar.cc and Picsum.photos
- **Icons**: Ionicons by React Native Vector Icons

## 🎯 Future Enhancements

Possible additions (all with mock data):
- Post detail screen with full comments
- Story viewer with swipe navigation
- DM/Chat interface
- Settings screen
- Edit profile screen
- Create post flow completion
- Reels/Video tab
- Live indicator
- Draft posts
- Archive section

---

**Note**: This is a complete offline mock application. All data is hardcoded and no backend/API calls are made. Perfect for UI/UX demonstrations, prototyping, or learning React Native.
