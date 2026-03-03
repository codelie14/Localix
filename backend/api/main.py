from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import os
import sys

# Add backend directory to path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

from database import engine, get_db
from services import ollama_service, scraper_service
from scheduler import start_schedulers
from data_manager import data_manager
import models
import schemas

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Localix CKI API",
    description="Cyber Knowledge Intelligence Platform API",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Dependency
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # TODO: Implement JWT validation
    return {"username": "admin", "role": "administrator"}


# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}


# Vulnerabilities Endpoints
@app.get("/api/vulnerabilities", response_model=List[schemas.Vulnerability])
async def get_vulnerabilities(
    skip: int = 0,
    limit: int = 100,
    severity: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Vulnerability)
    
    if severity:
        query = query.filter(models.Vulnerability.severity == severity)
    
    vulnerabilities = query.offset(skip).limit(limit).all()
    return vulnerabilities


@app.get("/api/vulnerabilities/{vuln_id}", response_model=schemas.Vulnerability)
async def get_vulnerability(vuln_id: str, db: Session = Depends(get_db)):
    vuln = db.query(models.Vulnerability).filter(
        models.Vulnerability.id == vuln_id
    ).first()
    
    if not vuln:
        raise HTTPException(status_code=404, detail="Vulnerability not found")
    
    return vuln


@app.post("/api/vulnerabilities", response_model=schemas.Vulnerability)
async def create_vulnerability(
    vuln_data: schemas.VulnerabilityCreate,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    db_vuln = models.Vulnerability(**vuln_data.model_dump())
    db.add(db_vuln)
    db.commit()
    db.refresh(db_vuln)
    return db_vuln


# Threat Intelligence Endpoints
@app.get("/api/threats", response_model=List[schemas.ThreatActor])
async def get_threats(
    skip: int = 0,
    limit: int = 100,
    activity_level: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.ThreatActor)
    
    if activity_level:
        query = query.filter(models.ThreatActor.activity_level == activity_level)
    
    threats = query.offset(skip).limit(limit).all()
    return threats


@app.get("/api/iocs", response_model=List[schemas.IndicatorOfCompromise])
async def get_iocs(
    skip: int = 0,
    limit: int = 100,
    ioc_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.IndicatorOfCompromise)
    
    if ioc_type:
        query = query.filter(models.IndicatorOfCompromise.type == ioc_type)
    
    iocs = query.offset(skip).limit(limit).all()
    return iocs


# Alerts Endpoints
@app.get("/api/alerts", response_model=List[schemas.Alert])
async def get_alerts(
    skip: int = 0,
    limit: int = 100,
    severity: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Alert).order_by(models.Alert.timestamp.desc())
    
    if severity:
        query = query.filter(models.Alert.severity == severity)
    
    if status:
        query = query.filter(models.Alert.status == status)
    
    alerts = query.offset(skip).limit(limit).all()
    return alerts


@app.put("/api/alerts/{alert_id}/status", response_model=schemas.Alert)
async def update_alert_status(
    alert_id: str,
    status_update: schemas.AlertStatusUpdate,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    alert = db.query(models.Alert).filter(models.Alert.id == alert_id).first()
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    alert.status = status_update.status
    db.commit()
    db.refresh(alert)
    return alert


# Dashboard Statistics
@app.get("/api/dashboard/stats")
async def get_dashboard_stats(db: Session = Depends(get_db)):
    total_vulns = db.query(models.Vulnerability).count()
    critical_vulns = db.query(models.Vulnerability).filter(
        models.Vulnerability.severity == "critical"
    ).count()
    active_threats = db.query(models.ThreatActor).filter(
        models.ThreatActor.activity_level.in_(["high", "critical"])
    ).count()
    active_alerts = db.query(models.Alert).filter(
        models.Alert.status == "active"
    ).count()
    
    return {
        "total_vulnerabilities": total_vulns,
        "critical_vulnerabilities": critical_vulns,
        "active_threats": active_threats,
        "active_alerts": active_alerts
    }


# AI Analysis Endpoints
@app.get("/api/ai/models")
async def get_available_models():
    """Get list of available AI models"""
    return {
        "current_model": ollama_service.model,
        "available_models": ollama_service.available_models
    }

@app.post("/api/ai/model/switch")
async def switch_ai_model(
    model_request: schemas.ModelSwitchRequest
):
    """Switch to a different AI model"""
    success = ollama_service.set_model(model_request.model_name)
    if success:
        return {"status": "success", "model": ollama_service.model}
    else:
        raise HTTPException(status_code=400, detail="Model not available")

@app.post("/api/analyze/article")
async def analyze_article(
    article_data: schemas.ArticleAnalysisRequest,
    user: dict = Depends(get_current_user)
):
    """Analyze an article using Ollama AI"""
    try:
        analysis = await ollama_service.analyze_article(article_data.content)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")


@app.post("/api/analyze/extract-iocs")
async def extract_iocs(
    text_data: schemas.TextExtractionRequest,
    user: dict = Depends(get_current_user)
):
    """Extract IOCs from text using AI"""
    try:
        iocs = await ollama_service.extract_iocs(text_data.text)
        return {"iocs": iocs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"IOC extraction failed: {str(e)}")


# Scraper Endpoints
@app.post("/api/scraper/run")
async def run_scraper(
    source_url: Optional[str] = None
):
    """Manually trigger scraper"""
    try:
        if source_url:
            results = await scraper_service.scrape_source(source_url)
        else:
            results = await scraper_service.run_all_scrapers()
        
        return {"status": "success", "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scraping failed: {str(e)}")


@app.get("/api/scraper/sources")
async def get_scraper_sources():
    """Get list of configured scraper sources"""
    return {"sources": scraper_service.get_configured_sources()}


# Reports Endpoints
@app.get("/api/reports", response_model=List[schemas.Report])
async def get_reports(
    skip: int = 0,
    limit: int = 100,
    report_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Report)
    
    if report_type:
        query = query.filter(models.Report.report_type == report_type)
    
    reports = query.offset(skip).limit(limit).all()
    return reports


@app.post("/api/reports/generate")
async def generate_report(
    report_request: schemas.ReportGenerateRequest,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    """Generate a new report"""
    # TODO: Implement report generation logic
    report = models.Report(
        name=report_request.name,
        report_type=report_request.report_type,
        format=report_request.format,
        generated_by=user["username"]
    )
    
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


# Knowledge Graph Endpoints
@app.get("/api/graph/nodes")
async def get_graph_nodes(db: Session = Depends(get_db)):
    """Get all nodes for knowledge graph visualization"""
    # Get vulnerabilities
    vulns = db.query(models.Vulnerability).limit(50).all()
    nodes = []
    
    for vuln in vulns:
        nodes.append({
            "id": vuln.id,
            "type": "vulnerability",
            "label": vuln.cve_id,
            "data": vuln.__dict__
        })
    
    # Get threat actors
    threats = db.query(models.ThreatActor).limit(20).all()
    for threat in threats:
        nodes.append({
            "id": threat.id,
            "type": "threat_actor",
            "label": threat.name,
            "data": threat.__dict__
        })
    
    return {"nodes": nodes}


@app.get("/api/graph/edges")
async def get_graph_edges(db: Session = Depends(get_db)):
    """Get all edges for knowledge graph visualization"""
    # TODO: Implement relationship mapping
    return {"edges": []}


# Data Management Endpoints
@app.get("/api/data/stats")
async def get_data_stats():
    """Get data directory statistics"""
    stats = data_manager.get_statistics()
    return stats


@app.get("/api/data/cves/years")
async def list_cve_years():
    """List all years with CVE data"""
    years = data_manager.list_cve_years()
    return {"years": years, "count": len(years)}


@app.get("/api/data/cves/{year}")
async def get_cves_for_year(year: int, limit: int = 50):
    """Get CVE files for a specific year"""
    cve_files = data_manager.get_cve_files_for_year(year)
    cves = []
    
    for cve_file in cve_files[:limit]:
        cve_data = data_manager.load_cve_file(cve_file)
        if cve_data:
            cves.append(cve_data)
    
    return {
        "year": year,
        "count": len(cves),
        "total_available": len(cve_files),
        "cves": cves
    }


@app.post("/api/data/cves/import")
async def import_cve_database(
    source_path: str,
    user: dict = Depends(get_current_user)
):
    """Import CVE database from external source"""
    try:
        from pathlib import Path
        source = Path(source_path)
        
        if not source.exists():
            raise HTTPException(status_code=400, detail="Source path does not exist")
        
        result = data_manager.import_cve_database(source)
        
        return {
            "status": "success",
            "message": f"Imported {result['files_imported']} CVE files",
            "details": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/data/scraper/outputs")
async def list_scraper_outputs():
    """List all scraper output files"""
    outputs = data_manager.list_scraper_outputs()
    return {"outputs": outputs, "count": len(outputs)}


@app.get("/api/data/knowledge/latest")
async def get_latest_knowledge_graph():
    """Get the latest knowledge graph"""
    graph = data_manager.load_latest_graph()
    
    if not graph:
        return {"nodes": [], "edges": []}
    
    return graph


# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize schedulers on startup"""
    await start_schedulers()
