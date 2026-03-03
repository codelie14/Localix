# 🛡 Localix - Cyber Knowledge Intelligence (CKI) Platform

Plateforme Locale d'Intelligence et de Veille en Cybersécurité

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)

---

## 🎯 Overview

Localix is a 100% local cybersecurity intelligence platform that enables:

- **Automated scraping** of CVE databases, security blogs, CERT advisories
- **AI-powered analysis** using Ollama (local LLM)
- **Threat intelligence** aggregation and correlation
- **Knowledge graph** visualization
- **Automated alerts** and reporting
- **Dashboard** for comprehensive threat monitoring

---

## ✨ Features

### Frontend (React + Vite + TailwindCSS)

- 📊 Interactive dashboard with real-time statistics
- 🔍 Vulnerability database browser with advanced filtering
- 🧠 Threat intelligence tracking
- 🕸️ Knowledge graph visualization
- 🚨 Alert management system
- 📄 Automated report generation
- ⚙️ Configurable settings and integrations

### Backend (FastAPI + Python)

- 🕷️ Multi-source scraper engine (NVD, CISA, Hacker News, etc.)
- 🤖 AI analysis engine powered by Ollama
  - CVE extraction
  - IOC detection (IPs, Domains, Hashes, URLs)
  - MITRE ATT&CK mapping
  - Threat classification
  - Cyber Threat Index scoring
- 🗄️ SQLite/MySQL/PostgreSQL database support
- 🔄 Scheduled tasks (APScheduler)
- 🔐 JWT authentication (ready)
- 📡 RESTful API

---

## 🏗️ Architecture

```
┌─────────────────┐
│   Frontend      │
│  React + Vite   │
│   (Port 5173)   │
└────────┬────────┘
         │
         │ HTTP/REST
         │
┌────────▼────────┐
│   Backend       │
│   FastAPI       │
│   (Port 8000)   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼──────┐
│SQLite │  │ Ollama  │
│  DB   │  │   AI    │
└──────┘  └─────────┘
```

---

## 📦 Prerequisites

### Frontend

- Node.js >= 18.x
- npm or yarn

### Backend

- Python >= 3.10
- Ollama installed and running locally

### Ollama Setup

1. Install Ollama from [https://ollama.ai](https://ollama.ai)
2. Pull the required model:
   ```bash
   ollama pull llama3.2
   ```

---

## 🚀 Installation

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
copy .env.example .env
# or on Linux/Mac:
cp .env.example .env

# Edit .env and configure your settings

# Start the server
python main.py
```

The backend API will be available at `http://localhost:8000`

---

## 📖 Usage

### Accessing the Application

1. **Frontend Dashboard**: Open `http://localhost:5173` in your browser
2. **API Documentation**: 
   - Swagger UI: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`

### Default Configuration

- Frontend runs on port **5173**
- Backend runs on port **8000**
- Database: SQLite (`localix.db`)
- AI Model: Llama 3.2 via Ollama

### Adding Scraper Sources

You can add custom scraper sources via the API:

```bash
curl -X POST http://localhost:8000/api/scraper/sources \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Security Blog",
    "url": "https://example.com/security",
    "type": "blog"
  }'
```

### Manual Scraper Trigger

```bash
curl -X POST http://localhost:8000/api/scraper/run
```

---

## 📚 API Documentation

### Key Endpoints

#### Vulnerabilities

- `GET /api/vulnerabilities` - List all vulnerabilities
- `GET /api/vulnerabilities/{id}` - Get specific vulnerability
- `POST /api/vulnerabilities` - Create new vulnerability entry

#### Threat Intelligence

- `GET /api/threats` - List threat actors
- `GET /api/iocs` - List indicators of compromise

#### Alerts

- `GET /api/alerts` - List all alerts
- `PUT /api/alerts/{id}/status` - Update alert status

#### AI Analysis

- `POST /api/analyze/article` - Analyze article with AI
- `POST /api/analyze/extract-iocs` - Extract IOCs from text

#### Dashboard

- `GET /api/dashboard/stats` - Get dashboard statistics

Full API documentation available at `/docs` endpoint.

---

## 📁 Project Structure

```
Localix/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── charts/
│   │   │   ├── dashboard/
│   │   │   ├── layout/
│   │   │   └── ui/
│   │   ├── pages/
│   │   ├── App.tsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── api/
│   │   └── main.py
│   ├── models/
│   │   └── __init__.py
│   ├── services/
│   │   ├── ollama_service.py
│   │   └── scraper_service.py
│   ├── database.py
│   ├── schemas.py
│   ├── scheduler.py
│   └── main.py
│
└── docs/
    └── Cahier_des_Charges.md
```

---

## 🔧 Configuration

### Environment Variables

See `backend/.env.example` for all available configuration options:

- **DATABASE_URL**: Database connection string
- **OLLAMA_MODEL**: AI model to use (default: llama3.2)
- **SECRET_KEY**: JWT secret key
- **CORS_ORIGINS**: Allowed frontend origins

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest
```

### Frontend Tests

```bash
cd frontend
npm test
```

---

## 📝 License

This project is part of the Localix CKI initiative.

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

---

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check API documentation at `/docs`
- Review `Cahier_des_Charges.md` for project specifications

---

## 🎯 Roadmap

- [ ] Cloud deployment support
- [ ] SIEM integration
- [ ] Machine learning predictions
- [ ] Public API
- [ ] Multi-user support with roles
- [ ] Enhanced knowledge graph
- [ ] Mobile responsive improvements

---

**Built with ❤️ for Cybersecurity Intelligence**
