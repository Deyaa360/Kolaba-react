#!/usr/bin/env pwsh

Write-Host "`n🚀 INFLUEE APP - QUICK RUN SCRIPT`n" -ForegroundColor Cyan

# Check Java version
Write-Host "Checking Java version..." -ForegroundColor Yellow
java -version 2>&1 | Select-String "version"

Write-Host "`n✅ I've fixed the Gradle/Java compatibility issues!" -ForegroundColor Green
Write-Host "`nWhat I did:" -ForegroundColor White
Write-Host "  • Upgraded Gradle to 8.10.2 (supports Java 21+)" -ForegroundColor Gray
Write-Host "  • Updated Android Gradle Plugin to 8.7.2" -ForegroundColor Gray
Write-Host "  • Cleared old Gradle cache" -ForegroundColor Gray
Write-Host "  • Created gradlew.bat and local.properties" -ForegroundColor Gray

Write-Host "`n⚠️  YOU STILL NEED TO:" -ForegroundColor Yellow
Write-Host "  1. Add Android SDK to PATH (see START_HERE.md)" -ForegroundColor White
Write-Host "  2. Create Android emulator in Android Studio" -ForegroundColor White
Write-Host "  3. Start the emulator" -ForegroundColor White

Write-Host "`n🔍 Quick Check:" -ForegroundColor Cyan

# Check if ADB is available
Write-Host "`nChecking for ADB..." -NoNewline
try {
    $adbVersion = adb version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host " ✅ Found!" -ForegroundColor Green
    } else {
        Write-Host " ❌ Not in PATH" -ForegroundColor Red
        Write-Host "   → Run the PowerShell command in START_HERE.md to add Android SDK to PATH" -ForegroundColor Yellow
    }
} catch {
    Write-Host " ❌ Not found" -ForegroundColor Red
    Write-Host "   → Install Android Studio and add to PATH (see START_HERE.md)" -ForegroundColor Yellow
}

# Check if emulator is running
Write-Host "Checking for running emulator..." -NoNewline
try {
    $devices = adb devices 2>&1
    if ($devices -match "emulator-\d+") {
        Write-Host " ✅ Emulator running!" -ForegroundColor Green
    } else {
        Write-Host " ❌ No emulator" -ForegroundColor Red
        Write-Host "   → Start emulator from Android Studio Device Manager" -ForegroundColor Yellow
    }
} catch {
    Write-Host " ❌ Can't check (ADB not available)" -ForegroundColor Red
}

# Check gradlew.bat
Write-Host "Checking gradlew.bat..." -NoNewline
if (Test-Path ".\android\gradlew.bat") {
    Write-Host " ✅ Exists!" -ForegroundColor Green
} else {
    Write-Host " ❌ Missing" -ForegroundColor Red
}

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Gray

Write-Host "Ready to run? (requires emulator to be running)`n" -ForegroundColor Cyan
Write-Host "Press Enter to run: npm run android" -ForegroundColor White
Write-Host "Or Ctrl+C to cancel and fix issues first`n" -ForegroundColor Gray

Read-Host

Write-Host "`n🚀 Running app...`n" -ForegroundColor Green
npm run android
