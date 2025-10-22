# 🚨 CRITICAL: Java 25 is NOT Compatible!

## The Problem:
**Gradle's Groovy compiler does NOT support Java 25 (class file major version 69).**

This is a **hard limitation** - no amount of configuration will make it work with Java 25.

---

## ✅ THE ONLY SOLUTION: Install Java 17

### Option 1: Download & Install Java 17 (RECOMMENDED)

1. **Download Temurin JDK 17:**
   - Go to: https://adoptium.net/temurin/releases/?version=17
   - Select:
     - **Operating System:** Windows
     - **Architecture:** x64
     - **Package Type:** JDK
     - **Version:** 17 - LTS
   - Click download `.msi` installer

2. **Run Installer:**
   - Double-click the downloaded `.msi` file
   - Follow the wizard
   - **Important:** Check "Set JAVA_HOME variable" option!
   - Complete installation

3. **Set JAVA_HOME (if not auto-set):**
   ```powershell
   # Find Java 17 installation path (usually C:\Program Files\Eclipse Adoptium\jdk-17.0.x.x-hotspot\)
   
   [System.Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\Program Files\Eclipse Adoptium\jdk-17.0.13.11-hotspot', 'User')
   ```

4. **Verify:**
   ```powershell
   # Close PowerShell and open NEW one
   java -version
   ```
   
   **Should show:** `openjdk version "17.0.x"`

---

### Option 2: Use Portable Java 17 (No Install)

1. **Download:**
   ```powershell
   # Download Java 17 portable
   Invoke-WebRequest -Uri "https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.13%2B11/OpenJDK17U-jdk_x64_windows_hotspot_17.0.13_11.zip" -OutFile "$env:USERPROFILE\Downloads\jdk17.zip"
   
   # Extract to C:\Java17
   Expand-Archive -Path "$env:USERPROFILE\Downloads\jdk17.zip" -DestinationPath "C:\Java17" -Force
   ```

2. **Set for this project only:**
   
   Edit `android/gradle.properties` and add:
   ```properties
   org.gradle.java.home=C:\\Java17\\jdk-17.0.13+11
   ```

---

### Option 3: Use Android Studio's Bundled JDK 17

Android Studio comes with JDK 17!

1. **Find it:**
   - Usually at: `C:\Program Files\Android\Android Studio\jre`
   
2. **Set JAVA_HOME:**
   ```powershell
   [System.Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\Program Files\Android\Android Studio\jre', 'User')
   ```

3. **Verify:**
   ```powershell
   # Close and reopen PowerShell
   java -version
   ```

---

## 🎯 After Installing Java 17:

### Step 1: Verify Java 17 Active
```powershell
java -version
```
**Must show:** `openjdk version "17.0.x"` (NOT 25!)

### Step 2: Clean Gradle Cache
```powershell
Remove-Item -Recurse -Force "$env:USERPROFILE\.gradle\caches"
```

### Step 3: Run the App
```powershell
cd "c:\Users\deyaa\OneDrive\Desktop\apktool\influee\Influee-mock-ugc"
npm run android
```

---

## 📊 Java Version Compatibility Chart

| Java Version | Gradle Support | React Native | Status |
|-------------|----------------|--------------|---------|
| Java 25 | ❌ NO | ❌ NO | **NOT SUPPORTED** |
| Java 21 | ⚠️ Limited | ⚠️ Limited | Partial |
| **Java 17** | ✅ YES | ✅ YES | **RECOMMENDED** |
| Java 11 | ✅ YES | ✅ YES | Works |

---

## 🆘 Quick Links

- **Download Java 17:** https://adoptium.net/temurin/releases/?version=17
- **Gradle Java Compatibility:** https://docs.gradle.org/current/userguide/compatibility.html
- **React Native Requirements:** https://reactnative.dev/docs/environment-setup

---

## 💡 Why This Happens

- **Java 25** produces class files with **major version 69**
- **Gradle 8.10.2** uses **Groovy 3.0.22**
- **Groovy 3.0.22** only supports up to **Java 21** (version 65)
- Result: `Unsupported class file major version 69` error

**There is NO workaround - you MUST use Java 17!**

---

## ✅ Summary

1. Install Java 17 from: https://adoptium.net/temurin/releases/?version=17
2. Set JAVA_HOME to Java 17
3. Close and reopen PowerShell
4. Verify: `java -version` shows 17
5. Clean cache: `Remove-Item -Recurse -Force "$env:USERPROFILE\.gradle\caches"`
6. Run: `npm run android`

**After this, your app WILL build! 🎉**
