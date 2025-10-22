# Simple build script - no fancy formatting
Write-Host "Setting up environment..."

# Set Java 17
$env:JAVA_HOME = "C:\Java17\jdk17.0.17_10"
$env:ANDROID_HOME = "C:\Users\deyaa\AppData\Local\Android\Sdk"
$env:Path = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator;$env:Path"

Write-Host "JAVA_HOME: $env:JAVA_HOME"
Write-Host "ANDROID_HOME: $env:ANDROID_HOME"
Write-Host ""

# Verify Java
Write-Host "Java version:"
& "$env:JAVA_HOME\bin\java.exe" -version
Write-Host ""

# Check emulator
Write-Host "Checking for emulator..."
$devices = & "$env:ANDROID_HOME\platform-tools\adb.exe" devices 2>&1
Write-Host $devices
Write-Host ""

if ($devices -match "emulator-") {
    Write-Host "BUILD STARTING - This will take 3-5 minutes..."
    Write-Host ""
    
    # Build
    cd android
    .\gradlew.bat assembleDebug installDebug
    
    if ($LASTEXITCODE -eq 0) {
        cd ..
        Write-Host ""
        Write-Host "SUCCESS! App installed!"
        Write-Host "Launching app..."
        
        & "$env:ANDROID_HOME\platform-tools\adb.exe" shell am start -n com.influee.mockapp/.MainActivity
        
        Write-Host ""
        Write-Host "DONE! Check your emulator!"
    } else {
        cd ..
        Write-Host "Build failed - check errors above"
    }
} else {
    Write-Host "ERROR: No emulator running"
    Write-Host "Start an emulator in Android Studio and try again"
}
