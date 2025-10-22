# 🚨 URGENT FIX: Android Environment Setup

## Your Current Issues:
1. ❌ `adb` not recognized - Android SDK not in PATH
2. ❌ `gradlew.bat` missing - Now FIXED ✅
3. ❌ No emulators found - Android Studio not properly set up

---

## 🎯 SOLUTION: Complete Android Setup (15-20 minutes)

### Step 1: Install Android Studio (If Not Installed)

1. **Download Android Studio:**
   - Go to: https://developer.android.com/studio
   - Download latest version
   - Run installer

2. **During Installation:**
   - ✅ Check "Android SDK"
   - ✅ Check "Android SDK Platform"
   - ✅ Check "Android Virtual Device"

---

### Step 2: Configure Android SDK

1. **Open Android Studio**
2. Click **"More Actions"** → **"SDK Manager"**
3. **Install Required Components:**

   **SDK Platforms Tab:**
   - ✅ Android 13.0 (Tiramisu) - API Level 33
   - ✅ Android 12.0 (S) - API Level 31
   
   **SDK Tools Tab:**
   - ✅ Android SDK Build-Tools
   - ✅ Android SDK Platform-Tools
   - ✅ Android Emulator
   - ✅ Android SDK Tools
   - ✅ Intel x86 Emulator Accelerator (HAXM installer)

4. **Click "Apply"** and wait for downloads to complete

---

### Step 3: Add Android SDK to System PATH

This is **CRITICAL** - it's why `adb` doesn't work!

#### Method A: Automatic (Recommended)

**Run this in PowerShell (as Administrator):**

```powershell
# Set ANDROID_HOME environment variable
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', "$env:LOCALAPPDATA\Android\Sdk", 'User')

# Add to PATH
$androidPath = "$env:LOCALAPPDATA\Android\Sdk\platform-tools;$env:LOCALAPPDATA\Android\Sdk\emulator;$env:LOCALAPPDATA\Android\Sdk\tools;$env:LOCALAPPDATA\Android\Sdk\tools\bin"
$currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'User')
[System.Environment]::SetEnvironmentVariable('Path', "$currentPath;$androidPath", 'User')

Write-Host "✅ Android SDK added to PATH!" -ForegroundColor Green
Write-Host "⚠️  IMPORTANT: Close and reopen PowerShell for changes to take effect!" -ForegroundColor Yellow
```

#### Method B: Manual (If above fails)

1. **Press Windows Key** → Search "Environment Variables"
2. Click **"Edit the system environment variables"**
3. Click **"Environment Variables"** button
4. Under **"User variables"**:
   
   **Create ANDROID_HOME:**
   - Click **"New"**
   - Variable name: `ANDROID_HOME`
   - Variable value: `C:\Users\deyaa\AppData\Local\Android\Sdk`
   - Click **OK**
   
   **Edit PATH:**
   - Find **"Path"** → Click **"Edit"**
   - Click **"New"** and add these one by one:
     ```
     %ANDROID_HOME%\platform-tools
     %ANDROID_HOME%\emulator
     %ANDROID_HOME%\tools
     %ANDROID_HOME%\tools\bin
     ```
   - Click **OK** on all dialogs

5. **IMPORTANT:** Close and reopen PowerShell!

---

### Step 4: Verify ADB Works

**Close current PowerShell and open NEW one**, then run:

```powershell
adb version
```

**Expected Output:**
```
Android Debug Bridge version 1.0.41
```

**If you see this → SUCCESS! ✅**

---

### Step 5: Create Android Virtual Device (Emulator)

1. **Open Android Studio**
2. Click **"More Actions"** → **"Virtual Device Manager"**
3. Click **"Create Device"**
4. **Select Hardware:**
   - Choose **"Pixel 5"** (or any phone)
   - Click **"Next"**
5. **Select System Image:**
   - Click **"Download"** next to **"Tiramisu" (API 33)**
   - Wait for download
   - Select it
   - Click **"Next"**
6. **Verify Configuration:**
   - Name: `Pixel_5_API_33`
   - Click **"Finish"**

---

### Step 6: Test Emulator

1. In **Device Manager**, find your new device
2. Click **▶ Play** button
3. Wait for emulator to boot (1-2 minutes first time)
4. You should see Android home screen

**Verify in PowerShell:**
```powershell
adb devices
```

**Expected Output:**
```
List of devices attached
emulator-5554   device
```

---

### Step 7: Create local.properties File

```powershell
cd "c:\Users\deyaa\OneDrive\Desktop\apktool\influee\Influee-mock-ugc\android"
```

Create file `local.properties` with this content:

```properties
sdk.dir=C:\\Users\\deyaa\\AppData\\Local\\Android\\Sdk
```

**Quick Create Command:**
```powershell
"sdk.dir=C:\\Users\\deyaa\\AppData\\Local\\Android\\Sdk" | Out-File -FilePath ".\local.properties" -Encoding ASCII
```

---

### Step 8: Run the App!

**Open NEW PowerShell window** (to get updated PATH), then:

```powershell
cd "c:\Users\deyaa\OneDrive\Desktop\apktool\influee\Influee-mock-ugc"

# Start emulator first (if not running)
# From Android Studio Device Manager

# Run the app
npm run android
```

---

## 🔍 Troubleshooting

### Issue: "adb still not recognized" after Step 3

**Solution:**
```powershell
# Check if ANDROID_HOME is set
echo $env:ANDROID_HOME

# If empty, find your SDK location:
# Usually at: C:\Users\deyaa\AppData\Local\Android\Sdk
# Or check in Android Studio: Settings → Android SDK → Android SDK Location

# Then manually set it:
$env:ANDROID_HOME = "C:\Users\deyaa\AppData\Local\Android\Sdk"
$env:Path += ";$env:ANDROID_HOME\platform-tools"

# Test
adb version
```

---

### Issue: "Emulator won't start"

**Solution:**
```powershell
# Enable virtualization in BIOS (if needed)
# Check Windows Hypervisor Platform:
# Settings → Apps → Optional Features → Windows Hypervisor Platform

# Or use ARM emulator instead (slower but works):
# In Device Manager, download ARM64 system image
```

---

### Issue: "Gradle build still fails"

**Solution:**
```powershell
cd android
.\gradlew.bat clean
cd ..
npm run android
```

---

## ⚡ Quick Setup Script (All-in-One)

**Run this in PowerShell (as Administrator):**

```powershell
# Navigate to project
cd "c:\Users\deyaa\OneDrive\Desktop\apktool\influee\Influee-mock-ugc"

# Set environment variables
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', "$env:LOCALAPPDATA\Android\Sdk", 'User')
$androidPath = "$env:LOCALAPPDATA\Android\Sdk\platform-tools;$env:LOCALAPPDATA\Android\Sdk\emulator"
$currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'User')
[System.Environment]::SetEnvironmentVariable('Path', "$currentPath;$androidPath", 'User')

# Create local.properties
cd android
"sdk.dir=C:\\Users\\deyaa\\AppData\\Local\\Android\\Sdk" | Out-File -FilePath ".\local.properties" -Encoding ASCII
cd ..

Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host "⚠️  Close this PowerShell and open a NEW one!" -ForegroundColor Yellow
Write-Host "📱 Then start your emulator from Android Studio" -ForegroundColor Cyan
Write-Host "🚀 Finally run: npm run android" -ForegroundColor Green
```

---

## 📋 Final Checklist Before Running

- [ ] Android Studio installed
- [ ] Android SDK (API 33) installed
- [ ] ANDROID_HOME environment variable set
- [ ] PATH includes platform-tools and emulator
- [ ] Closed and reopened PowerShell
- [ ] `adb version` works
- [ ] Emulator created in Device Manager
- [ ] Emulator is running (`adb devices` shows device)
- [ ] local.properties file created
- [ ] In NEW PowerShell window

**Then run:**
```powershell
npm run android
```

---

## 🎉 Expected Success Output

```
info Starting JS server...
info Installing the app...
info Launching app on emulator-5554...
BUILD SUCCESSFUL in 45s
info Connecting to the development server...
info Starting the app...
```

**App should launch on emulator! 🎊**

---

## 🆘 Still Not Working?

### Option 1: Use Android Studio Directly

1. Open Android Studio
2. Open folder: `c:\Users\deyaa\OneDrive\Desktop\apktool\influee\Influee-mock-ugc\android`
3. Wait for Gradle sync
4. Start emulator from Device Manager
5. Click ▶ **Run** button
6. In separate terminal: `npm start` (for Metro bundler)

### Option 2: Use Expo (Easier Alternative)

If Android setup is too complex, I can convert the app to Expo which is much easier to run!

---

**Need help? Check these paths exist:**
```powershell
Test-Path "C:\Users\deyaa\AppData\Local\Android\Sdk\platform-tools\adb.exe"
Test-Path "C:\Users\deyaa\OneDrive\Desktop\apktool\influee\Influee-mock-ugc\android\gradlew.bat"
```

Both should return **True**
