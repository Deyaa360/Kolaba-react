# ⚠️ READ THIS FIRST - SETUP REQUIRED

## 🚨 YOUR CURRENT BLOCKER: Java Version

**Problem:** You have **Java 25**, but React Native needs **Java 17**.

**Error you're seeing:** `Unsupported class file major version 69`

---

## ✅ QUICK FIX (5 minutes):

### Step 1: Run My Helper Script
```powershell
.\install-java17.ps1
```

**Then choose option D** to download Java 17 automatically.

---

### Step 2: Install Java 17
1. Run the downloaded installer
2. **CHECK** the "Set JAVA_HOME" option
3. Complete installation

---

### Step 3: Verify & Run
```powershell
# Close PowerShell and open NEW one

# Verify Java 17
java -version
# Should show: openjdk version "17.0.x"

# Clean Gradle cache
Remove-Item -Recurse -Force "$env:USERPROFILE\.gradle\caches"

# Run the app!
npm run android
```

---

## 📚 Additional Setup Needed:

### 1. Android SDK in PATH
After Java 17, you'll need Android SDK tools accessible.

**Quick fix:**
```powershell
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', "$env:LOCALAPPDATA\Android\Sdk", 'User')
$androidPath = "$env:LOCALAPPDATA\Android\Sdk\platform-tools;$env:LOCALAPPDATA\Android\Sdk\emulator"
$currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'User')
[System.Environment]::SetEnvironmentVariable('Path', "$currentPath;$androidPath", 'User')
```

### 2. Android Emulator Running
- Open Android Studio
- Device Manager → Create Device
- Start emulator

---

## 📖 Full Documentation:

1. **install-java17.ps1** - Interactive Java 17 installer
2. **CRITICAL_JAVA17_REQUIRED.md** - Why Java 17 is required
3. **START_HERE.md** - Android SDK setup
4. **ANDROID_SETUP_FIX.md** - Complete setup guide
5. **ANDROID_STUDIO_GUIDE.md** - How to run in Android Studio

---

## 🎯 Summary Order:

1. ✅ Install Java 17 (YOU ARE HERE)
2. ⏭️ Add Android SDK to PATH
3. ⏭️ Create Android emulator
4. ⏭️ Run: `npm run android`

---

## 🚀 Quick Start After Java 17:

```powershell
# 1. Download Java 17
.\install-java17.ps1

# 2. After installation, in NEW PowerShell:
java -version  # Verify shows 17

# 3. Clean cache
Remove-Item -Recurse -Force "$env:USERPROFILE\.gradle\caches"

# 4. Set Android SDK PATH (if not done)
# See START_HERE.md

# 5. Start emulator from Android Studio

# 6. Run app
npm run android
```

---

**Start with:** `.\install-java17.ps1` **NOW!** 🎉
