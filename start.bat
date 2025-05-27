@echo off

echo Checking for node installation...

where node >nul 2>nul
if errorlevel 1 (
    echo Node.js is not installed.
    echo Please install it from here: https://nodejs.org/
    pause
    exit /b
)

if exist "node_modules\" (
    echo Skipping dependency installation.
) else (
    echo Installing dependencies...
    cmd /c "npm i --no-audit --silent"
    if errorlevel 1 (
        echo Failed to install dependencies! Please check your internet connection!
        pause
        exit /b
    )
)

node extractor.mjs %1

pause
exit /b