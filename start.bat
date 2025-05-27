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
    cmd /c "npm i --no-audit"
)

node extractor.mjs %1

pause
exit /b