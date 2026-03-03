@echo off
REM Localix Frontend Quick Start Script for Windows

echo ╔══════════════════════════════════════════════════════════╗
echo ║                                                          ║
echo ║              LOCALIX FRONTEND STARTUP                    ║
echo ║                                                          ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [SETUP] Installing dependencies...
    echo [INFO] This may take a few minutes on first run...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies. Make sure Node.js is installed.
        pause
        exit /b 1
    )
)

REM Start development server
echo.
echo [START] Starting Localix Frontend Development Server...
echo [INFO] Application will be available at: http://localhost:5173
echo [INFO] Press Ctrl+C to stop the server
echo.

call npm run dev

pause
