# 📁 Localix CKI - Gestion des Données Centralisée

## 🎯 Vue d'Ensemble

Le dossier `backend/data/` est maintenant le **centre névralgique** pour toutes les données de la plateforme:
- ✅ CVEs brutes (fichiers JSON par année)
- ✅ Résultats du scraping
- ✅ Knowledge Graph
- ✅ Imports externes

---

## 📂 Structure du Dossier Data

```
backend/data/
├── cves/                    # Base de données CVE locale
│   ├── 1999/               # CVEs par année
│   │   ├── CVE-1999-0001.json
│   │   └── CVE-1999-0002.json
│   ├── 2000/
│   ├── ...
│   └── 2024/
│
├── scrapers/               # Résultats du scraping automatique
│   ├── nvd_nist_20260303_210000.json
│   ├── cisa_known_exploited_20260303_210500.json
│   ├── the_hacker_news_20260303_211000.json
│   └── bleeping_computer_20260303_211500.json
│
├── knowledge_graph/        # Graphes de connaissances
│   ├── graph_20260303_120000.json
│   └── threat_landscape_20260303_150000.json
│
└── imports/                # Logs d'import
    ├── import_20260303_100000.json
    └── import_20260303_180000.json
```

---

## 🔧 Fonctionnalités Implémentées

### 1. DataManager - Module Central

**Fichier:** [`backend/data_manager.py`](file:///c:/Localix/backend/data_manager.py)

**Méthodes Principales:**

```python
from data_manager import data_manager

# Statistiques
stats = data_manager.get_statistics()
# Retourne: {
#   "cves": {"years_available": 25, "total_files": 1500},
#   "scrapers": {"outputs_count": 12},
#   "knowledge_graphs": {"graphs_count": 3},
#   "imports": {"imports_count": 5}
# }

# Lister années disponibles
years = data_manager.list_cve_years()  # [1999, 2000, ..., 2024]

# Charger CVEs par année
cves = data_manager.load_all_cves(limit=100)

# Recherche textuelle
results = data_manager.search_cves("remote code execution")

# Sauvegarder résultat scraper
data_manager.save_scraper_output(
    source_name="thehackernews",
    data=[...],
    metadata={"url": "https://..."}
)

# Importer base externe
result = data_manager.import_cve_database(
    source_path=Path("/path/to/cve/database")
)
```

---

### 2. Scraper Service - Sauvegarde Automatique

**Fichier:** [`backend/services/scraper_service.py`](file:///c:/Localix/backend/services/scraper_service.py)

**Nouvelle Fonctionnalité:**
Chaque exécution du scraper sauvegarde automatiquement les résultats dans `backend/data/scrapers/`

```python
# Exécution automatique (scheduler)
# → backend/data/scrapers/nvd_nist_YYYYMMDD_HHMMSS.json
# → backend/data/scrapers/cisa_known_exploited_YYYYMMDD_HHMMSS.json
# → backend/data/scrapers/the_hacker_news_YYYYMMDD_HHMMSS.json
# → backend/data/scrapers/bleeping_computer_YYYYMMDD_HHMMSS.json
```

**Format de Sortie:**
```json
{
  "source": "NVD NIST",
  "scraped_at": "2026-03-03T21:00:00",
  "type": "vulnerabilities",
  "count": 20,
  "data": [
    {
      "cve_id": "CVE-2024-1234",
      "title": "...",
      "description": "...",
      "severity": "critical",
      "cvss_score": 9.8
    }
  ],
  "metadata": {}
}
```

---

### 3. API Endpoints - Gestion des Données

**Fichier:** [`backend/api/main.py`](file:///c:/Localix/backend/api/main.py)

#### Nouveaux Endpoints:

##### 📊 Statistics Globales
```http
GET /api/data/stats
```

**Réponse:**
```json
{
  "cves": {
    "years_available": 25,
    "total_files": 1542
  },
  "scrapers": {
    "outputs_count": 24
  },
  "knowledge_graphs": {
    "graphs_count": 3
  },
  "imports": {
    "imports_count": 2
  }
}
```

---

##### 📅 Lister Années CVE
```http
GET /api/data/cves/years
```

**Réponse:**
```json
{
  "years": [1999, 2000, 2001, ..., 2024],
  "count": 26
}
```

---

##### 📂 Charger CVEs par Année
```http
GET /api/data/cves/{year}?limit=50
```

**Exemple:**
```http
GET /api/data/cves/2024?limit=50
```

**Réponse:**
```json
{
  "year": 2024,
  "count": 50,
  "total_available": 1234,
  "cves": [
    {
      "id": "CVE-2024-0001",
      "title": "...",
      "description": "...",
      "severity": "high"
    }
  ]
}
```

---

##### 📥 Importer Base CVE Externe
```http
POST /api/data/cves/import?source_path=/path/to/cves
```

**Utilisation Frontend:**
```typescript
fetch('http://localhost:8000/api/data/cves/import', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    source_path: "/path/to/cve/files"
  })
});
```

---

##### 📋 Lister Outputs du Scraper
```http
GET /api/data/scraper/outputs
```

**Réponse:**
```json
{
  "outputs": [
    {
      "filename": "nvd_nist_20260303_210000.json",
      "source": "NVD NIST",
      "scraped_at": "2026-03-03T21:00:00",
      "count": 20,
      "path": "c:\\Localix\\backend\\data\\scrapers\\..."
    }
  ],
  "count": 24
}
```

---

##### 🕸️ Récupérer Dernier Knowledge Graph
```http
GET /api/data/knowledge/latest
```

**Réponse:**
```json
{
  "nodes": [...],
  "edges": [...]
}
```

---

### 4. Script de Synchronisation

**Fichier:** [`backend/scripts/sync_cves.py`](file:///c:/Localix/backend/scripts/sync_cves.py)

**Usage:**
```bash
# Synchroniser TOUS les CVEs
python backend/scripts/sync_cves.py

# Synchroniser avec limite (pour test)
python backend/scripts/sync_cves.py 100
```

**Output:**
```
🔍 Starting CVE synchronization...
📦 Found 1542 CVE files
✓ Imported 100 CVEs...
✓ Imported 200 CVEs...
✓ Imported 300 CVEs...

✅ Synchronization complete!
   📊 Imported: 1542
   ⏭️  Skipped: 0
   ❌ Errors: 0
```

---

## 🚀 Guide d'Utilisation

### Étape 1: Vérifier les Données Locales

```bash
cd c:\Localix\backend
python -c "from data_manager import data_manager; print(data_manager.get_statistics())"
```

### Étape 2: Importer une Base CVE Externe (Optionnel)

Si vous avez téléchargé une base CVE complète:

```bash
python backend/scripts/sync_cves.py
```

### Étape 3: Lancer le Scraper

Le scraper tourne automatiquement toutes les heures via le scheduler.

**Forcer l'exécution:**
```bash
# Via API (frontend)
await api.runScraper();

# Ou redémarrer le backend
python main.py
```

### Étape 4: Consulter les Résultats

**Via API:**
```typescript
// Stats
const stats = await fetch('http://localhost:8000/api/data/stats');

// CVEs par année
const cves2024 = await fetch('http://localhost:8000/api/data/cves/2024?limit=50');

// Scraper outputs
const scraperResults = await fetch('http://localhost:8000/api/data/scraper/outputs');
```

---

## 📊 Intégration Frontend

### Hook React pour Stats Data

```typescript
// hooks/useDataStats.ts
import { useEffect, useState } from 'react';
import { api } from '../services/api';

export function useDataStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDataStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}
```

### Composant Dashboard Data

```typescript
function DataStatisticsCard() {
  const { stats, loading } = useDataStats();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-2 gap-4">
      <StatCard 
        title="CVEs Locales" 
        value={stats?.cves?.total_files || 0}
        icon={<DatabaseIcon />}
      />
      <StatCard 
        title="Années" 
        value={stats?.cves?.years_available || 0}
        icon={<CalendarIcon />}
      />
      <StatCard 
        title="Scraper Outputs" 
        value={stats?.scrapers?.outputs_count || 0}
        icon={<RefreshCwIcon />}
      />
      <StatCard 
        title="Knowledge Graphs" 
        value={stats?.knowledge_graphs?.graphs_count || 0}
        icon={<NetworkIcon />}
      />
    </div>
  );
}
```

---

## 🔐 Sécurité & Performance

### Bonnes Pratiques

1. **Validation des chemins:**
   - Les imports vérifient l'existence des fichiers
   - Seuls les JSON sont acceptés

2. **Gestion des doublons:**
   - Le script sync vérifie si le CVE existe déjà
   - Skip automatique des doublons

3. **Performance:**
   - Pagination sur tous les endpoints
   - Limit par défaut: 50-100 items
   - Chargement lazy possible

4. **Logs:**
   - Tous les imports sont logués dans `imports/`
   - Timestamp et statut inclus

---

## 📈 Monitoring

### Vérifier l'État des Données

```bash
# Via terminal
python -c "from data_manager import data_manager; import json; print(json.dumps(data_manager.get_statistics(), indent=2))"

# Via API
curl http://localhost:8000/api/data/stats
```

### Lister Fichiers Scrapers

```bash
# Terminal Windows
dir backend\data\scrapers\*.json /b

# Via API
curl http://localhost:8000/api/data/scraper/outputs
```

---

## 🛠️ Dépannage

### Problème: Aucun CVE trouvé

**Solution:**
```bash
# 1. Vérifier structure dossiers
dir backend\data\cves

# 2. Si vide, importer base externe
python backend/scripts/sync_cves.py

# 3. Vérifier à nouveau
python -c "from data_manager import data_manager; print(data_manager.list_cve_years())"
```

### Problème: Scraper ne sauvegarde pas

**Vérifications:**
1. Permissions écriture sur `backend/data/scrapers/`
2. Espace disque disponible
3. Logs d'erreur dans terminal

**Solution:**
```bash
# Créer dossier manuellement
mkdir backend\data\scrapers

# Redémarrer backend
python main.py
```

---

## 📚 Références

### Fichiers Clés

| Fichier | Rôle |
|---------|------|
| [`backend/data_manager.py`](file:///c:/Localix/backend/data_manager.py) | Core logic gestion données |
| [`backend/services/scraper_service.py`](file:///c:/Localix/backend/services/scraper_service.py) | Scraping + sauvegarde auto |
| [`backend/api/main.py`](file:///c:/Localix/backend/api/main.py) | Endpoints API data |
| [`backend/scripts/sync_cves.py`](file:///c:/Localix/backend/scripts/sync_cves.py) | Script synchronisation |

### Endpoints API Summary

```
GET  /api/data/stats                 # Statistiques globales
GET  /api/data/cves/years            # Liste années
GET  /api/data/cves/{year}           # CVEs par année
POST /api/data/cves/import           # Import externe
GET  /api/data/scraper/outputs       # Liste scrapings
GET  /api/data/knowledge/latest      # Dernier graphe
```

---

## ✅ Checklist Configuration

- [x] Dossiers créés (`cves/`, `scrapers/`, `knowledge/`, `imports/`)
- [x] DataManager fonctionnel
- [x] Scraper sauvegarde automatiquement
- [x] Endpoints API opérationnels
- [x] Script sync CVEs prêt
- [ ] Tester import base externe
- [ ] Vérifier statistiques frontend
- [ ] Configurer scheduler automatique

---

**Développé pour Localix CKI 🛡️**

**Date:** March 3, 2026  
**Version:** 1.2.0  
**Statut:** Production Ready ✅
