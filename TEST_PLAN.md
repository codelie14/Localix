# 🧪 Localix CKI - Test Plan Complet

## Objectif
Valider toutes les fonctionnalités implémentées selon le cahier des charges.

---

## ✅ Prérequis

### Backend
```powershell
cd c:\Localix\backend
python main.py
```
✅ Backend should start on port 8000

### Frontend
```powershell
cd c:\Localix\frontend
npm run dev
```
✅ Frontend should start on port 5173

### Ollama
```powershell
ollama list
```
✅ Should show llama3.1:8b and/or ministral-3:3b

---

## Test 1: Health Check & API Endpoints

### 1.1 Backend Health
**URL:** `http://localhost:8000/api/health`

**Expected Result:**
```json
{
  "status": "healthy",
  "database": "connected",
  "version": "1.0.0"
}
```

**Status:** ⬜ PASS / ⬜ FAIL

---

### 1.2 Dashboard Statistics
**URL:** `http://localhost:8000/api/dashboard/stats`

**Expected Result:**
```json
{
  "total_vulnerabilities": 0,
  "critical_vulnerabilities": 0,
  "active_threats": 0,
  "active_alerts": 0
}
```

**Status:** ⬜ PASS / ⬜ FAIL

---

## Test 2: Scraper Service

### 2.1 Trigger Manual Scrape
**Endpoint:** `POST http://localhost:8000/api/scraper/scrape-now`

**Request Body:**
```json
{
  "source_name": "NVD NIST",
  "limit": 5
}
```

**Expected:**
- Response: `{"status": "success", "items_found": X}`
- Console logs showing scraping activity
- Database populated with vulnerabilities

**Duration:** ~30 seconds

**Status:** ⬜ PASS / ⬜ FAIL

---

### 2.2 Add Custom Source
**Endpoint:** `POST http://localhost:8000/api/scraper/sources`

**Request Body:**
```json
{
  "name": "Custom Security Blog",
  "url": "https://example.com/security",
  "type": "blog"
}
```

**Expected:**
- Source created in database
- Returns source object with ID

**Status:** ⬜ PASS / ⬜ FAIL

---

## Test 3: AI Analysis Engine

### 3.1 Check AI Models
**URL:** `http://localhost:8000/api/ai/models`

**Expected:**
```json
{
  "current_model": "llama3.1:8b",
  "available_models": [
    "llama3.1:8b",
    "ministral-3:3b",
    "llama3.2:3b"
  ]
}
```

**Status:** ⬜ PASS / ⬜ FAIL

---

### 3.2 Switch AI Model
**Endpoint:** `POST http://localhost:8000/api/ai/model/switch`

**Request Body:**
```json
{
  "model_name": "ministral-3:3b"
}
```

**Expected:**
```json
{
  "status": "success",
  "model": "ministral-3:3b"
}
```

**Status:** ⬜ PASS / ⬜ FAIL

---

### 3.3 Analyze Cybersecurity Article
**Endpoint:** `POST http://localhost:8000/api/analyze/article`

**Request Body:**
```json
{
  "content": "Critical vulnerability CVE-2024-1234 discovered in Microsoft Windows 10 and 11. The flaw allows remote code execution with CVSS score 9.8. Threat group APT29 has been observed exploiting this vulnerability. Malicious IPs: 192.168.1.100, 10.0.0.50. Domain: malware-c2.evil.com"
}
```

**Expected Response Structure:**
```json
{
  "summary": "...",
  "cve_ids": ["CVE-2024-1234"],
  "cvss_scores": {"CVE-2024-1234": 9.8},
  "vendors": ["Microsoft"],
  "products": ["Windows 10", "Windows 11"],
  "threat_classification": "Zero-day",
  "iocs": {
    "ip_addresses": ["192.168.1.100", "10.0.0.50"],
    "domains": ["malware-c2.evil.com"],
    "hashes": []
  },
  "mitre_attack": {
    "tactics": ["TA0002", "TA0008"],
    "techniques": ["T1203", "T1059"]
  },
  "cyber_threat_index": 95
}
```

**Duration:** ~30-60 seconds (depends on model)

**Status:** ⬜ PASS / ⬜ FAIL

---

### 3.4 Extract IOCs from Text
**Endpoint:** `POST http://localhost:8000/api/analyze/extract-iocs`

**Request Body:**
```json
{
  "text": "Suspicious activity detected from 45.33.32.156 connecting to bad-actor.ru. File hash: d41d8cd98f00b204e9800998ecf8427e. Email: phishing@attack.com"
}
```

**Expected:**
```json
{
  "iocs": {
    "ip_addresses": ["45.33.32.156"],
    "domains": ["bad-actor.ru"],
    "urls": [],
    "emails": ["phishing@attack.com"],
    "hashes": ["d41d8cd98f00b204e9800998ecf8427e"]
  }
}
```

**Status:** ⬜ PASS / ⬜ FAIL

---

## Test 4: Vulnerability Management

### 4.1 Get Vulnerabilities List
**URL:** `http://localhost:8000/api/vulnerabilities?skip=0&limit=10`

**Expected:** Array of vulnerability objects or empty array

**Status:** ⬜ PASS / ⬜ FAIL

---

### 4.2 Filter by Severity
**URL:** `http://localhost:8000/api/vulnerabilities?severity=critical`

**Expected:** Only critical severity vulnerabilities

**Status:** ⬜ PASS / ⬜ FAIL

---

### 4.3 Get Single Vulnerability
**URL:** `http://localhost:8000/api/vulnerabilities/{id}`

**Expected:** Full vulnerability details

**Status:** ⬜ PASS / ⬜ FAIL

---

### 4.4 Update Vulnerability Status
**Endpoint:** `PUT http://localhost:8000/api/vulnerabilities/{id}`

**Request Body:**
```json
{
  "status": "in_progress"
}
```

**Expected:** Updated vulnerability object

**Status:** ⬜ PASS / ⬜ FAIL

---

## Test 5: Threat Intelligence

### 5.1 Get Threat Actors
**URL:** `http://localhost:8000/api/threats?skip=0&limit=10`

**Expected:** Array of threat actors or empty array

**Status:** ⬜ PASS / ⬜ FAIL

---

### 5.2 Create Threat Actor
**Endpoint:** `POST http://localhost:8000/api/threats`

**Request Body:**
```json
{
  "name": "APT29",
  "aliases": ["Cozy Bear", "The Dukes"],
  "origin_country": "Russia",
  "threat_level": "high",
  "description": "State-sponsored threat group targeting government entities"
}
```

**Expected:** Created threat actor with ID

**Status:** ⬜ PASS / ⬜ FAIL

---

## Test 6: Indicators of Compromise

### 6.1 Get IOCs
**URL:** `http://localhost:8000/api/iocs?skip=0&limit=20`

**Expected:** Array of IOCs or empty array

**Status:** ⬜ PASS / ⬜ FAIL

---

### 6.2 Add IOC
**Endpoint:** `POST http://localhost:8000/api/iocs`

**Request Body:**
```json
{
  "type": "ip_address",
  "value": "192.168.1.100",
  "threat_level": "high",
  "source": "Threat Intelligence Report",
  "first_seen": "2026-03-03T00:00:00"
}
```

**Expected:** Created IOC with ID

**Status:** ⬜ PASS / ⬜ FAIL

---

## Test 7: Alert System

### 7.1 Get Active Alerts
**URL:** `http://localhost:8000/api/alerts?status=active`

**Expected:** Array of active alerts

**Status:** ⬜ PASS / ⬜ FAIL

---

### 7.2 Create Alert
**Endpoint:** `POST http://localhost:8000/api/alerts`

**Request Body:**
```json
{
  "title": "Critical Vulnerability Detected",
  "severity": "critical",
  "alert_type": "vulnerability",
  "related_entity_id": "CVE-2024-1234",
  "description": "New zero-day vulnerability actively exploited"
}
```

**Expected:** Created alert with auto-generated timestamp

**Status:** ⬜ PASS / ⬜ FAIL

---

### 7.3 Acknowledge Alert
**Endpoint:** `PUT http://localhost:8000/api/alerts/{id}/acknowledge`

**Expected:** Alert status changed to "acknowledged"

**Status:** ⬜ PASS / ⬜ FAIL

---

## Test 8: Reports

### 8.1 Get Reports
**URL:** `http://localhost:8000/api/reports?skip=0&limit=10`

**Expected:** Array of reports or empty array

**Status:** ⬜ PASS / ⬜ FAIL

---

### 8.2 Generate Report
**Endpoint:** `POST http://localhost:8000/api/reports/generate`

**Request Body:**
```json
{
  "report_type": "daily",
  "title": "Daily Threat Intelligence Report",
  "date_range": {
    "start": "2026-03-02",
    "end": "2026-03-03"
  }
}
```

**Expected:**
- Report generated with AI summary
- PDF export available (if weasyprint installed)

**Status:** ⬜ PASS / ⬜ FAIL

---

### 8.3 Export Report as CSV
**Endpoint:** `GET http://localhost:8000/api/reports/{id}/export/csv`

**Expected:** CSV file download

**Status:** ⬜ PASS / ⬜ FAIL

---

## Test 9: Knowledge Graph

### 9.1 Get Graph Data
**URL:** `http://localhost:8000/api/graph/data`

**Expected:**
```json
{
  "nodes": [...],
  "edges": [...]
}
```

**Status:** ⬜ PASS / ⬜ FAIL

---

### 9.2 Search Entities
**URL:** `http://localhost:8000/api/graph/search?q=microsoft`

**Expected:** Matching nodes and relationships

**Status:** ⬜ PASS / ⬜ FAIL

---

## Test 10: Frontend Pages

### 10.1 Dashboard Page
**URL:** `http://localhost:5173/`

**Checklist:**
- ⬜ Stats cards display real data
- ⬜ Charts render correctly
- ⬜ No console errors
- ⬜ Loading states work
- ⬜ Responsive design works

**Status:** ⬜ PASS / ⬜ FAIL

---

### 10.2 Vulnerabilities Page
**URL:** `http://localhost:5173/vulnerabilities`

**Checklist:**
- ⬜ Table displays vulnerabilities
- ⬜ Search/filter works
- ⬜ Pagination works
- ⬜ Detail modal opens
- ⬜ Severity colors correct

**Status:** ⬜ PASS / ⬜ FAIL

---

### 10.3 Threat Intelligence Page
**URL:** `http://localhost:5173/threat-intelligence`

**Checklist:**
- ⬜ Threat actors list displays
- ⬜ IOCs table displays
- ⬜ Charts render
- ⬜ Filters work

**Status:** ⬜ PASS / ⬜ FAIL

---

### 10.4 Knowledge Graph Page
**URL:** `http://localhost:5173/knowledge-graph`

**Checklist:**
- ⬜ Graph renders
- ⬜ Nodes are interactive
- ⬜ Zoom/pan works
- ⬜ Legend displays

**Status:** ⬜ PASS / ⬜ FAIL

---

### 10.5 Alerts Page
**URL:** `http://localhost:5173/alerts`

**Checklist:**
- ⬜ Alerts list displays
- ⬜ Severity badges correct
- ⬜ Acknowledge button works
- ⬜ Filters work

**Status:** ⬜ PASS / ⬜ FAIL

---

### 10.6 Reports Page
**URL:** `http://localhost:5173/reports`

**Checklist:**
- ⬜ Reports list displays
- ⬜ Generate button works
- ⬜ Export buttons work
- ⬜ Preview modal works

**Status:** ⬜ PASS / ⬜ FAIL

---

### 10.7 Settings Page
**URL:** `http://localhost:5173/settings`

**Checklist:**
- ⬜ AI Models tab displays
- ⬜ Ollama status shows (connected/disconnected)
- ⬜ Model selection works
- ⬜ Switch model button works
- ⬜ All tabs accessible

**Status:** ⬜ PASS / ⬜ FAIL

---

## Test 11: Integration Tests

### 11.1 Complete Workflow: Scrape → Analyze → Alert

**Steps:**
1. Trigger scraper to fetch latest CVEs
2. Wait for AI analysis to complete
3. Verify vulnerabilities created in database
4. Check if critical vulnerabilities generate alerts
5. Verify dashboard stats updated

**Expected:** End-to-end workflow completes successfully

**Duration:** ~2-5 minutes

**Status:** ⬜ PASS / ⬜ FAIL

---

### 11.2 AI Analysis → Knowledge Graph Update

**Steps:**
1. Submit article for AI analysis
2. Wait for analysis to complete
3. Navigate to Knowledge Graph page
4. Verify new nodes appear (CVE, vendor, IOC)
5. Verify relationships created

**Expected:** Graph automatically updates with extracted entities

**Status:** ⬜ PASS / ⬜ FAIL

---

### 11.3 Alert → Report Generation

**Steps:**
1. Create critical alert manually
2. Trigger daily report generation
3. Verify alert mentioned in report
4. Export report as PDF
5. Verify PDF contains alert details

**Expected:** Automated reporting workflow

**Status:** ⬜ PASS / ⬜ FAIL

---

## Test 12: Performance Tests

### 12.1 API Response Times

**Endpoints to test:**
- `/api/health` → < 100ms
- `/api/dashboard/stats` → < 500ms
- `/api/vulnerabilities?limit=10` → < 1s
- `/api/analyze/article` → < 60s (AI dependent)

**Tools:** Postman, curl, or browser DevTools

**Status:** ⬜ PASS / ⬜ FAIL

---

### 12.2 Concurrent Users

**Test:** Open 5 browser tabs, all accessing different pages

**Expected:** No slowdowns or errors

**Status:** ⬜ PASS / ⬜ FAIL

---

### 12.3 Large Dataset

**Test:** Import 100+ vulnerabilities, verify UI still responsive

**Expected:** Pagination handles load, no UI freezing

**Status:** ⬜ PASS / ⬜ FAIL

---

## Test 13: Security Tests

### 13.1 SQL Injection Prevention

**Test:** Try SQL injection in search parameters

**Example:**
```
/api/vulnerabilities?search=' OR '1'='1
```

**Expected:** No database errors, safe handling

**Status:** ⬜ PASS / ⬜ FAIL

---

### 13.2 XSS Prevention

**Test:** Try XSS in input fields

**Example:**
```html
<script>alert('XSS')</script>
```

**Expected:** Input sanitized, no script execution

**Status:** ⬜ PASS / ⬜ FAIL

---

### 13.3 Rate Limiting (If implemented)

**Test:** Send 100 requests in 10 seconds

**Expected:** Rate limiter kicks in (if configured)

**Status:** ⬜ PASS / ⬜ FAIL

---

## Test Results Summary

### Overall Pass Rate

| Category | Total Tests | Passed | Failed | Pass Rate |
|----------|-------------|--------|--------|-----------|
| Health & API | 2 | ⬜ | ⬜ | 0% |
| Scraper | 2 | ⬜ | ⬜ | 0% |
| AI Engine | 4 | ⬜ | ⬜ | 0% |
| Vulnerabilities | 4 | ⬜ | ⬜ | 0% |
| Threat Intel | 2 | ⬜ | ⬜ | 0% |
| IOCs | 2 | ⬜ | ⬜ | 0% |
| Alerts | 3 | ⬜ | ⬜ | 0% |
| Reports | 3 | ⬜ | ⬜ | 0% |
| Knowledge Graph | 2 | ⬜ | ⬜ | 0% |
| Frontend Pages | 7 | ⬜ | ⬜ | 0% |
| Integration | 3 | ⬜ | ⬜ | 0% |
| Performance | 3 | ⬜ | ⬜ | 0% |
| Security | 3 | ⬜ | ⬜ | 0% |
| **TOTAL** | **40** | **⬜** | **⬜** | **0%** |

---

## Issues Log

| Issue # | Description | Severity | Status |
|---------|-------------|----------|--------|
| 1 | | Critical | ⬜ Open |
| 2 | | High | ⬜ Open |
| 3 | | Medium | ⬜ Open |

---

## Sign-off

### Development Team
- [ ] Developer: _______________ Date: _______
- [ ] QA Engineer: _____________ Date: _______
- [ ] Project Manager: _________ Date: _______

### Client/Stakeholder
- [ ] Stakeholder: _____________ Date: _______

---

**Test Completion Date:** _______________  
**Overall Status:** ⬜ PASS / ⬜ FAIL / ⬜ CONDITIONAL PASS

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________

---

**Document Version:** 1.0  
**Last Updated:** March 3, 2026
