from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# Vulnerability Schemas
class VulnerabilityBase(BaseModel):
    cve_id: str
    title: str
    description: Optional[str] = None
    severity: str
    cvss_score: Optional[float] = None
    vendor: Optional[str] = None
    product: Optional[str] = None
    affected_versions: Optional[str] = None
    published_date: Optional[datetime] = None
    status: Optional[str] = "open"


class VulnerabilityCreate(VulnerabilityBase):
    pass


class VulnerabilityUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    severity: Optional[str] = None
    cvss_score: Optional[float] = None
    status: Optional[str] = None
    ai_summary: Optional[str] = None


class Vulnerability(VulnerabilityBase):
    id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Threat Actor Schemas
class ThreatActorBase(BaseModel):
    name: str
    aliases: Optional[List[str]] = []
    origin_country: Optional[str] = None
    activity_level: str
    targets: Optional[List[str]] = []
    last_seen: Optional[datetime] = None
    description: Optional[str] = None


class ThreatActorCreate(ThreatActorBase):
    pass


class ThreatActor(ThreatActorBase):
    id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# IOC Schemas
class IndicatorOfCompromiseBase(BaseModel):
    type: str  # IP, Domain, Hash, URL, Email
    value: str
    threat_type: Optional[str] = None
    confidence_score: Optional[int] = None
    source: Optional[str] = None


class IndicatorOfCompromiseCreate(IndicatorOfCompromiseBase):
    pass


class IndicatorOfCompromise(IndicatorOfCompromiseBase):
    id: str
    first_seen: datetime
    last_seen: datetime
    active: bool = True
    created_at: datetime
    
    class Config:
        from_attributes = True


# Alert Schemas
class AlertBase(BaseModel):
    title: str
    description: Optional[str] = None
    severity: str
    source: Optional[str] = None
    status: Optional[str] = "active"


class AlertCreate(AlertBase):
    vulnerability_id: Optional[str] = None


class AlertStatusUpdate(BaseModel):
    status: str  # active, acknowledged, resolved


class Alert(AlertBase):
    id: str
    timestamp: datetime
    vulnerability_id: Optional[str] = None
    assigned_to: Optional[str] = None
    acknowledged_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Article Schemas
class ArticleBase(BaseModel):
    title: str
    url: str
    source: str
    content: Optional[str] = None
    author: Optional[str] = None
    published_date: Optional[datetime] = None


class ArticleCreate(ArticleBase):
    pass


# AI Analysis Schemas
class ArticleAnalysisRequest(BaseModel):
    content: str


class TextExtractionRequest(BaseModel):
    text: str


class ModelSwitchRequest(BaseModel):
    model_name: str


class Article(ArticleBase):
    id: str
    summary: Optional[str] = None
    analyzed: bool = False
    analysis_data: Optional[str] = None
    scraped_at: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True


# Report Schemas
class ReportBase(BaseModel):
    name: str
    report_type: str  # vulnerability, threat, compliance, incident
    format: str  # PDF, CSV, JSON


class ReportGenerateRequest(ReportBase):
    pass


class Report(ReportBase):
    id: str
    file_path: Optional[str] = None
    file_size: Optional[str] = None
    generated_by: str
    generated_at: datetime
    status: str  # ready, generating, scheduled
    
    class Config:
        from_attributes = True


# Scraper Source Schemas
class ScraperSourceBase(BaseModel):
    name: str
    url: str
    source_type: str  # CVE, blog, CERT, github
    enabled: bool = True
    scrape_interval: int = 3600


class ScraperSourceCreate(ScraperSourceBase):
    pass


class ScraperSource(ScraperSourceBase):
    id: str
    last_scraped: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


# User Schemas
class UserBase(BaseModel):
    username: str
    email: str
    role: str = "analyst"


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class User(UserBase):
    id: str
    active: bool = True
    created_at: datetime
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# Dashboard Stats Schema
class DashboardStats(BaseModel):
    total_vulnerabilities: int
    critical_vulnerabilities: int
    active_threats: int
    active_alerts: int


# Graph Schemas
class GraphNode(BaseModel):
    id: str
    type: str
    label: str
    data: dict


class GraphEdge(BaseModel):
    source: str
    target: str
    relationship: Optional[str] = None


class GraphData(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]
