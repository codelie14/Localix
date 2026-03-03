# Localix Setup Guide

## Quick Start

This guide will help you set up and run the Localix CKI platform in under 10 minutes.

---

## Prerequisites

### 1. Install Python (Backend)

- Download Python 3.10 or higher from [python.org](https://www.python.org/downloads/)
- Verify installation: `python --version`

### 2. Install Node.js (Frontend)

- Download Node.js 18+ from [nodejs.org](https://nodejs.org/)
- Verify installation: `node --version` and `npm --version`

### 3. Install Ollama (AI Engine)

- **Windows**: Download from [ollama.ai](https://ollama.ai/download)
- Run installer and follow prompts
- After installation, open PowerShell and run:
  ```powershell
  ollama pull llama3.2
  ```
- Verify Ollama is running: `ollama list` should show llama3.2

---

## Backend Setup (5 minutes)

### Step 1: Navigate to backend directory

```powershell
cd c:\Localix\backend
```

### Step 2: Create virtual environment

```powershell
python -m venv venv
```

### Step 3: Activate virtual environment

```powershell
.\venv\Scripts\Activate
```

You should see `(venv)` prefix in your terminal.

### Step 4: Install dependencies

```powershell
pip install -r requirements.txt
```

This may take a few minutes. Wait for completion.

### Step 5: Configure environment

```powershell
copy .env.example .env
```

The default configuration works for local development. No changes needed.

### Step 6: Start backend server

```powershell
python main.py
```

You should see:
```
╔══════════════════════════════════════════════════════════╗
║          CYBER KNOWLEDGE INTELLIGENCE PLATFORM           ║
╚══════════════════════════════════════════════════════════╝

Starting Localix Backend Server...
Host: 0.0.0.0
Port: 8000
```

**Keep this terminal open** - the backend is now running on port 8000.

---

## Frontend Setup (3 minutes)

### Step 1: Open new terminal

Keep the backend terminal running. Open a **new** PowerShell window.

### Step 2: Navigate to frontend directory

```powershell
cd c:\Localix\frontend
```

### Step 3: Install dependencies

```powershell
npm install
```

This installs all required packages (~200MB).

### Step 4: Start development server

```powershell
npm run dev
```

You should see:
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
```

---

## Access the Application

Open your browser and go to: **http://localhost:5173**

You should see the Localix dashboard with:
- ✅ Dashboard overview
- ✅ Vulnerabilities page
- ✅ Threat Intelligence
- ✅ Knowledge Graph
- ✅ Alerts management
- ✅ Reports section
- ✅ Settings

---

## Verify Everything Works

### Backend API Test

Open browser and go to: **http://localhost:8000/docs**

This shows the interactive API documentation. Try these endpoints:

1. **Health Check**: `GET /health`
2. **Dashboard Stats**: `GET /api/dashboard/stats`
3. **List Vulnerabilities**: `GET /api/vulnerabilities`

### Frontend Test

Navigate through the pages:
- Click on each menu item
- Check if charts load
- Try filtering vulnerabilities
- View threat intelligence data

---

## Common Issues & Solutions

### Issue: "Ollama connection error"

**Solution**: Make sure Ollama is installed and running:
```powershell
ollama serve
```

Then in another terminal:
```powershell
ollama pull llama3.2
```

### Issue: "Module not found" in backend

**Solution**: Ensure virtual environment is activated:
```powershell
.\venv\Scripts\Activate
pip install -r requirements.txt
```

### Issue: "Port 8000 already in use"

**Solution**: Either:
1. Stop other applications using port 8000
2. Or change port in `.env`: `PORT=8001`

### Issue: Frontend won't load

**Solution**: 
1. Check backend is running first
2. Clear browser cache
3. Try incognito mode
4. Check console for errors (F12)

---

## Development Workflow

### Making Changes

**Frontend**:
- Edit files in `frontend/src/`
- Hot reload automatically updates browser
- No restart needed

**Backend**:
- Edit files in `backend/`
- With `reload=true`, server auto-restarts
- Or press `Ctrl+C` and run `python main.py` again

### Stopping the Servers

**Frontend**: Press `Ctrl+C` in the frontend terminal

**Backend**: Press `Ctrl+C` in the backend terminal

To restart, just run the commands again.

---

## Next Steps

### 1. Explore the Dashboard

- View pre-loaded vulnerability data
- Check threat intelligence feeds
- Browse knowledge graph visualization

### 2. Configure Scraper Sources

Go to Settings → Integrations and add custom sources:
- Security blogs
- RSS feeds
- CVE databases

### 3. Trigger Manual Scraping

Use API or create a script to scrape:
```powershell
curl -X POST http://localhost:8000/api/scraper/run
```

### 4. Customize AI Analysis

Edit `backend/services/ollama_service.py` to:
- Change AI model
- Customize analysis prompts
- Add new extraction capabilities

---

## Production Deployment

For production use:

### 1. Database Migration

Change in `.env`:
```env
DATABASE_URL=mysql+pymysql://user:password@localhost/localix
```

### 2. Disable Reload

```env
RELOAD=false
```

### 3. Set Secret Key

```env
SECRET_KEY=your-very-secure-random-key-here
```

### 4. Build Frontend

```powershell
npm run build
```

Deploy the `dist/` folder to your web server.

---

## Additional Resources

- **API Documentation**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Project Specs**: See `docs/Cahier_des_Charges.md`
- **Main README**: See `README.md`

---

## Support

If you encounter issues:

1. Check both terminal outputs for errors
2. Verify all prerequisites are installed
3. Ensure Ollama is running
4. Review logs in terminal
5. Check GitHub issues

---

**Happy Monitoring! 🛡️**
