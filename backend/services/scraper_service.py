import requests
from bs4 import BeautifulSoup
from datetime import datetime
import re
import json
from typing import List, Dict, Any, Optional
from urllib.parse import urljoin, urlparse
import time


class ScraperService:
    """Service for scraping cybersecurity sources"""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        })
        
        # Default sources - can be extended via API
        self.sources = [
            {
                "name": "NVD NIST",
                "url": "https://nvd.nist.gov/vuln/search/results",
                "type": "CVE"
            },
            {
                "name": "CISA Known Exploited",
                "url": "https://www.cisa.gov/known-exploited-vulnerabilities-catalog",
                "type": "CVE"
            },
            {
                "name": "The Hacker News",
                "url": "https://thehackernews.com/",
                "type": "blog"
            },
            {
                "name": "BleepingComputer",
                "url": "https://www.bleepingcomputer.com/",
                "type": "blog"
            }
        ]
    
    async def scrape_source(self, url: str) -> Dict[str, Any]:
        """Scrape a single source URL"""
        try:
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            
            # Determine source type and parse accordingly
            if "nvd.nist.gov" in url:
                return await self._parse_nvd(response.text, url)
            elif "cisa.gov" in url:
                return await self._parse_cisa(response.text, url)
            elif "thehackernews.com" in url:
                return await self._parse_hacker_news(response.text, url)
            elif "bleepingcomputer.com" in url:
                return await self._parse_bleeping_computer(response.text, url)
            else:
                return await self._parse_generic(response.text, url)
                
        except Exception as e:
            print(f"Error scraping {url}: {e}")
            return {"error": str(e), "url": url}
    
    async def run_all_scrapers(self) -> List[Dict[str, Any]]:
        """Run all configured scrapers"""
        results = []
        
        for source in self.sources:
            try:
                result = await self.scrape_source(source["url"])
                result["source_name"] = source["name"]
                result["source_type"] = source["type"]
                results.append(result)
                
                # Rate limiting
                time.sleep(2)
                
            except Exception as e:
                print(f"Error scraping {source['name']}: {e}")
                results.append({
                    "source_name": source["name"],
                    "error": str(e)
                })
        
        return results
    
    async def _parse_nvd(self, html: str, url: str) -> Dict[str, Any]:
        """Parse NVD NIST CVE data"""
        soup = BeautifulSoup(html, 'lxml')
        vulnerabilities = []
        
        # Find vulnerability entries
        vuln_rows = soup.find_all('tr', class_='results-row')
        
        for row in vuln_rows[:20]:  # Limit to 20 entries
            try:
                cve_id_elem = row.find('a', href=re.compile(r'/vuln/detail/CVE'))
                if not cve_id_elem:
                    continue
                
                cve_id = cve_id_elem.text.strip()
                description_elem = row.find('p')
                description = description_elem.text.strip() if description_elem else ""
                
                # Extract CVSS score
                cvss_elem = row.find('span', class_='cvss-badge')
                cvss_score = None
                severity = "medium"
                
                if cvss_elem:
                    cvss_text = cvss_elem.text.strip()
                    try:
                        cvss_score = float(cvss_text.replace("CVSS ", ""))
                        if cvss_score >= 9.0:
                            severity = "critical"
                        elif cvss_score >= 7.0:
                            severity = "high"
                        elif cvss_score >= 4.0:
                            severity = "medium"
                        else:
                            severity = "low"
                    except:
                        pass
                
                vulnerabilities.append({
                    "cve_id": cve_id,
                    "title": f"{cve_id} Vulnerability",
                    "description": description,
                    "severity": severity,
                    "cvss_score": cvss_score,
                    "source_url": f"https://nvd.nist.gov/vuln/detail/{cve_id}",
                    "published_date": datetime.now().isoformat()
                })
            except Exception as e:
                print(f"Error parsing NVD entry: {e}")
                continue
        
        return {
            "type": "vulnerabilities",
            "count": len(vulnerabilities),
            "data": vulnerabilities,
            "scraped_at": datetime.now().isoformat()
        }
    
    async def _parse_cisa(self, html: str, url: str) -> Dict[str, Any]:
        """Parse CISA Known Exploited Vulnerabilities"""
        soup = BeautifulSoup(html, 'lxml')
        vulnerabilities = []
        
        # Find table rows with CVE data
        table = soup.find('table')
        if table:
            rows = table.find_all('tr')[1:]  # Skip header
            
            for row in rows[:20]:  # Limit to 20
                try:
                    cols = row.find_all('td')
                    if len(cols) >= 4:
                        cve_id = cols[0].text.strip()
                        vendor_product = cols[1].text.strip()
                        description = cols[2].text.strip()
                        date_added = cols[3].text.strip()
                        
                        vulnerabilities.append({
                            "cve_id": cve_id,
                            "title": f"CISA KEV: {vendor_product}",
                            "description": description,
                            "severity": "critical",  # CISA catalog is known exploits
                            "vendor": vendor_product.split()[0] if vendor_product else "",
                            "product": " ".join(vendor_product.split()[1:]) if vendor_product else "",
                            "source_url": url,
                            "published_date": date_added
                        })
                except Exception as e:
                    print(f"Error parsing CISA entry: {e}")
                    continue
        
        return {
            "type": "vulnerabilities",
            "count": len(vulnerabilities),
            "data": vulnerabilities,
            "scraped_at": datetime.now().isoformat()
        }
    
    async def _parse_hacker_news(self, html: str, url: str) -> Dict[str, Any]:
        """Parse The Hacker News articles"""
        soup = BeautifulSoup(html, 'lxml')
        articles = []
        
        # Find article blocks
        article_blocks = soup.find_all('div', class_='story-inner')
        
        for block in article_blocks[:10]:  # Limit to 10 articles
            try:
                title_elem = block.find('span', class_='title')
                link_elem = block.find('a', class_='story-link')
                
                if not title_elem or not link_elem:
                    continue
                
                title = title_elem.text.strip()
                article_url = link_elem.get('href', '')
                
                # Get full content if it's an internal link
                content = ""
                if article_url.startswith('/'):
                    full_url = urljoin(url, article_url)
                    try:
                        article_response = self.session.get(full_url, timeout=10)
                        article_soup = BeautifulSoup(article_response.text, 'lxml')
                        content_div = article_soup.find('div', class_='storyContent')
                        if content_div:
                            content = content_div.get_text(separator=' ', strip=True)
                    except:
                        pass
                
                articles.append({
                    "title": title,
                    "url": urljoin(url, article_url) if article_url.startswith('/') else article_url,
                    "content": content,
                    "source": "The Hacker News",
                    "published_date": datetime.now().isoformat()
                })
            except Exception as e:
                print(f"Error parsing Hacker News article: {e}")
                continue
        
        return {
            "type": "articles",
            "count": len(articles),
            "data": articles,
            "scraped_at": datetime.now().isoformat()
        }
    
    async def _parse_bleeping_computer(self, html: str, url: str) -> Dict[str, Any]:
        """Parse BleepingComputer articles"""
        soup = BeautifulSoup(html, 'lxml')
        articles = []
        
        # Find article items
        article_items = soup.find_all('article', class_='ipsBox')
        
        for item in article_items[:10]:  # Limit to 10
            try:
                title_elem = item.find('h2')
                link_elem = item.find('a', href=re.compile(r'/topic/'))
                
                if not title_elem or not link_elem:
                    continue
                
                title = title_elem.text.strip()
                article_url = link_elem.get('href', '')
                
                articles.append({
                    "title": title,
                    "url": article_url,
                    "source": "BleepingComputer",
                    "published_date": datetime.now().isoformat()
                })
            except Exception as e:
                print(f"Error parsing BleepingComputer article: {e}")
                continue
        
        return {
            "type": "articles",
            "count": len(articles),
            "data": articles,
            "scraped_at": datetime.now().isoformat()
        }
    
    async def _parse_generic(self, html: str, url: str) -> Dict[str, Any]:
        """Generic parser for unknown sources"""
        soup = BeautifulSoup(html, 'lxml')
        
        # Try to extract main content
        title = soup.find('title')
        title_text = title.text.strip() if title else "Unknown"
        
        # Remove script and style elements
        for script in soup(['script', 'style']):
            script.decompose()
        
        # Get text content
        text = soup.get_text(separator=' ', strip=True)[:5000]  # Limit length
        
        return {
            "type": "generic",
            "title": title_text,
            "content": text,
            "url": url,
            "scraped_at": datetime.now().isoformat()
        }
    
    def get_configured_sources(self) -> List[Dict[str, str]]:
        """Get list of configured scraper sources"""
        return self.sources
    
    def add_source(self, name: str, url: str, source_type: str) -> Dict[str, str]:
        """Add a new scraper source"""
        source = {
            "name": name,
            "url": url,
            "type": source_type
        }
        self.sources.append(source)
        return source
    
    def remove_source(self, url: str) -> bool:
        """Remove a scraper source"""
        for i, source in enumerate(self.sources):
            if source["url"] == url:
                del self.sources[i]
                return True
        return False


# Singleton instance
scraper_service = ScraperService()
