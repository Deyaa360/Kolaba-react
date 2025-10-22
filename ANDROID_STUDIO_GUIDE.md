# 🤖 Complete Guide: Running React Native App in Android Studio

## 📋 Prerequisites Checklist

Before starting, ensure you have:

### ✅ Required Software:
- [ ] **Node.js** (v16+) - [Download](https://nodejs.org/)
- [ ] **Android Studio** - [Download](https://developer.android.com/studio)
- [ ] **JDK 11** (bundled with Android Studio)

### ✅ Android Studio Setup:
- [ ] Android SDK installed (API 33 or higher)
- [ ] Android SDK Platform-Tools
- [ ] Android SDK Build-Tools
- [ ] Android Virtual Device (AVD) created

---

## 🎯 Method 1: Run from VS Code/Terminal (RECOMMENDED)

This is the **easiest and fastest** method:

### Step 1: Open Terminal in Project Directory
```powershell
# Navigate to project
cd "c:\Users\deyaa\OneDrive\Desktop\apktool\influee\Influee-mock-ugc"
```

### Step 2: Install Dependencies
```powershell
npm install
```

**Expected Output:**
```
added 1234 packages in 45s
```

### Step 3: Start Android Emulator
**Option A: From Android Studio**
1. Open Android Studio
2. Click **"More Actions" → "Virtual Device Manager"**
3. Click **▶ Play** button on any device
4. Wait for emulator to fully boot

**Option B: From Terminal**
```powershell
# List available emulators
emulator -list-avds

# Start specific emulator (replace 'Pixel_5_API_33' with your device name)
emulator -avd Pixel_5_API_33
```

### Step 4: Verify Device Connected
```powershell
adb devices
```

**Expected Output:**
```
List of devices attached
emulator-5554   device
```

### Step 5: Run the App
```powershell
npm run android
```

**What Happens:**
1. Metro bundler starts (JavaScript packager)
2. Gradle builds the Android app
3. APK installs on emulator/device
4. App launches automatically

**Expected Output:**
```
info Running jetifier to migrate libraries to AndroidX.
info Starting JS server...
info Installing the app...
info Launching app on SDK built for x86...
```

### Step 6: App Should Launch! 🎉

---

## 🎯 Method 2: Run Directly from Android Studio

If you prefer using Android Studio GUI:

### Step 1: Install Node Dependencies First
```powershell
cd "c:\Users\deyaa\OneDrive\Desktop\apktool\influee\Influee-mock-ugc"
npm install
```

### Step 2: Start Metro Bundler
**In Terminal 1:**
```powershell
npm start
```

**Keep this running!** You should see:
```
                ######                ######
              ###     ####        ####     ###
            ##          ###    ###          ##
            ##             ####             ##
            ##             ####             ##
            ##           ##    ##           ##
            ##         ###      ###         ##
              ###     ####        ####     ###
                ######                ######
                                            
               Welcome to Metro v0.76.0
              Fast - Scalable - Integrated
```

### Step 3: Open Project in Android Studio
1. Launch **Android Studio**
2. Click **"Open"**
3. Navigate to: `c:\Users\deyaa\OneDrive\Desktop\apktool\influee\Influee-mock-ugc\android`
4. Click **"OK"**

**Important:** Open the `android` folder, NOT the root project folder!

### Step 4: Wait for Gradle Sync
Android Studio will automatically:
- Sync Gradle files
- Download dependencies
- Index the project

**Bottom status bar should show:** "Gradle sync finished"

### Step 5: Create/Select AVD (Emulator)
1. Click **Device Manager** (phone icon) in right toolbar
2. If no devices exist:
   - Click **"Create Device"**
   - Select **Pixel 5** (or any device)
   - Select **API 33** (or higher)
   - Click **"Finish"**
3. Click **▶ Play** to start emulator

### Step 6: Run the App
**Option A: Run Button**
1. Click green **▶ Run** button (top toolbar)
2. Select your emulator from list
3. Click **"OK"**

**Option B: Run Menu**
1. Click **Run → Run 'app'**
2. Select device
3. Click **"OK"**

### Step 7: App Launches! 🎉

---

## 🔧 Troubleshooting Common Issues

### Issue 1: "SDK location not found"

**Solution:**
Create `android/local.properties` file:

```properties
sdk.dir=C\:\\Users\\deyaa\\AppData\\Local\\Android\\Sdk
```

**Or find your SDK path:**
1. Android Studio → Settings
2. Appearance & Behavior → System Settings → Android SDK
3. Copy "Android SDK Location" path
4. Add to `local.properties`

---

### Issue 2: "Could not connect to development server"

**Problem:** Metro bundler not running

**Solution:**
```powershell
# Terminal 1: Start Metro
npm start

# Terminal 2: Run Android
npm run android
```

---

### Issue 3: "No connected devices"

**Solution:**
```powershell
# Check if emulator is running
adb devices

# If empty, start emulator from Android Studio
# Then verify again
adb devices
```

---

### Issue 4: Build Fails with "Execution failed for task ':app:installDebug'"

**Solution:**
```powershell
# Clean the build
cd android
.\gradlew clean
cd ..

# Try again
npm run android
```

---

### Issue 5: "INSTALL_FAILED_UPDATE_INCOMPATIBLE"

**Problem:** Old version of app installed with different signature

**Solution:**
```powershell
# Uninstall existing app
adb uninstall co.influee.InflueeApp

# Try again
npm run android
```

---

### Issue 6: Metro bundler won't start

**Solution:**
```powershell
# Clear cache and restart
npx react-native start --reset-cache
```

---

### Issue 7: "Unable to load script. Make sure you're running Metro"

**Solution:**
```powershell
# In Terminal 1
npm start

# Wait for "Fast - Scalable - Integrated" message

# In Terminal 2
npm run android
```

---

### Issue 8: Gradle build fails

**Solution:**
```powershell
# Clean and rebuild
cd android
.\gradlew clean
.\gradlew assembleDebug
cd ..

# If still fails, try:
rm -rf android/build
rm -rf android/app/build
npm run android
```

---

## 🎨 Development Workflow

### Normal Development Session:

**Terminal 1 (Metro Bundler):**
```powershell
cd "c:\Users\deyaa\OneDrive\Desktop\apktool\influee\Influee-mock-ugc"
npm start
```

**Terminal 2 (Run Android):**
```powershell
cd "c:\Users\deyaa\OneDrive\Desktop\apktool\influee\Influee-mock-ugc"
npm run android
```

**Then:**
- Make code changes in `src/` folder
- Save files
- Changes auto-reload in app (Fast Refresh)
- No need to rebuild!

---

## 📱 Debugging in Android Studio

### View Logs:
1. Android Studio → **Logcat** (bottom toolbar)
2. Filter by: `co.influee.InflueeApp`
3. See all console.log() output + errors

### React Native Dev Menu:
**In emulator:**
- Press `Cmd/Ctrl + M` (Windows)
- Or shake device (if physical)

**Dev Menu Options:**
- ✅ **Reload** - Refresh app
- ✅ **Debug** - Open Chrome DevTools
- ✅ **Change Bundle Location** - Connect to different Metro server
- ✅ **Settings** - Configure Fast Refresh, etc.

---

## 🚀 Quick Start Commands

### First Time Setup:
```powershell
cd "c:\Users\deyaa\OneDrive\Desktop\apktool\influee\Influee-mock-ugc"
npm install
npm run android
```

### Daily Development:
```powershell
# Terminal 1
npm start

# Terminal 2
npm run android
```

### Clean & Rebuild:
```powershell
cd android
.\gradlew clean
cd ..
npm start -- --reset-cache
npm run android
```

---

## 📊 Verify Installation Success

After app launches, check:

### ✅ Bottom Navigation Visible
- 5 tabs: Home, Search, Camera, Notifications, Profile

### ✅ Home Screen Shows:
- Stories bar at top (horizontal scroll)
- Feed of posts with images
- Like, comment, share buttons work

### ✅ Search Screen Shows:
- Search bar at top
- Three tabs: Posts, People, Tags
- Grid of posts

### ✅ Camera Screen Shows:
- Mock camera interface
- Filters selection
- Caption input

### ✅ Notifications Screen Shows:
- List of activity notifications
- Two tabs: All, Following

### ✅ Profile Screen Shows:
- User avatar and info
- Stats (followers, following, posts)
- Bio text
- Grid of user posts

---

## 🎯 Performance Tips

### For Faster Development:

1. **Enable Fast Refresh** (default)
   - Changes reload instantly
   - State preserved

2. **Use Physical Device** (if available)
   ```powershell
   # Connect phone via USB
   # Enable USB Debugging in phone settings
   adb devices
   npm run android
   ```

3. **Use Release Build** (for testing)
   ```powershell
   cd android
   .\gradlew assembleRelease
   # APK at: android/app/build/outputs/apk/release/
   ```

---

## 📦 Building APK for Distribution

### Debug APK (for testing):
```powershell
cd android
.\gradlew assembleDebug
```
**Output:** `android/app/build/outputs/apk/debug/app-debug.apk`

### Release APK (for distribution):
```powershell
cd android
.\gradlew assembleRelease
```
**Output:** `android/app/build/outputs/apk/release/app-release.apk`

**Install APK on device:**
```powershell
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🆘 Still Having Issues?

### Check These:

1. **Node Version:**
   ```powershell
   node --version  # Should be v16+
   ```

2. **Android SDK Installed:**
   ```powershell
   echo $env:ANDROID_HOME  # Should show SDK path
   ```

3. **JDK Installed:**
   ```powershell
   java -version  # Should show Java 11+
   ```

4. **Emulator Running:**
   ```powershell
   adb devices  # Should show emulator-XXXX
   ```

5. **Metro Running:**
   - Check Terminal 1 for "Welcome to Metro" message

### Get More Help:

- **React Native Docs:** https://reactnative.dev/docs/environment-setup
- **Android Studio Docs:** https://developer.android.com/studio/run
- **Common Issues:** Check INSTALLATION.md in this project

---

## 🎉 Success Checklist

- [x] Node.js installed
- [x] Android Studio installed  
- [x] Project dependencies installed (`npm install`)
- [x] Android emulator running
- [x] Metro bundler started (`npm start`)
- [x] App built and installed (`npm run android`)
- [x] App launched successfully
- [x] All 5 tabs working
- [x] Mock data displaying
- [x] No red error screens

**If all checked → You're ready to develop! 🚀**

---

## 📝 Notes

- **First build takes 3-5 minutes** (downloads dependencies)
- **Subsequent builds are faster** (30-60 seconds)
- **Code changes reload instantly** with Fast Refresh
- **Keep Metro bundler running** in separate terminal
- **Use physical device for better performance** (optional)

---

**Need more help?** Check README.md and INSTALLATION.md for detailed troubleshooting!

✨ **Happy Coding!** ✨
