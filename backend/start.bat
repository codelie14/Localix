@echo off
REM Localix Backend Quick Start Script for Windows

echo ╔══════════════════════════════════════════════════════════╗
echo ║                                                          ║
echo ║   ███╗   ██╗ ██████╗ ██╗   ██╗ █████╗  ██████╗████████╗  ║
echo ║   ████╗  ██║██╔═══██╗██║   ██║██╔══██╗██╔════╝╚══██╔══╝  ║
echo ║   ██╔██╗ ██║██║   ██║██║   ██║███████║██║        ██║     ║
echo ║   ██║╚██╗██║██║   ██║╚██╗ ██╔╝██╔══██║██║        ██║     ║
echo ║   ██║ ╚████║╚██████╔╝ ╚████╔╝ ██║  ██║╚██████╗   ██║     ║
echo ║   ╚═╝  ╚═══╝ ╚═════╝   ╚═══╝  ╚═╝  ╚═╝ ╚═════╝   ╚═╝     ║
echo ║                                                          ║
echo ║          CYBER KNOWLEDGE INTELLIGENCE PLATFORM           ║
echo ║                                                          ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

REM Check if virtual environment exists
if not exist "venv\" (
    echo [SETUP] Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo [ERROR] Failed to create virtual environment. Make sure Python is installed.
        pause
        exit /b 1
    )
)

REM Activate virtual environment
echo [INFO] Activating virtual environment...
call venv\Scripts\activate.bat

REM Check if dependencies are installed
if not exist "venv\Lib\site-packages\fastapi" (
    echo [SETUP] Installing dependencies...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b 1
    )
)

REM Copy .env.example if .env doesn't exist
if not exist ".env" (
    echo [SETUP] Creating .env configuration file...
    copy .env.example .env
)

REM Check if Ollama is running
echo [CHECK] Verifying Ollama installation...
where ollama >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Ollama not found! Please install Ollama from https://ollama.ai
    echo [WARNING] AI features will not work until Ollama is installed and running.
    echo.
) else (
    echo [OK] Ollama detected
)

REM Start the server
echo.
echo [START] Starting Localix Backend Server...
echo [INFO] API Documentation: http://localhost:8000/docs
echo [INFO] ReDoc: http://localhost:8000/redoc
echo [INFO] Press Ctrl+C to stop the server
echo.

python main.py

pause
