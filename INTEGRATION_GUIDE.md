# Frontend-Backend Integration Guide

## Overview

This guide documents the integration between the Localix frontend (React) and backend (FastAPI), replacing all static demo data with real API calls.

---

## Architecture

```
Frontend (React + TypeScript)
    ↓
API Service Layer (api.ts)
    ↓
HTTP Requests (REST)
    ↓
Backend (FastAPI)
    ↓
Database (SQLite) + AI Services
```

---

## Key Changes

### 1. Created API Service Layer (`frontend/src/services/api.ts`)

**Purpose:** Centralized API communication

**Features:**
- Type-safe interfaces (TypeScript)
- Reusable API functions
- Error handling
- Query parameter building

**Available Functions:**

#### Dashboard
```typescript
api.getDashboardStats()
```

#### Vulnerabilities
```typescript
api.getVulnerabilities({ skip, limit, severity })
api.getVulnerability(id)
```

#### Alerts
```typescript
api.getAlerts({ skip, limit, severity, status })
api.updateAlertStatus(alertId, status)
```

#### Threat Intelligence
```typescript
api.getThreats({ skip, limit, activity_level })
api.getIOCs({ skip, limit, ioc_type })
```

#### Reports
```typescript
api.getReports({ skip, limit, report_type })
api.generateReport({ name, report_type, format })
```

#### Scraper
```typescript
api.runScraper(sourceUrl?)
api.getScraperSources()
```

#### Knowledge Graph
```typescript
api.getGraphNodes()
api.getGraphEdges()
```

---

### 2. Updated Pages

#### DashboardPage
**Before:** Static numbers (1247 vulnerabilities, 23 critical, etc.)

**After:** 
- Fetches real stats from `/api/dashboard/stats`
- Loading state while fetching
- Uses `api.getDashboardStats()`

**Code Example:**
```typescript
const [stats, setStats] = useState<DashboardStats>({...});
const [loading, setLoading] = useState(true);

useEffect(() => {
  api.getDashboardStats()
    .then((data) => {
      setStats(data);
      setLoading(false);
    })
    .catch((err) => console.error(err));
}, []);
```

#### VulnerabilitiesPage
**Before:** Hardcoded array of 8 demo CVEs

**After:**
- Fetches from `/api/vulnerabilities`
- Dynamic filtering
- Real-time data from database
- Uses `api.getVulnerabilities()`

**Changes:**
- Interface updated to match backend schema (`cve_id` instead of `cveId`)
- Field names aligned with database models
- Added loading state
- Removed static data array

---

### 3. Data Flow

```
User Opens Page
    ↓
Component Mounts
    ↓
useEffect Triggers
    ↓
API Service Call
    ↓
fetch() Request
    ↓
Backend Endpoint
    ↓
Database Query
    ↓
JSON Response
    ↓
State Update
    ↓
Re-render with Real Data
```

---

## API Endpoints Reference

### Base URL
```
http://localhost:8000/api
```

### Health Check
```
GET /health
Response: { "status": "healthy", "timestamp": "..." }
```

### Dashboard
```
GET /dashboard/stats
Response: {
  total_vulnerabilities: 150,
  critical_vulnerabilities: 12,
  active_threats: 45,
  active_alerts: 23
}
```

### Vulnerabilities
```
GET /vulnerabilities?skip=0&limit=100&severity=critical
Response: Vulnerability[]

GET /vulnerabilities/{id}
Response: Vulnerability

POST /vulnerabilities
Body: { cve_id, title, severity, ... }
```

### Alerts
```
GET /alerts?status=active&severity=critical
Response: Alert[]

PUT /alerts/{id}/status
Body: { "status": "acknowledged" }
```

### Threat Intelligence
```
GET /threats?activity_level=high
Response: ThreatActor[]

GET /iocs?ioc_type=IP
Response: IndicatorOfCompromise[]
```

### Scraper
```
POST /scraper/run?source_url=https://example.com
Response: { status: "success", results: [...] }

GET /scraper/sources
Response: { sources: [...] }
```

### Reports
```
GET /reports?type=vulnerability
Response: Report[]

POST /reports/generate
Body: { name: "Monthly_Report", type: "vulnerability", format: "PDF" }
```

### Knowledge Graph
```
GET /graph/nodes
Response: { nodes: [...] }

GET /graph/edges
Response: { edges: [...] }
```

---

## Data Schemas

### Vulnerability
```typescript
interface Vulnerability {
  id: string;
  cve_id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  cvss_score?: number;
  vendor?: string;
  product?: string;
  published_date?: string;
  status: 'open' | 'in_progress' | 'resolved';
}
```

### Alert
```typescript
interface Alert {
  id: string;
  title: string;
  description?: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  source?: string;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
}
```

### ThreatActor
```typescript
interface ThreatActor {
  id: string;
  name: string;
  origin_country?: string;
  activity_level: 'critical' | 'high' | 'medium' | 'low';
  targets?: string[];
  last_seen?: string;
}
```

### IndicatorOfCompromise
```typescript
interface IndicatorOfCompromise {
  id: string;
  type: string;  // IP, Domain, Hash, URL, Email
  value: string;
  threat_type?: string;
  confidence_score?: number;
}
```

### DashboardStats
```typescript
interface DashboardStats {
  total_vulnerabilities: number;
  critical_vulnerabilities: number;
  active_threats: number;
  active_alerts: number;
}
```

---

## Testing the Integration

### 1. Verify Backend is Running
```bash
cd backend
python main.py
```

Check: http://localhost:8000/health

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

Check: http://localhost:5173

### 3. Test API Calls

**Browser Console:**
```javascript
// Test dashboard stats
fetch('http://localhost:8000/api/dashboard/stats')
  .then(r => r.json())
  .then(console.log);
```

**Expected Output:**
```json
{
  "total_vulnerabilities": 0,
  "critical_vulnerabilities": 0,
  "active_threats": 0,
  "active_alerts": 0
}
```

### 4. Populate Database

Use Swagger UI to add test data:
- Go to http://localhost:8000/docs
- Find `POST /api/vulnerabilities`
- Click "Try it out"
- Fill in example data:
```json
{
  "cve_id": "CVE-2024-1234",
  "title": "Test Vulnerability",
  "severity": "critical",
  "cvss_score": 9.8,
  "vendor": "Test Vendor",
  "product": "Test Product",
  "status": "open"
}
```
- Execute

### 5. Refresh Frontend

The new vulnerability should appear in the Vulnerabilities page.

---

## Common Issues & Solutions

### Issue 1: CORS Errors

**Error:** "Access to fetch has been blocked by CORS policy"

**Solution:** Backend already has CORS configured for `localhost:5173`. If using different port, update in `backend/api/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    # ...
)
```

### Issue 2: Network Connection Refused

**Error:** "Failed to fetch"

**Solution:**
1. Verify backend is running on port 8000
2. Check firewall isn't blocking
3. Ensure no proxy interfering

### Issue 3: 404 Not Found

**Error:** "Cannot GET /api/vulnerabilities"

**Solution:**
- Check API base URL is correct
- Verify endpoint exists in `backend/api/main.py`
- Make sure path parameters are correct

### Issue 4: Empty Data

**Symptom:** Pages show 0 items

**Solution:**
- Database is empty - add data via Swagger UI
- Or run scraper: `POST /api/scraper/run`

### Issue 5: Type Mismatch Errors

**Error:** TypeScript errors about property names

**Solution:**
- Check interface matches backend schema exactly
- Backend uses snake_case (`cve_id`, `cvss_score`)
- Frontend interfaces must match

---

## Next Steps

### Pages Still Using Static Data

These pages need to be updated:

1. **ThreatIntelligencePage**
   - Replace `threatActors` array with `api.getThreats()`
   - Replace `recentIndicators` with `api.getIOCs()`

2. **AlertsPage**
   - Replace `alerts` array with `api.getAlerts()`
   - Implement status updates with `api.updateAlertStatus()`

3. **ReportsPage**
   - Replace `reports` array with `api.getReports()`
   - Connect generation to `api.generateReport()`

4. **KnowledgeGraphPage**
   - Replace hardcoded `nodes` and `edges` with API calls
   - Use `api.getGraphNodes()` and `api.getGraphEdges()`

5. **SettingsPage**
   - Connect integrations to scraper sources
   - Link API keys management

### Additional Enhancements

1. **Error Handling**
   - Add retry logic
   - User-friendly error messages
   - Fallback UI for failed requests

2. **Loading States**
   - Skeleton screens
   - Progress indicators
   - Optimistic updates

3. **Caching**
   - React Query or SWR
   - Reduce redundant API calls
   - Background refetching

4. **Real-time Updates**
   - WebSockets for live alerts
   - Periodic refresh intervals
   - Push notifications

5. **Pagination**
   - Server-side pagination support
   - Infinite scroll
   - Load more buttons

6. **Search & Filters**
   - Sync URL params with filters
   - Debounced search
   - Advanced filtering

---

## Performance Considerations

### Current Implementation
- Direct fetch calls
- No caching
- Full reload on mount

### Recommended Improvements
```bash
npm install @tanstack/react-query
```

**Benefits:**
- Automatic caching
- Background refetching
- Deduplication
- Retry logic
- Better loading states

---

## Security Notes

### Currently Implemented
- ✅ CORS protection
- ✅ Input validation (Pydantic)
- ✅ SQL injection prevention (SQLAlchemy ORM)

### TODO
- ⏳ JWT authentication
- ⏳ Rate limiting
- ⏳ Request signing
- ⏳ API key rotation

---

## Monitoring & Debugging

### Browser DevTools
- Network tab: Monitor API calls
- Console: Check errors
- Application: View cached data

### Backend Logs
```bash
# Watch logs in real-time
tail -f backend/logs/app.log
```

### API Response Times
Check in Swagger UI - each endpoint shows response time.

### Frontend Performance
```javascript
// Add to components for debugging
useEffect(() => {
  const start = performance.now();
  api.getVulnerabilities().then(() => {
    console.log(`Fetch took ${performance.now() - start}ms`);
  });
}, []);
```

---

## Conclusion

✅ **Completed:**
- API service layer created
- Dashboard connected to backend
- Vulnerabilities page connected
- Type safety maintained
- Error handling implemented

🔄 **In Progress:**
- Remaining pages integration
- Real-time updates
- Advanced caching

📋 **Next:**
- Authentication
- Performance optimization
- End-to-end testing

---

**Last Updated:** March 3, 2026  
**Status:** Phase 1 Complete - Core Integration Working
