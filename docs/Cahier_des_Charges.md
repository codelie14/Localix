# 🛡 CAHIER DES CHARGES

# Localix : CYBER KNOWLEDGE INTELLIGENCE (CKI)

### Plateforme Locale d’Intelligence et de Veille en Cybersécurité

---

# 1️⃣ Présentation Générale

## 1.1 Contexte

Face à l’évolution constante des cybermenaces, les analystes et chercheurs en cybersécurité ont besoin d’un système autonome capable de :

* Collecter automatiquement des informations techniques
* Analyser intelligemment les vulnérabilités
* Structurer les données
* Générer des alertes stratégiques
* Produire des rapports exploitables

Le projet **Localix** est une plateforme 100% locale permettant la centralisation, l’analyse et la visualisation des données de cybersécurité.

---

# 2️⃣ Stack Technique

## Frontend

* React
* Next.js
* Tailwind CSS

## Backend

* Python (API REST)
* Framework recommandé : FastAPI ou Django REST

## Base de données

* SQLite (Développement)
* MySQL (Production)
* PostgreSQL (Alternative Production)

## Intelligence Artificielle

* Ollama (exécution locale des modèles LLM)

---

# 3️⃣ Objectifs du Projet

## 3.1 Objectif Principal

Développer une plateforme locale d’intelligence cyber capable de :

* Scraper des sources cybersécurité
* Analyser les contenus via IA locale
* Extraire des entités techniques
* Détecter les menaces critiques
* Générer des alertes automatiques
* Construire une base de connaissance évolutive

---

# 4️⃣ Portée Fonctionnelle

---

# 🔎 4.1 Module 1 – Cyber Scraper Engine

### Fonctionnalités

* Scraping automatique de :

  * Bases CVE
  * Blogs cybersécurité
  * CERT
  * GitHub advisories
* Planification automatique (scheduler interne)
* Gestion des erreurs réseau
* Détection de doublons
* Normalisation des contenus
* Mode ajout manuel de source
* Respect robots.txt

---

# 🧠 4.2 Module 2 – AI Intelligence Engine

Utilisation d’Ollama pour :

### Analyse automatique

* Résumé technique
* Extraction :

  * CVE ID
  * CVSS
  * Vendor
  * Produit affecté
  * Version impactée
* Classification :

  * Malware
  * Ransomware
  * Phishing
  * Zero-day
  * Data breach
* Détection exploit public
* Extraction IoC :

  * IP
  * Hash
  * Domain
* Mapping MITRE ATT&CK
* Score de criticité personnalisé (Cyber Threat Index)

---

# 🗄 4.3 Module 3 – Base de Connaissance

### Entités principales

* Vulnerabilities
* Vendors
* Products
* Exploits
* Threat groups
* Indicators of Compromise
* Articles
* Attack patterns
* AI analysis
* Alerts
* Reports

### Exigences

* Relations normalisées
* Indexation full-text
* Historique des modifications
* Migration automatique SQLite → MySQL/PostgreSQL

---

# 📊 4.4 Module 4 – Dashboard Frontend

Interface moderne via Next.js + Tailwind.

### Fonctionnalités

* Vue globale des menaces
* Graphique évolution vulnérabilités
* Heatmap criticité
* Top vendors vulnérables
* Timeline interactive
* Recherche intelligente
* Filtrage multicritères
* Détail complet fiche vulnérabilité
* Score global de menace

---

# 🧬 4.5 Module 5 – Knowledge Graph

* Relations dynamiques :

  * CVE → Produit
  * CVE → Vendor
  * Exploit → Threat group
* Visualisation interactive (graph JS)
* Mise à jour automatique après analyse IA

---

# 🚨 4.6 Module 6 – Système d’Alerte Intelligent

* Alertes par criticité
* Alertes personnalisables
* Notifications in-app
* Historique des alertes
* Déclenchement automatique de rapport

---

# 📄 4.7 Module 7 – Génération de Rapport

* Rapport quotidien
* Rapport hebdomadaire
* Résumé exécutif
* Export :

  * PDF
  * Markdown
  * CSV
* Génération automatique via IA

---

# 5️⃣ Architecture Technique

## 5.1 Architecture Générale

Frontend (Next.js)
↓
API REST Python
↓
Base de données
↓
AI Engine (Ollama)
↓
Scheduler & Scraper

---

## 5.2 Architecture Modulaire Backend

```text
backend/
│
├── api/
├── scraper/
├── ai_engine/
├── models/
├── services/
├── alerts/
├── reports/
├── scheduler/
├── graph/
```

---

# 6️⃣ Exigences Non Fonctionnelles

* 100% exécutable en local
* Code modulaire et maintenable
* Sécurisation API (JWT)
* Protection CSRF
* Validation des entrées
* Logs détaillés
* Documentation technique complète
* Scalabilité future vers cloud

---

# 7️⃣ Sécurité

* Authentification multi-rôle :

  * Admin
  * Analyste
* Protection contre injection SQL
* Validation stricte des entrées
* Isolation des prompts IA
* Journalisation des actions sensibles

---

# 8️⃣ Performance

* Scraping asynchrone
* Limitation du CPU
* Cache intelligent
* Indexation base optimisée
* Pagination API

---

# 9️⃣ Planning Prévisionnel

Phase 1

* Conception DB
* API Backend
* Intégration Ollama simple

Phase 2

* Scraper multi-sources
* Extraction entités
* Dashboard basique

Phase 3

* Knowledge graph
* Alertes intelligentes
* Rapports automatiques

Phase 4

* Optimisation
* Tests
* Documentation

---

# 🔟 Livrables

* Code source complet
* Base de données structurée
* Documentation technique
* Diagrammes UML
* Manuel utilisateur
* Rapport de projet

---

# 🎯 Perspectives d’Évolution

* Intégration SIEM
* Intégration IDS/IPS
* Analyse prédictive ML
* API publique
* Version SaaS future

---

# ✅ Conclusion

Le projet **Localix** est une plateforme locale d’intelligence cyber combinant scraping automatisé, analyse IA locale via Ollama, structuration avancée et visualisation stratégique via React/Next.js.
