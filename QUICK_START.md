# 🚀 Localix CKI - Quick Start Commands

## Démarrage en 5 minutes

### Étape 1: Vérifier les prérequis (2 min)

```powershell
# Vérifier Python
python --version
# Doit afficher: Python 3.12.x

# Vérifier Node.js
node --version
# Doit afficher: v20.x.x ou supérieur

# Vérifier Ollama
ollama --version
# Doit afficher: Ollama version

# Vérifier modèles IA
ollama list
# Doit montrer: llama3.1:8b et/ou ministral-3:3b
```

---

### Étape 2: Démarrer le Backend (1 min)

**Option A: Script automatique (Recommandé)**
```powershell
cd c:\Localix\backend
.\start.bat
```

**Option B: Commandes manuelles**
```powershell
cd c:\Localix\backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py
```

**✅ Succès:** Backend tourne sur http://localhost:8000

---

### Étape 3: Démarrer le Frontend (2 min)

**Option A: Script automatique (Recommandé)**
```powershell
cd c:\Localix\frontend
.\start.bat
```

**Option B: Commandes manuelles**
```powershell
cd c:\Localix\frontend
npm install
npm run dev
```

**✅ Succès:** Frontend tourne sur http://localhost:5173

---

## Accès à l'Application

### Interface Utilisateur
```
http://localhost:5173
```

### API Documentation (Swagger UI)
```
http://localhost:8000/docs
```

### API Health Check
```
http://localhost:8000/api/health
```

---

## Commandes Essentielles

### Backend

```powershell
# Activer environnement virtuel
cd c:\Localix\backend
.\venv\Scripts\Activate.ps1

# Installer dépendances
pip install -r requirements.txt

# Démarrer serveur
python main.py

# Démarrer avec rechargement automatique (dev)
uvicorn api.main:app --reload --port 8000

# Tester endpoint
curl http://localhost:8000/api/health

# Voir logs temps réel
# (logs s'affichent dans le terminal)
```

---

### Frontend

```powershell
# Installer packages
cd c:\Localix\frontend
npm install

# Démarrer dev server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview

# Linter code
npm run lint
```

---

### Ollama AI

```powershell
# Voir modèles installés
ollama list

# Télécharger modèle recommandé
ollama pull llama3.1:8b

# Télécharger modèle alternatif
ollama pull ministral-3:3b

# Démarrer serveur Ollama
ollama serve

# Tester modèle
ollama run llama3.1:8b "Hello, how are you?"
```

---

## Test Rapide des Fonctionnalités

### 1. Dashboard (Données temps réel)
```
http://localhost:5173/
```
→ Vérifier stats cards affichent données backend

---

### 2. Base Vulnérabilités
```
http://localhost:5173/vulnerabilities
```
→ Tableau doit afficher CVEs (vide au début)

---

### 3. Configuration IA
```
http://localhost:5173/settings → Onglet "AI Models"
```
→ Doit afficher: "Ollama AI Service - CONNECTED" (vert)

---

### 4. Scraper Manuel
**Swagger UI:** `http://localhost:8000/docs`

1. Trouver `POST /api/scraper/scrape-now`
2. Cliquer "Try it out"
3. Body:
```json
{
  "source_name": "NVD NIST",
  "limit": 5
}
```
4. Exécuter
5. Attendre ~30 secondes

---

### 5. Analyse IA
**Swagger UI:** `http://localhost:8000/docs`

1. Trouver `POST /api/analyze/article`
2. Body:
```json
{
  "content": "Critical vulnerability CVE-2024-1234 found in Microsoft Windows. CVSS 9.8. Threat group APT29 exploiting this."
}
```
3. Exécuter
4. Attendre réponse JSON de l'IA

---

## Dépannage Rapide

### ❌ Backend ne démarre pas

**Erreur: ModuleNotFoundError**
```powershell
cd c:\Localix\backend
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**Erreur: Port 8000 déjà utilisé**
```powershell
# Tuer processus sur port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

---

### ❌ Frontend ne démarre pas

**Erreur: node_modules manquant**
```powershell
cd c:\Localix\frontend
npm install
```

**Erreur: Port 5173 déjà utilisé**
```powershell
# Changer port dans vite.config.ts
# ou tuer processus
```

---

### ❌ Ollama non connecté

**Vérifier installation**
```powershell
ollama --version
# Si erreur → réinstaller depuis ollama.ai
```

**Vérifier service**
```powershell
ollama serve
# Doit démarrer sans erreur
```

**Vérifier modèles**
```powershell
ollama list
# Si vide → télécharger modèles
ollama pull llama3.1:8b
```

---

## URLs de Référence

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | Interface utilisateur |
| **API** | http://localhost:8000 | Backend REST API |
| **Swagger** | http://localhost:8000/docs | Documentation API interactive |
| **Health** | http://localhost:8000/api/health | Status check |
| **Dashboard Stats** | http://localhost:8000/api/dashboard/stats | Stats JSON |
| **Ollama** | http://localhost:11434 | AI service |

---

## Pages Frontend

| Page | URL | Description |
|------|-----|-------------|
| Dashboard | `/` | Vue globale menaces |
| Vulnérabilités | `/vulnerabilities` | Base CVE |
| Threat Intel | `/threat-intelligence` | Acteurs & IOC |
| Knowledge Graph | `/knowledge-graph` | Relations entités |
| Alertes | `/alerts` | Notifications |
| Rapports | `/reports` | Génération rapports |
| Paramètres | `/settings` | Configuration |

---

## Endpoints API Principaux

### Santé & Stats
```bash
GET /api/health                    # Status backend
GET /api/dashboard/stats           # Statistiques dashboard
```

### Vulnérabilités
```bash
GET /api/vulnerabilities           # Liste toutes
POST /api/vulnerabilities          # Créer nouvelle
GET /api/vulnerabilities/{id}      # Détails une
PUT /api/vulnerabilities/{id}      # Mettre à jour
```

### Threat Intelligence
```bash
GET /api/threats                   # Acteurs menace
POST /api/threats                  # Créer acteur
GET /api/iocs                      # Indicateurs compromission
POST /api/iocs                     # Ajouter IOC
```

### AI Analysis
```bash
GET /api/ai/models                 # Modèles disponibles
POST /api/ai/model/switch          # Changer modèle
POST /api/analyze/article          # Analyser article
POST /api/analyze/extract-iocs     # Extraire IOC
```

### Scraper
```bash
GET /api/scraper/sources           # Sources scraping
POST /api/scraper/sources          # Ajouter source
POST /api/scraper/scrape-now       # Lancer scrape manuel
```

### Alerts & Reports
```bash
GET /api/alerts                    # Liste alertes
POST /api/alerts                   # Créer alerte
GET /api/reports                   # Liste rapports
POST /api/reports/generate         # Générer rapport
```

---

## Astuces de Développement

### 1. Hot Reload

**Backend:**
```powershell
uvicorn api.main:app --reload --port 8000
```
→ Recharge automatiquement quand code modifié

**Frontend:**
```powershell
npm run dev
```
→ Recharge automatiquement quand composants modifiés

---

### 2. Testing API avec curl

```powershell
# Health check
curl http://localhost:8000/api/health

# Dashboard stats
curl http://localhost:8000/api/dashboard/stats

# Vulnerabilities with filters
curl "http://localhost:8000/api/vulnerabilities?skip=0&limit=10&severity=critical"

# Create threat actor
curl -X POST http://localhost:8000/api/threats ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"APT29\",\"threat_level\":\"high\"}"
```

---

### 3. Testing API avec PowerShell

```powershell
# Get data
Invoke-RestMethod -Uri "http://localhost:8000/api/vulnerabilities"

# Post data
Invoke-RestMethod -Method POST `
  -Uri "http://localhost:8000/api/threats" `
  -ContentType "application/json" `
  -Body '{"name":"APT29","threat_level":"high"}'
```

---

### 4. Database SQLite

```powershell
# Ouvrir database
sqlite3 c:\Localix\backend\localix.db

# Voir tables
.tables

# Voir vulnérabilités
SELECT * FROM vulnerabilities;

# Compter entrées
SELECT COUNT(*) FROM vulnerabilities;
```

---

### 5. Logs & Debugging

**Backend logs:**
- S'affichent dans terminal où backend tourne
- Incluent: timestamps, niveaux INFO/ERROR
- Voir erreurs scraping et analyse IA

**Frontend logs:**
- Ouvrir DevTools (F12)
- Onglet "Console"
- Voir erreurs JavaScript et appels API

---

## Workflow Typique

### Session de développement:

1. **Démarrer backend**
   ```powershell
   cd c:\Localix\backend
   .\start.bat
   ```

2. **Démarrer frontend**
   ```powershell
   cd c:\Localix\frontend
   .\start.bat
   ```

3. **Ouvrir navigateur**
   - http://localhost:5173 (UI)
   - http://localhost:8000/docs (API docs)

4. **Développer features**
   - Modifications auto-rechargées
   - Tester dans navigateur
   - Voir logs en temps réel

5. **Tester intégration**
   - Scraper données
   - Analyser avec IA
   - Vérifier dashboard

6. **Arrêter serveurs**
   - Ctrl+C dans chaque terminal

---

## Prochaines Étapes

### Après démarrage réussi:

1. ✅ **Explorer interface**
   - Naviguer entre pages
   - Vérifier responsive design
   - Tester filtres et recherche

2. ✅ **Tester scraping**
   - Lancer scraper manuel
   - Vérifier données collectées
   - Contrôler logs

3. ✅ **Tester IA**
   - Soumettre articles
   - Vérifier analyses
   - Changer modèle si besoin

4. ✅ **Créer données test**
   - Ajouter menaces
   - Créer alertes
   - Générer rapports

5. ✅ **Lire documentation**
   - `README.md` - Vue ensemble
   - `SETUP_GUIDE.md` - Installation détaillée
   - `AI_SETUP_GUIDE.md` - Configuration IA
   - `TEST_PLAN.md` - Tests complets

---

## Support & Ressources

### Documentation complète:
- `README.md` - Overview projet
- `SETUP_GUIDE.md` - Guide installation
- `PROJECT_SUMMARY.md` - Résumé complet
- `QUICK_REFERENCE.md` - Référence commandes
- `INTEGRATION_GUIDE.md` - Intégration frontend-backend
- `IMPLEMENTATION_COMPLETE.md` - Conformité cahier charges
- `AI_SETUP_GUIDE.md` - Configuration IA
- `TEST_PLAN.md` - Plan tests

### URLs utiles:
- **Ollama:** https://ollama.ai
- **FastAPI:** https://fastapi.tiangolo.com
- **React:** https://react.dev
- **TailwindCSS:** https://tailwindcss.com

---

## Checklist Démarrage Rapide

- [ ] Python 3.12+ installé
- [ ] Node.js 20+ installé
- [ ] Ollama installé et fonctionnel
- [ ] Modèle IA téléchargé (llama3.1:8b)
- [ ] Backend démarré (port 8000)
- [ ] Frontend démarré (port 5173)
- [ ] Health check OK (http://localhost:8000/api/health)
- [ ] Dashboard accessible (http://localhost:5173)
- [ ] Swagger UI accessible (http://localhost:8000/docs)
- [ ] Ollama connecté (Settings → AI Models)

**Temps estimé:** 5 minutes  
**Difficulté:** ⭐☆☆☆ Facile

---

**Dernière mise à jour:** March 3, 2026  
**Version:** 1.0.0  
**Statut:** ✅ Production Ready
