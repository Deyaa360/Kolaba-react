#!/usr/bin/env pwsh

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "   🎉 INFLUEE APP - FINAL RUN SCRIPT" -ForegroundColor Cyan  
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

# Set environment variables for this PowerShell session
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:ANDROID_HOME = "C:\Users\deyaa\AppData\Local\Android\Sdk"
$env:Path = "C:\Program Files\Android\Android Studio\jbr\bin;C:\Users\deyaa\AppData\Local\Android\Sdk\platform-tools;C:\Users\deyaa\AppData\Local\Android\Sdk\emulator;$env:Path"

Write-Host "✅ Java: Android Studio's Java 21" -ForegroundColor Green
Write-Host "✅ Android SDK: C:\Users\deyaa\AppData\Local\Android\Sdk" -ForegroundColor Green
Write-Host "✅ PATH updated for this session`n" -ForegroundColor Green

Write-Host "Verifying setup..." -ForegroundColor Yellow

# Check Java
Write-Host "`n📦 Java Version:" -ForegroundColor Cyan
& java -version 2>&1 | Select-Object -First 1

# Check ADB
Write-Host "`n📱 Android Devices:" -ForegroundColor Cyan
& adb devices

# Check emulator
$devices = & adb devices 2>&1
if ($devices -match "emulator-\d+") {
    Write-Host "✅ Emulator is running!`n" -ForegroundColor Green
    $ready = $true
} else {
    Write-Host "❌ No emulator running!`n" -ForegroundColor Red
    Write-Host "Please start emulator from Android Studio, then run this script again.`n" -ForegroundColor Yellow
    $ready = $false
}

if ($ready) {
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
    Write-Host "   🚀 STARTING BUILD!" -ForegroundColor Green
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Green
    
    Write-Host "This will take 2-5 minutes on first build..." -ForegroundColor Yellow
    Write-Host "You'll see Gradle downloading dependencies...`n" -ForegroundColor Gray
    
    # Run the app
    npm run android
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
        Write-Host "   🎉🎉🎉 APP LAUNCHED SUCCESSFULLY! 🎉🎉🎉" -ForegroundColor Green
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Green
        Write-Host "Check your Android emulator - the Influee app should be running!" -ForegroundColor Cyan
    } else {
        Write-Host "`n❌ Build failed! Check the error messages above.`n" -ForegroundColor Red
    }
}
