"""
Data Manager - Centralized data management for Localix CKI

This module handles all data operations including:
- CVE database imports and sync
- Scraper outputs
- Knowledge graph storage
- Local data persistence
"""

import os
import json
import shutil
from pathlib import Path
from typing import List, Dict, Any, Optional
from datetime import datetime

# Base directories
DATA_DIR = Path(__file__).parent / "data"
CVES_DIR = DATA_DIR / "cves"
SCRAPERS_DIR = DATA_DIR / "scrapers"
KNOWLEDGE_DIR = DATA_DIR / "knowledge_graph"
IMPORTS_DIR = DATA_DIR / "imports"


class DataManager:
    """Centralized data management for Localix CKI"""
    
    def __init__(self):
        self.data_dir = DATA_DIR
        self.cves_dir = CVES_DIR
        self.scrapers_dir = SCRAPERS_DIR
        self.knowledge_dir = KNOWLEDGE_DIR
        self.imports_dir = IMPORTS_DIR
        
        # Ensure all directories exist
        self._ensure_directories()
    
    def _ensure_directories(self):
        """Create all required directories if they don't exist"""
        for directory in [
            self.data_dir,
            self.cves_dir,
            self.scrapers_dir,
            self.knowledge_dir,
            self.imports_dir
        ]:
            directory.mkdir(parents=True, exist_ok=True)
    
    # CVE Management
    
    def list_cve_years(self) -> List[int]:
        """List all years with CVE data"""
        if not self.cves_dir.exists():
            return []
        
        years = []
        for item in self.cves_dir.iterdir():
            if item.is_dir() and item.name.isdigit():
                years.append(int(item.name))
        
        return sorted(years)
    
    def get_cve_files_for_year(self, year: int) -> List[Path]:
        """Get all CVE files for a specific year"""
        year_dir = self.cves_dir / str(year)
        if not year_dir.exists():
            return []
        
        return list(year_dir.glob("*.json"))
    
    def load_cve_file(self, filepath: Path) -> Optional[Dict[str, Any]]:
        """Load a single CVE file"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading CVE file {filepath}: {e}")
            return None
    
    def load_all_cves(self, limit: Optional[int] = None) -> List[Dict[str, Any]]:
        """Load all CVEs from local files"""
        cves = []
        
        for year in self.list_cve_years():
            for cve_file in self.get_cve_files_for_year(year):
                cve_data = self.load_cve_file(cve_file)
                if cve_data:
                    cves.append(cve_data)
                
                if limit and len(cves) >= limit:
                    return cves
        
        return cves
    
    def search_cves(self, query: str) -> List[Dict[str, Any]]:
        """Search CVEs by keyword"""
        results = []
        query_lower = query.lower()
        
        for cve in self.load_all_cves():
            # Search in ID, title, description
            cve_id = cve.get('id', '').lower()
            title = cve.get('title', '').lower()
            description = cve.get('description', '').lower()
            
            if (query_lower in cve_id or 
                query_lower in title or 
                query_lower in description):
                results.append(cve)
        
        return results
    
    # Scraper Data Management
    
    def save_scraper_output(
        self, 
        source_name: str, 
        data: List[Dict[str, Any]],
        metadata: Optional[Dict[str, Any]] = None
    ):
        """Save scraped data to scrapers directory"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{source_name}_{timestamp}.json"
        filepath = self.scrapers_dir / filename
        
        output = {
            "source": source_name,
            "scraped_at": datetime.now().isoformat(),
            "items": data,
            "metadata": metadata or {},
            "count": len(data)
        }
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, ensure_ascii=False)
        
        print(f"Saved {len(data)} items to {filepath}")
        return filepath
    
    def list_scraper_outputs(self) -> List[Dict[str, Any]]:
        """List all scraper output files"""
        outputs = []
        
        for filepath in self.scrapers_dir.glob("*.json"):
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    outputs.append({
                        "filename": filepath.name,
                        "source": data.get("source", "Unknown"),
                        "scraped_at": data.get("scraped_at", ""),
                        "count": data.get("count", 0),
                        "path": str(filepath)
                    })
            except Exception as e:
                print(f"Error reading {filepath}: {e}")
        
        return sorted(outputs, key=lambda x: x["scraped_at"], reverse=True)
    
    # Knowledge Graph Management
    
    def save_knowledge_graph(self, graph_data: Dict[str, Any], name: str = "graph"):
        """Save knowledge graph data"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{name}_{timestamp}.json"
        filepath = self.knowledge_dir / filename
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(graph_data, f, indent=2, ensure_ascii=False)
        
        print(f"Saved knowledge graph to {filepath}")
        return filepath
    
    def load_latest_graph(self) -> Optional[Dict[str, Any]]:
        """Load the most recent knowledge graph"""
        graphs = sorted(self.knowledge_dir.glob("*.json"), reverse=True)
        
        if not graphs:
            return None
        
        try:
            with open(graphs[0], 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading graph: {e}")
            return None
    
    # Import Management
    
    def import_cve_database(self, source_path: Path) -> Dict[str, Any]:
        """Import CVE database from external source"""
        if not source_path.exists():
            raise FileNotFoundError(f"Source path does not exist: {source_path}")
        
        import_log = {
            "source": str(source_path),
            "imported_at": datetime.now().isoformat(),
            "status": "started",
            "files_imported": 0,
            "errors": []
        }
        
        try:
            # If it's a directory of JSON files
            if source_path.is_dir():
                json_files = list(source_path.glob("**/*.json"))
                
                for json_file in json_files:
                    try:
                        # Determine target year from filename or structure
                        cve_data = self.load_cve_file(json_file)
                        if cve_data and 'id' in cve_data:
                            # Extract year from CVE ID (e.g., CVE-2024-1234 -> 2024)
                            cve_id = cve_data.get('id', '')
                            year = None
                            
                            for part in cve_id.split('-'):
                                if part.isdigit() and len(part) == 4:
                                    year = part
                                    break
                            
                            if year:
                                year_dir = self.cves_dir / year
                                year_dir.mkdir(exist_ok=True)
                                
                                # Save to appropriate year directory
                                target_path = year_dir / f"{cve_id}.json"
                                with open(target_path, 'w', encoding='utf-8') as f:
                                    json.dump(cve_data, f, indent=2, ensure_ascii=False)
                                
                                import_log["files_imported"] += 1
                    except Exception as e:
                        import_log["errors"].append(f"Error importing {json_file}: {str(e)}")
            
            import_log["status"] = "completed"
            
        except Exception as e:
            import_log["status"] = "failed"
            import_log["error"] = str(e)
        
        # Save import log
        log_path = self.imports_dir / f"import_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(log_path, 'w', encoding='utf-8') as f:
            json.dump(import_log, f, indent=2)
        
        return import_log
    
    # Statistics
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get data statistics"""
        stats = {
            "cves": {
                "years_available": len(self.list_cve_years()),
                "total_files": sum(len(list(self.cves_dir.glob(f"{year}/*.json"))) 
                                  for year in self.list_cve_years())
            },
            "scrapers": {
                "outputs_count": len(list(self.scrapers_dir.glob("*.json")))
            },
            "knowledge_graphs": {
                "graphs_count": len(list(self.knowledge_dir.glob("*.json")))
            },
            "imports": {
                "imports_count": len(list(self.imports_dir.glob("*.json")))
            }
        }
        
        return stats


# Global instance
data_manager = DataManager()


if __name__ == "__main__":
    # Test data manager
    stats = data_manager.get_statistics()
    print("Data Statistics:")
    print(json.dumps(stats, indent=2))
