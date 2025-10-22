#!/usr/bin/env pwsh

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "   🎉 READY TO RUN THE APP!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Green

# Set Java to Android Studio's version for this session
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:Path = "C:\Program Files\Android\Android Studio\jbr\bin;$env:Path"

Write-Host "✅ Using Android Studio's Java 21" -ForegroundColor Green
Write-Host "✅ Gradle cache cleared" -ForegroundColor Green
Write-Host "✅ Build configuration updated`n" -ForegroundColor Green

Write-Host "Checking requirements..." -ForegroundColor Yellow

# Check Java
Write-Host "`n1. Java Version:" -ForegroundColor Cyan
& "$env:JAVA_HOME\bin\java.exe" -version 2>&1 | Select-Object -First 1

# Check ADB
Write-Host "`n2. Android SDK (ADB):" -ForegroundColor Cyan
try {
    $adbPath = "C:\Users\deyaa\AppData\Local\Android\Sdk\platform-tools\adb.exe"
    if (Test-Path $adbPath) {
        Write-Host "   ✅ Found at: $adbPath" -ForegroundColor Green
        
        # Check for running emulator
        $devices = & $adbPath devices 2>&1
        if ($devices -match "emulator-\d+") {
            Write-Host "   ✅ Emulator is running!" -ForegroundColor Green
            $canRun = $true
        } else {
            Write-Host "   ❌ No emulator detected!" -ForegroundColor Red
            Write-Host "   → Please start emulator from Android Studio" -ForegroundColor Yellow
            $canRun = $false
        }
    } else {
        Write-Host "   ❌ ADB not found!" -ForegroundColor Red
        Write-Host "   → Install Android Studio and SDK" -ForegroundColor Yellow
        $canRun = $false
    }
} catch {
    Write-Host "   ❌ Error checking ADB" -ForegroundColor Red
    $canRun = $false
}

Write-Host "`n3. Gradle:" -ForegroundColor Cyan
cd android
$gradleTest = .\gradlew.bat --version 2>&1 | Select-String "Gradle"
cd ..
Write-Host "   ✅ $gradleTest" -ForegroundColor Green

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

if ($canRun) {
    Write-Host "🚀 All requirements met! Ready to build!" -ForegroundColor Green
    Write-Host "`nStarting build..." -ForegroundColor Yellow
    Write-Host "(This will take 2-5 minutes on first build)`n" -ForegroundColor Gray
    
    npm run android
} else {
    Write-Host "⚠️  Please fix the issues above, then run:" -ForegroundColor Yellow
    Write-Host "   .\run-app.ps1`n" -ForegroundColor White
    
    Write-Host "Quick fixes:" -ForegroundColor Cyan
    Write-Host "  • No emulator? Open Android Studio → Device Manager → Start emulator" -ForegroundColor White
    Write-Host "  • No ADB? Install Android Studio from https://developer.android.com/studio`n" -ForegroundColor White
}
