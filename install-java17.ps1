#!/usr/bin/env pwsh

Write-Host "`n🚨 JAVA 17 INSTALLER HELPER`n" -ForegroundColor Red

Write-Host "Current Java Version:" -ForegroundColor Yellow
java -version 2>&1 | Select-Object -First 1

$javaVersion = java -version 2>&1 | Select-String "version" | ForEach-Object { $_ -replace '.*"(\d+).*', '$1' }

if ($javaVersion -eq "17") {
    Write-Host "`n✅ Java 17 is already installed and active!" -ForegroundColor Green
    Write-Host "`nYou can now run the app!" -ForegroundColor Cyan
    Write-Host "  npm run android`n" -ForegroundColor White
    exit 0
}

Write-Host "`n❌ You have Java $javaVersion" -ForegroundColor Red
Write-Host "⚠️  React Native requires Java 17!" -ForegroundColor Yellow

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Gray

Write-Host "OPTION 1: Download Java 17 from Browser (EASIEST)" -ForegroundColor Cyan
Write-Host "  1. Go to: https://adoptium.net/temurin/releases/?version=17" -ForegroundColor White
Write-Host "  2. Download Windows x64 .msi installer" -ForegroundColor White
Write-Host "  3. Run installer (check 'Set JAVA_HOME' option)" -ForegroundColor White
Write-Host "  4. Restart PowerShell" -ForegroundColor White

Write-Host "`nOPTION 2: Download via PowerShell (AUTO)" -ForegroundColor Cyan
Write-Host "  1. Press 'D' to download Java 17 automatically" -ForegroundColor White
Write-Host "  2. Run the installer when download completes" -ForegroundColor White
Write-Host "  3. Restart PowerShell" -ForegroundColor White

Write-Host "`nOPTION 3: Use Android Studio's Java (if installed)" -ForegroundColor Cyan
Write-Host "  Android Studio includes Java 17!" -ForegroundColor White
Write-Host "  Press 'A' to set it up" -ForegroundColor White

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Gray

$choice = Read-Host "Choose: [D]ownload, [A]ndroid Studio Java, [Q]uit"

switch ($choice.ToUpper()) {
    "D" {
        Write-Host "`nDownloading Java 17 installer..." -ForegroundColor Yellow
        $downloadUrl = "https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.13%2B11/OpenJDK17U-jdk_x64_windows_hotspot_17.0.13_11.msi"
        $outputPath = "$env:USERPROFILE\Downloads\jdk-17-installer.msi"
        
        try {
            Invoke-WebRequest -Uri $downloadUrl -OutFile $outputPath -UseBasicParsing
            Write-Host "✅ Downloaded to: $outputPath" -ForegroundColor Green
            Write-Host "`n🚀 Opening installer..." -ForegroundColor Cyan
            Start-Process $outputPath
            Write-Host "`nAfter installation:" -ForegroundColor Yellow
            Write-Host "  1. Close this PowerShell" -ForegroundColor White
            Write-Host "  2. Open NEW PowerShell" -ForegroundColor White
            Write-Host "  3. Run: java -version (should show 17)" -ForegroundColor White
            Write-Host "  4. Run: npm run android`n" -ForegroundColor White
        } catch {
            Write-Host "❌ Download failed!" -ForegroundColor Red
            Write-Host "Please download manually from: https://adoptium.net/temurin/releases/?version=17" -ForegroundColor Yellow
        }
    }
    
    "A" {
        Write-Host "`nLooking for Android Studio Java..." -ForegroundColor Yellow
        $androidStudioPaths = @(
            "C:\Program Files\Android\Android Studio\jbr",
            "C:\Program Files\Android\Android Studio\jre",
            "C:\Program Files (x86)\Android\Android Studio\jbr",
            "C:\Program Files (x86)\Android\Android Studio\jre"
        )
        
        $foundPath = $null
        foreach ($path in $androidStudioPaths) {
            if (Test-Path $path) {
                $foundPath = $path
                break
            }
        }
        
        if ($foundPath) {
            Write-Host "✅ Found Android Studio Java at:" -ForegroundColor Green
            Write-Host "  $foundPath`n" -ForegroundColor White
            
            Write-Host "Setting JAVA_HOME..." -ForegroundColor Yellow
            [System.Environment]::SetEnvironmentVariable('JAVA_HOME', $foundPath, 'User')
            $env:JAVA_HOME = $foundPath
            $env:Path = "$foundPath\bin;$env:Path"
            
            Write-Host "✅ JAVA_HOME set!`n" -ForegroundColor Green
            Write-Host "⚠️  IMPORTANT: Close this PowerShell and open a NEW one!" -ForegroundColor Yellow
            Write-Host "Then verify with: java -version`n" -ForegroundColor White
        } else {
            Write-Host "❌ Android Studio Java not found!" -ForegroundColor Red
            Write-Host "Please install Android Studio or download Java 17 manually.`n" -ForegroundColor Yellow
        }
    }
    
    default {
        Write-Host "`nExiting. Please install Java 17 manually:`n" -ForegroundColor Yellow
        Write-Host "  https://adoptium.net/temurin/releases/?version=17`n" -ForegroundColor Cyan
    }
}
