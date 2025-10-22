#!/usr/bin/env pwsh

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "   JAVA 17 INSTALLATION - POST-SETUP SCRIPT" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

Write-Host "Checking Java version..." -ForegroundColor Yellow
$javaVersion = & java -version 2>&1 | Select-Object -First 3
Write-Host $javaVersion -ForegroundColor White

if ($javaVersion -match "17\.0") {
    Write-Host "`n✅ SUCCESS! Java 17 is installed and active!`n" -ForegroundColor Green
    
    Write-Host "Now cleaning Gradle cache..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "$env:USERPROFILE\.gradle\caches" -ErrorAction SilentlyContinue
    Write-Host "✅ Gradle cache cleared!`n" -ForegroundColor Green
    
    Write-Host "Checking for Android SDK..." -ForegroundColor Yellow
    if (Test-Path "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe") {
        Write-Host "✅ Android SDK found!`n" -ForegroundColor Green
        
        # Set Android environment variables if not set
        if (-not $env:ANDROID_HOME) {
            Write-Host "Setting ANDROID_HOME..." -ForegroundColor Yellow
            [System.Environment]::SetEnvironmentVariable('ANDROID_HOME', "$env:LOCALAPPDATA\Android\Sdk", 'User')
            $env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
            
            $androidPath = "$env:LOCALAPPDATA\Android\Sdk\platform-tools;$env:LOCALAPPDATA\Android\Sdk\emulator"
            $currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'User')
            if ($currentPath -notlike "*Android\Sdk\platform-tools*") {
                [System.Environment]::SetEnvironmentVariable('Path', "$currentPath;$androidPath", 'User')
            }
            Write-Host "✅ ANDROID_HOME set!`n" -ForegroundColor Green
        } else {
            Write-Host "✅ ANDROID_HOME already set!`n" -ForegroundColor Green
        }
        
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
        Write-Host "   🎉 ALL SET! READY TO RUN!" -ForegroundColor Green
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Green
        
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "  1. Start Android emulator from Android Studio" -ForegroundColor White
        Write-Host "  2. Run: npm run android`n" -ForegroundColor White
        
        Write-Host "⚠️  IMPORTANT: Close this PowerShell and open a NEW one for PATH changes!" -ForegroundColor Yellow
        Write-Host "`nWould you like to run the app now? (Make sure emulator is running!)" -ForegroundColor Cyan
        $response = Read-Host "Run app? [Y/N]"
        
        if ($response -eq 'Y' -or $response -eq 'y') {
            Write-Host "`n🚀 Starting app build...`n" -ForegroundColor Green
            npm run android
        } else {
            Write-Host "`nOK! When ready, run: npm run android`n" -ForegroundColor Yellow
        }
        
    } else {
        Write-Host "❌ Android SDK not found!`n" -ForegroundColor Red
        Write-Host "Please install Android Studio:" -ForegroundColor Yellow
        Write-Host "  https://developer.android.com/studio`n" -ForegroundColor Cyan
    }
    
} else {
    Write-Host "`n❌ Java 17 not detected!`n" -ForegroundColor Red
    
    if ($javaVersion -match "25\.0") {
        Write-Host "You still have Java 25 active." -ForegroundColor Yellow
        Write-Host "`nThis means either:" -ForegroundColor White
        Write-Host "  1. Java 17 installation didn't complete" -ForegroundColor Gray
        Write-Host "  2. You need to close and reopen PowerShell" -ForegroundColor Gray
        Write-Host "  3. JAVA_HOME wasn't set during installation`n" -ForegroundColor Gray
        
        Write-Host "Try this:" -ForegroundColor Cyan
        Write-Host "  1. Close this PowerShell completely" -ForegroundColor White
        Write-Host "  2. Open a NEW PowerShell" -ForegroundColor White
        Write-Host "  3. Run: java -version" -ForegroundColor White
        Write-Host "  4. Should show Java 17`n" -ForegroundColor White
        
        Write-Host "If still Java 25, manually set JAVA_HOME:" -ForegroundColor Yellow
        Write-Host "  [System.Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\Program Files\Eclipse Adoptium\jdk-17.0.13.11-hotspot', 'User')`n" -ForegroundColor Gray
    } else {
        Write-Host "Please complete Java 17 installation and try again.`n" -ForegroundColor Yellow
    }
}

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan
