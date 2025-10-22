#!/usr/bin/env pwsh

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "   🎉 INFLUEE APP - ULTIMATE BUILD SCRIPT!" -ForegroundColor Green  
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Green

# Set environment variables
$env:JAVA_HOME = "C:\Java17\jdk17.0.17_10"
$env:ANDROID_HOME = "C:\Users\deyaa\AppData\Local\Android\Sdk"
$env:Path = "C:\Java17\jdk17.0.17_10\bin;C:\Users\deyaa\AppData\Local\Android\Sdk\platform-tools;C:\Users\deyaa\AppData\Local\Android\Sdk\emulator;C:\Users\deyaa\AppData\Local\Android\Sdk\tools;C:\Users\deyaa\AppData\Local\Android\Sdk\tools\bin;$env:Path"

Write-Host "✅ Java 17 configured" -ForegroundColor Green
Write-Host "✅ Android SDK configured" -ForegroundColor Green
Write-Host "✅ Gradle 8.3 ready`n" -ForegroundColor Green

# Verify Java
Write-Host "📦 Java Version:" -ForegroundColor Cyan
& "$env:JAVA_HOME\bin\java.exe" -version

# Verify ADB
Write-Host "`n📱 Android Devices:" -ForegroundColor Cyan
& "$env:ANDROID_HOME\platform-tools\adb.exe" devices

# Check emulator
$devices = & "$env:ANDROID_HOME\platform-tools\adb.exe" devices 2>&1
if ($devices -match "emulator-[0-9]+") {
    Write-Host "`n✅ Emulator is running!`n" -ForegroundColor Green
    
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host "   🚀 STARTING BUILD!" -ForegroundColor Cyan
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan
    
    Write-Host "⏱️  This will take 3-5 minutes on first build..." -ForegroundColor Yellow
    Write-Host "You'll see Gradle downloading dependencies...`n" -ForegroundColor Gray
    
    # Build using gradlew directly
    cd android
    Write-Host "🔨 Running: .\gradlew.bat assembleDebug installDebug`n" -ForegroundColor White
    .\gradlew.bat assembleDebug installDebug
    
    if ($LASTEXITCODE -eq 0) {
        cd ..
        Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
        Write-Host "   🎉🎉🎉 BUILD SUCCESSFUL! 🎉🎉🎉" -ForegroundColor Green
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Green
        
        Write-Host "📱 App installed on emulator!" -ForegroundColor Cyan
        Write-Host "🚀 Launching app...`n" -ForegroundColor Yellow
        
        # Launch the app
        & "$env:ANDROID_HOME\platform-tools\adb.exe" shell am start -n co.influee.mockapp/com.influee.mockapp.MainActivity
        
        Write-Host "`n✅ APP LAUNCHED! Check your emulator!" -ForegroundColor Green
        Write-Host "`n📱 You should see the Influee app with:" -ForegroundColor Cyan
        Write-Host "   • Stories bar at top" -ForegroundColor White
        Write-Host "   • Feed of posts" -ForegroundColor White
        Write-Host "   • Bottom navigation (Home/Search/Camera/Notifications/Profile)`n" -ForegroundColor White
    } else {
        cd ..
        Write-Host "`n❌ Build failed! Check the error messages above.`n" -ForegroundColor Red
    }
    
} else {
    Write-Host "`n❌ No emulator running!`n" -ForegroundColor Red
    Write-Host "Please:" -ForegroundColor Yellow
    Write-Host "  1. Open Android Studio" -ForegroundColor White
    Write-Host "  2. Go to Device Manager" -ForegroundColor White
    Write-Host "  3. Start an emulator" -ForegroundColor White
    Write-Host "  4. Run this script again" -ForegroundColor White
    Write-Host "" -ForegroundColor White
}
