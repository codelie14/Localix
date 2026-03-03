# 🚀 Localix - Quick Reference Guide

## Démarrage Rapide (2 minutes)

### Backend
```powershell
cd c:\Localix\backend
.\start.bat
```

### Frontend (nouveau terminal)
```powershell
cd c:\Localix\frontend
.\start.bat
```

**Accès:** http://localhost:5173

---

## Commandes Essentielles

### Backend

```bash
# Installer dépendances
pip install -r requirements.txt

# Lancer serveur
python main.py

# Avec reload auto
uvicorn api.main:app --reload

# Tests
pytest
```

### Frontend

```bash
# Installer dépendances
npm install

# Mode développement
npm run dev

# Build production
npm run build

# Preview build
npm run preview
```

---

## API Endpoints Principaux

### Dashboard
```bash
GET /api/dashboard/stats
```

### Vulnérabilités
```bash
GET /api/vulnerabilities?severity=critical&limit=10
GET /api/vulnerabilities/{cve_id}
POST /api/vulnerabilities
```

### Alerts
```bash
GET /api/alerts?status=active
PUT /api/alerts/{id}/status
```

### Threat Intel
```bash
GET /api/threats
GET /api/iocs?ioc_type=IP
```

### AI Analysis
```bash
POST /api/analyze/article
{
  "content": "article text..."
}

POST /api/analyze/extract-iocs
{
  "text": "threat report..."
}
```

### Scraper
```bash
POST /api/scraper/run
GET /api/scraper/sources
```

### Reports
```bash
GET /api/reports?type=vulnerability
POST /api/reports/generate
{
  "name": "Monthly_Report",
  "type": "vulnerability",
  "format": "PDF"
}
```

### Knowledge Graph
```bash
GET /api/graph/nodes
GET /api/graph/edges
```

---

## Structure des Données

### Vulnerability
```json
{
  "cve_id": "CVE-2024-0001",
  "title": "Remote Code Execution...",
  "severity": "critical",
  "cvss_score": 9.8,
  "vendor": "Apache",
  "product": "Log4j",
  "status": "open",
  "ai_summary": "...",
  "mitre_tactics": ["TA0002"],
  "mitre_techniques": ["T1203"]
}
```

### Threat Actor
```json
{
  "name": "APT29",
  "origin_country": "Russia",
  "activity_level": "high",
  "targets": ["Government", "Defense"],
  "last_seen": "2024-01-15T10:30:00"
}
```

### Alert
```json
{
  "title": "Suspicious outbound connection",
  "severity": "critical",
  "status": "active",
  "source": "Network Monitor",
  "timestamp": "2024-01-15T14:32:18"
}
```

### IOC
```json
{
  "type": "IP",
  "value": "192.168.1.100",
  "threat_type": "C2 Server",
  "confidence_score": 95
}
```

---

## Configuration (.env)

```bash
# Serveur
HOST=0.0.0.0
PORT=8000
RELOAD=true

# Database
DATABASE_URL=sqlite:///./localix.db

# Ollama
OLLAMA_MODEL=llama3.2
OLLAMA_HOST=http://localhost:11434

# Sécurité
SECRET_KEY=change-this-in-production
```

---

## Pages Frontend

| Route | Composant | Description |
|-------|-----------|-------------|
| `/` | DashboardPage | Vue d'ensemble |
| `/vulnerabilities` | VulnerabilitiesPage | Base CVE |
| `/threat-intelligence` | ThreatIntelligencePage | Menaces globales |
| `/knowledge-graph` | KnowledgeGraphPage | Relations |
| `/alerts` | AlertsPage | Alertes sécurité |
| `/reports` | ReportsPage | Rapports |
| `/settings` | SettingsPage | Configuration |

---

## Composants UI Réutilisables

### StatCard
```tsx
<StatCard
  title="Total Vulnerabilities"
  value={1247}
  icon={BugIcon}
  trend={{ value: 12, isPositive: false }}
  severity="normal"
/>
```

### TerminalTable
```tsx
<TerminalTable
  data={vulnerabilities}
  columns={columns}
  pageSize={10}
  searchPlaceholder="search --cve --vendor"
/>
```

### Button
```tsx
<Button
  onClick={handleClick}
  icon={<ShieldIcon />}
  variant="primary"
>
  Action
</Button>
```

---

## Services Backend

### Ollama Service

```python
from backend.services import ollama_service

# Analyser article
analysis = await ollama_service.analyze_article(content)

# Extraire IOCs
iocs = await ollama_service.extract_iocs(text)

# Classifier menace
classification = await ollama_service.classify_threat(title, description)
```

### Scraper Service

```python
from backend.services import scraper_service

# Scraper une source
result = await scraper_service.scrape_source(url)

# Tout scraper
results = await scraper_service.run_all_scrapers()

# Gérer sources
sources = scraper_service.get_configured_sources()
scraper_service.add_source("My Blog", url, "blog")
```

---

## Modèles SQLAlchemy

### Requête de base

```python
from sqlalchemy.orm import Session
from backend.models import Vulnerability

db = SessionLocal()

# Récupérer vulnérabilités
vulns = db.query(Vulnerability)\
    .filter(Vulnerability.severity == "critical")\
    .limit(10)\
    .all()

# Créer entrée
new_vuln = Vulnerability(
    cve_id="CVE-2024-0001",
    title="Test",
    severity="high"
)
db.add(new_vuln)
db.commit()
```

---

## Scheduler Tasks

### Tâches automatiques

| Tâche | Fréquence | Heure |
|-------|-----------|-------|
| Vuln Scraping | Quotidien | 00:00 |
| Threat Intel | Toutes les heures | :00 |
| Data Cleanup | Quotidien | 02:00 |

### Modifier schedule

```python
# backend/scheduler.py
scheduler.add_job(
    my_function,
    CronTrigger(hour=6, minute=0),  # 6 AM
    id='my_task'
)
```

---

## Testing

### Backend (pytest)

```python
# tests/test_api.py
def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_get_vulnerabilities():
    response = client.get("/api/vulnerabilities")
    assert response.status_code == 200
    assert len(response.json()) > 0
```

### Frontend (Vitest)

```tsx
// src/components/__tests__/StatCard.test.tsx
test('renders StatCard correctly', () => {
  render(<StatCard title="Test" value={100} />);
  expect(screen.getByText('Test')).toBeInTheDocument();
});
```

---

## Dépannage

### Problème: Backend ne démarre pas

```bash
# Vérifier Python
python --version

# Réinstaller dépendances
pip uninstall -y -r requirements.txt
pip install -r requirements.txt

# Vérifier port libre
netstat -ano | findstr :8000
```

### Problème: Frontend erreur

```bash
# Nettoyer cache
rm -rf node_modules package-lock.json
npm install

# Vérifier Node
node --version
npm --version
```

### Problème: Ollama connexion

```bash
# Vérifier service
ollama list

# Redémarrer
ollama serve

# Tester modèle
ollama run llama3.2 "Hello"
```

---

## URLs Utiles

- **Frontend**: http://localhost:5173
- **API Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health**: http://localhost:8000/health

---

## Fichiers Importants

```
Localix/
├── README.md              # Documentation principale
├── SETUP_GUIDE.md         # Guide d'installation
├── PROJECT_SUMMARY.md     # Résumé complet
├── QUICK_REFERENCE.md     # Ce fichier
│
├── frontend/
│   ├── start.bat          # Script démarrage Windows
│   ├── package.json       # Dépendances
│   └── src/
│       ├── App.tsx        # Point d'entrée
│       └── pages/         # Pages principales
│
└── backend/
    ├── start.bat          # Script démarrage Windows
    ├── main.py            # Point d'entrée
    ├── api/main.py        # Routes API
    ├── models/            # Modèles DB
    └── services/          # Services IA + Scraper
```

---

## Bonnes Pratiques

### Code

- ✅ Utiliser TypeScript strict
- ✅ Typage Pydantic pour API
- ✅ Async/await partout
- ✅ Gestion erreurs try/except
- ✅ Logging détaillé
- ✅ Commentaires en anglais

### Sécurité

- ✅ JWT pour auth
- ✅ Hash mots de passe (bcrypt)
- ✅ Validation entrées
- ✅ Protection SQL injection
- ✅ CORS configuré
- ✅ Rate limiting

### Performance

- ✅ Requêtes optimisées
- ✅ Index sur colonnes fréquentes
- ✅ Cache intelligent
- ✅ Pagination API
- ✅ Lazy loading frontend

---

## Ressources Externes

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Docs](https://react.dev/)
- [Ollama Docs](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [MITRE ATT&CK](https://attack.mitre.org/)
- [NVD NIST](https://nvd.nist.gov/)
- [CISA KEV](https://www.cisa.gov/known-exploited-vulnerabilities-catalog)

---

**Développé pour la cybersécurité 🛡️**
