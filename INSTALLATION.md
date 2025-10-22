# 🛠️ Installation & Troubleshooting Guide

## Prerequisites

Before starting, ensure you have:

### Required Software
- ✅ Node.js (v16 or higher) - [Download](https://nodejs.org/)
- ✅ npm or yarn package manager
- ✅ React Native CLI - `npm install -g react-native-cli`
- ✅ Android Studio OR Xcode (depending on platform)

### Android Requirements
- ✅ Android Studio installed
- ✅ Android SDK (API 33 or higher)
- ✅ Android Virtual Device (AVD) or physical device
- ✅ ANDROID_HOME environment variable set

### iOS Requirements (Mac only)
- ✅ Xcode (latest version)
- ✅ Xcode Command Line Tools
- ✅ CocoaPods - `sudo gem install cocoapods`
- ✅ iOS Simulator or physical device

## Step-by-Step Installation

### 1. Navigate to Project Directory
```bash
cd c:\Users\deyaa\OneDrive\Desktop\apktool\influee\Influee-mock-ugc
```

### 2. Install Node Dependencies
```bash
npm install
```

**If you encounter issues:**
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install

# Or use yarn
yarn install
```

### 3. Install iOS Dependencies (Mac Only)
```bash
cd ios
pod install
cd ..
```

**If you encounter issues:**
```bash
cd ios
rm -rf Pods
rm Podfile.lock
pod install --repo-update
cd ..
```

### 4. Start Metro Bundler
```bash
npm start
```

**Or with cache reset:**
```bash
npm start -- --reset-cache
```

### 5. Run on Android
**In a new terminal:**
```bash
npm run android
```

**Or manually:**
```bash
# Start emulator first, then:
npx react-native run-android
```

### 6. Run on iOS (Mac Only)
**In a new terminal:**
```bash
npm run ios
```

**Or manually:**
```bash
npx react-native run-ios
```

## Common Issues & Solutions

### Issue 1: Metro Bundler Not Starting
**Solution:**
```bash
# Kill existing Metro processes
npx react-native start --reset-cache

# Or manually:
killall node
npm start
```

### Issue 2: Android Build Fails
**Solution:**
```bash
# Clean Android build
cd android
./gradlew clean
cd ..

# Rebuild
npm run android
```

**If still failing:**
```bash
# Delete build folders
rm -rf android/app/build
rm -rf android/build

# Clear gradle cache
cd android
./gradlew cleanBuildCache
cd ..

# Try again
npm run android
```

### Issue 3: iOS Build Fails (Mac)
**Solution:**
```bash
# Clean iOS build
cd ios
rm -rf build
xcodebuild clean
cd ..

# Reinstall pods
cd ios
pod deintegrate
pod install
cd ..

# Try again
npm run ios
```

### Issue 4: Module Not Found Errors
**Solution:**
```bash
# Clear watchman
watchman watch-del-all

# Reset Metro cache
npm start -- --reset-cache

# Reinstall node_modules
rm -rf node_modules
npm install
```

### Issue 5: Images Not Loading
**Problem:** Mock images use online services (pravatar.cc, picsum.photos)

**Solution:**
- Ensure device/emulator has internet connection
- Images will load automatically once online
- Alternatively, replace URLs with local assets in `src/data/mockData.ts`

### Issue 6: "Unable to resolve module"
**Solution:**
```bash
# Clear all caches
npm start -- --reset-cache
rm -rf /tmp/metro-*
rm -rf $TMPDIR/react-*

# Reinstall
rm -rf node_modules
npm install
```

### Issue 7: Android Emulator Not Detected
**Solution:**
```bash
# List available devices
adb devices

# If none listed:
# 1. Open Android Studio
# 2. Tools > AVD Manager
# 3. Create/Start a virtual device

# Then try again:
npm run android
```

### Issue 8: iOS Simulator Not Opening
**Solution:**
```bash
# List available simulators
xcrun simctl list devices

# Open specific simulator
open -a Simulator

# Then try again:
npm run ios
```

### Issue 9: Red Screen Error on App Launch
**Solution:**
```bash
# Usually just needs a reload
# In app: Shake device > Reload
# Or press: R twice in Metro terminal

# If persists:
npm start -- --reset-cache
```

### Issue 10: TypeScript Errors
**Solution:**
```bash
# TypeScript errors should not prevent running
# But to check:
npx tsc --noEmit

# If errors persist, check:
# - All imports are correct
# - No typos in filenames
# - All files are saved
```

## Verification Steps

### After successful installation, verify:

1. ✅ **Metro Bundler Running**
   - You should see "Welcome to Metro" in terminal
   - Should show bundle progress

2. ✅ **App Installed**
   - Check device/emulator for "Influee" app icon
   - App should launch automatically

3. ✅ **No Red Screens**
   - App should show Home screen with posts
   - No error overlays

4. ✅ **Navigation Works**
   - Tap all 5 bottom tabs
   - Each should load without errors

5. ✅ **Mock Data Displays**
   - Home: Stories and posts visible
   - Search: Posts grid loads
   - Notifications: Activity list shows
   - Profile: User info and posts grid

## Performance Tips

### For Faster Development:

1. **Use Hermes Engine** (already enabled)
   - Faster startup times
   - Reduced memory usage

2. **Enable Fast Refresh** (already enabled)
   - Changes reflect without full reload
   - State preserved during hot reload

3. **Use Physical Device**
   - Generally faster than emulators
   - Better performance testing

## Development Workflow

### Typical Development Session:

1. **Start Metro** (Terminal 1)
   ```bash
   npm start
   ```

2. **Run App** (Terminal 2)
   ```bash
   npm run android  # or ios
   ```

3. **Make Changes**
   - Edit files in `src/`
   - Changes auto-reload with Fast Refresh

4. **Debug if Needed**
   - Shake device > Open Dev Menu
   - Enable Debug JS Remotely
   - Use Chrome DevTools

## Building for Production

### Android APK:
```bash
cd android
./gradlew assembleRelease
```

APK location: `android/app/build/outputs/apk/release/app-release.apk`

### iOS Archive (Mac):
```bash
# Open Xcode
open ios/InflueeMockUgc.xcworkspace

# Product > Archive > Distribute App
```

## Getting Help

### If issues persist:

1. **Check Documentation**
   - README.md
   - React Native docs
   - Package documentation

2. **Common Solutions**
   - Restart Metro bundler
   - Clean build folders
   - Reinstall dependencies
   - Restart IDE/editor

3. **Platform-Specific Help**
   - Android: Check Android Studio logcat
   - iOS: Check Xcode console

4. **Community Resources**
   - React Native GitHub issues
   - Stack Overflow
   - React Native Discord

## Quick Reference

### Useful Commands:
```bash
# Start Metro
npm start

# Run Android
npm run android

# Run iOS
npm run ios

# Clean & Rebuild
npm run clean
npm install
npm run android

# Reset Cache
npm start -- --reset-cache

# Check for errors
npm run lint
```

### File Locations:
- Source code: `src/`
- Mock data: `src/data/mockData.ts`
- Colors: `src/styles/Colors.ts`
- Navigation: `src/navigation/AppNavigator.tsx`

---

**Need more help?** Check the comprehensive README.md or PROJECT_SUMMARY.md files.

✨ **Happy Coding!** ✨
