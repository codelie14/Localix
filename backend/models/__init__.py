from sqlalchemy import Column, String, Integer, Float, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()


class Vulnerability(Base):
    __tablename__ = "vulnerabilities"
    
    id = Column(String, primary_key=True, index=True)
    cve_id = Column(String, unique=True, index=True, nullable=False)
    title = Column(Text, nullable=False)
    description = Column(Text)
    severity = Column(String, index=True)  # critical, high, medium, low
    cvss_score = Column(Float)
    vendor = Column(String, index=True)
    product = Column(String)
    affected_versions = Column(Text)
    published_date = Column(DateTime)
    modified_date = Column(DateTime)
    status = Column(String)  # open, in_progress, resolved
    ai_summary = Column(Text)
    mitre_tactics = Column(Text)  # JSON array
    mitre_techniques = Column(Text)  # JSON array
    exploits_available = Column(Boolean, default=False)
    source_url = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    alerts = relationship("Alert", back_populates="vulnerability")


class ThreatActor(Base):
    __tablename__ = "threat_actors"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    aliases = Column(Text)  # JSON array
    origin_country = Column(String)
    activity_level = Column(String)  # critical, high, medium, low
    targets = Column(Text)  # JSON array
    last_seen = Column(DateTime)
    description = Column(Text)
    associated_malware = Column(Text)  # JSON array
    mitre_group_id = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class IndicatorOfCompromise(Base):
    __tablename__ = "indicators_of_compromise"
    
    id = Column(String, primary_key=True, index=True)
    type = Column(String, index=True)  # IP, Domain, Hash, URL, Email
    value = Column(String, nullable=False, index=True)
    threat_type = Column(String)
    confidence_score = Column(Integer)
    source = Column(String)
    first_seen = Column(DateTime)
    last_seen = Column(DateTime)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    severity = Column(String, index=True)  # critical, high, medium, low
    source = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    status = Column(String, index=True)  # active, acknowledged, resolved
    vulnerability_id = Column(String, ForeignKey("vulnerabilities.id"))
    assigned_to = Column(String)
    acknowledged_at = Column(DateTime)
    resolved_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    vulnerability = relationship("Vulnerability", back_populates="alerts")


class Article(Base):
    __tablename__ = "articles"
    
    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    url = Column(String, unique=True, nullable=False)
    source = Column(String, index=True)
    content = Column(Text)
    summary = Column(Text)
    author = Column(String)
    published_date = Column(DateTime)
    scraped_at = Column(DateTime, default=datetime.utcnow)
    analyzed = Column(Boolean, default=False)
    analysis_data = Column(Text)  # JSON
    
    created_at = Column(DateTime, default=datetime.utcnow)


class Report(Base):
    __tablename__ = "reports"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    report_type = Column(String, index=True)  # vulnerability, threat, compliance, incident
    format = Column(String)  # PDF, CSV, JSON
    file_path = Column(String)
    file_size = Column(String)
    generated_by = Column(String)
    generated_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String)  # ready, generating, scheduled
    schedule_config = Column(Text)  # JSON


class ScraperSource(Base):
    __tablename__ = "scraper_sources"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    url = Column(String, unique=True, nullable=False)
    source_type = Column(String)  # CVE, blog, CERT, github
    enabled = Column(Boolean, default=True)
    scrape_interval = Column(Integer, default=3600)  # seconds
    last_scraped = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)


class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String)  # admin, analyst, viewer
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime)
