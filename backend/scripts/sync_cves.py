"""
CVE Import Script - Sync local CVE files to database

This script reads CVE JSON files from backend/data/cves/ 
and imports them into the SQLite database for fast querying.
"""

import sys
import json
from pathlib import Path
from datetime import datetime

# Add backend to path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from database import SessionLocal, engine
from models import Vulnerability
from data_manager import data_manager


def sync_cves_to_database(limit: int = None):
    """Sync CVE files to database"""
    print("🔍 Starting CVE synchronization...")
    
    db = SessionLocal()
    
    try:
        # Load all CVEs from local files
        cves = data_manager.load_all_cves(limit=limit)
        
        if not cves:
            print("⚠️  No CVE files found in data directory")
            return
        
        print(f"📦 Found {len(cves)} CVE files")
        
        imported = 0
        skipped = 0
        errors = 0
        
        for cve_data in cves:
            try:
                # Extract CVE ID
                cve_id = cve_data.get('id') or cve_data.get('cve_id')
                if not cve_id:
                    print(f"⚠️  Skipping file without CVE ID: {cve_data}")
                    skipped += 1
                    continue
                
                # Check if already exists
                existing = db.query(Vulnerability).filter(
                    Vulnerability.cve_id == cve_id
                ).first()
                
                if existing:
                    skipped += 1
                    continue
                
                # Map CVE data to Vulnerability model
                vuln = Vulnerability(
                    cve_id=cve_id,
                    title=cve_data.get('title', f"{cve_id} Vulnerability"),
                    description=cve_data.get('description', ''),
                    severity=_map_severity(cve_data.get('severity', 'medium')),
                    cvss_score=cve_data.get('cvss_score') or cve_data.get('metrics', {}).get('base_score'),
                    vendor=cve_data.get('vendor') or cve_data.get('configurations', [{}])[0].get('vendor', ''),
                    product=cve_data.get('product') or cve_data.get('configurations', [{}])[0].get('product', ''),
                    published_date=_parse_date(cve_data.get('published_date') or cve_data.get('published'))
                )
                
                db.add(vuln)
                imported += 1
                
                if imported % 100 == 0:
                    print(f"✓ Imported {imported} CVEs...")
                    
            except Exception as e:
                print(f"❌ Error processing CVE: {e}")
                errors += 1
                continue
        
        # Commit all changes
        db.commit()
        
        print("\n✅ Synchronization complete!")
        print(f"   📊 Imported: {imported}")
        print(f"   ⏭️  Skipped: {skipped}")
        print(f"   ❌ Errors: {errors}")
        
    except Exception as e:
        print(f"❌ Fatal error: {e}")
        db.rollback()
    finally:
        db.close()


def _map_severity(severity_str: str) -> str:
    """Map severity string to standard values"""
    if not severity_str:
        return 'medium'
    
    severity_map = {
        'critical': 'critical',
        'high': 'high',
        'medium': 'medium',
        'low': 'low',
        'important': 'high',
        'moderate': 'medium',
        'minor': 'low'
    }
    
    return severity_map.get(severity_str.lower(), 'medium')


def _parse_date(date_str: str) -> str:
    """Parse date string to ISO format"""
    if not date_str:
        return datetime.now().isoformat()
    
    # Try common formats
    formats = [
        "%Y-%m-%d",
        "%Y-%m-%dT%H:%M:%S",
        "%Y-%m-%dT%H:%M:%SZ",
        "%B %d, %Y"
    ]
    
    for fmt in formats:
        try:
            return datetime.strptime(date_str, fmt).isoformat()
        except:
            continue
    
    return date_str


if __name__ == "__main__":
    limit = None
    
    if len(sys.argv) > 1:
        try:
            limit = int(sys.argv[1])
            print(f"Limiting to {limit} CVEs")
        except:
            pass
    
    sync_cves_to_database(limit=limit)
