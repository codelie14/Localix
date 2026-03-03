import ollama
import json
from typing import Dict, List, Any
import os


class OllamaService:
    """Service for interacting with Ollama AI models"""
    
    def __init__(self):
        # Preferred models as per project requirements
        self.model = os.getenv("OLLAMA_MODEL", "llama3.1:8b")  # or ministral-3:3b
        self.host = os.getenv("OLLAMA_HOST", "http://localhost:11434")
        self.available_models = ["llama3.1:8b", "ministral-3:3b", "llama3.2:3b"]
    
    def set_model(self, model_name: str) -> bool:
        """Switch to a different AI model"""
        if model_name in self.available_models:
            self.model = model_name
            return True
        return False
    
    async def check_connection(self) -> bool:
        """Verify Ollama is running and accessible"""
        try:
            response = ollama.list()
            return len(response.get('models', [])) > 0
        except Exception as e:
            print(f"Ollama connection check failed: {e}")
            return False
    
    async def analyze_article(self, content: str) -> Dict[str, Any]:
        """
        Analyze a cybersecurity article using AI
        Returns: summary, CVE IDs, CVSS scores, vendors, products, threat classification, IOCs, MITRE mapping
        """
        prompt = f"""
Analyze this cybersecurity article and extract the following information in JSON format:

{{
    "summary": "Brief technical summary (2-3 sentences)",
    "cve_ids": ["CVE-XXXX-XXXX", ...],
    "cvss_scores": {{"CVE-ID": score}},
    "vendors": ["vendor1", ...],
    "products": ["product1", ...],
    "affected_versions": ["version1", ...],
    "threat_classification": "Malware|Ransomware|Phishing|Zero-day|Data Breach|Other",
    "exploit_available": true/false,
    "iocs": {{
        "ip_addresses": ["1.2.3.4", ...],
        "domains": ["evil.com", ...],
        "hashes": ["md5/sha256 hash", ...],
        "urls": ["http://...", ...]
    }},
    "mitre_attack": {{
        "tactics": ["TA0001", ...],
        "techniques": ["T1234", ...]
    }},
    "cyber_threat_index": 0-100
}}

Article content:
{content}

Respond ONLY with valid JSON, no additional text.
"""
        
        try:
            response = ollama.chat(
                model=self.model,
                messages=[{"role": "user", "content": prompt}]
            )
            
            analysis_text = response["message"]["content"]
            
            # Extract JSON from response
            start_idx = analysis_text.find("{")
            end_idx = analysis_text.rfind("}") + 1
            
            if start_idx != -1 and end_idx > start_idx:
                json_str = analysis_text[start_idx:end_idx]
                analysis = json.loads(json_str)
            else:
                analysis = json.loads(analysis_text)
            
            return analysis
            
        except Exception as e:
            print(f"AI analysis error: {e}")
            return {
                "summary": "AI analysis failed",
                "cve_ids": [],
                "cvss_scores": {},
                "vendors": [],
                "products": [],
                "affected_versions": [],
                "threat_classification": "Other",
                "exploit_available": False,
                "iocs": {"ip_addresses": [], "domains": [], "hashes": [], "urls": []},
                "mitre_attack": {"tactics": [], "techniques": []},
                "cyber_threat_index": 0
            }
    
    async def extract_iocs(self, text: str) -> List[Dict[str, str]]:
        """Extract Indicators of Compromise from text"""
        prompt = f"""
Extract all Indicators of Compromise (IOCs) from the following text.
Return as a JSON array with format:
[
    {{"type": "IP|Domain|Hash|URL|Email", "value": "the actual value", "context": "where it appeared"}},
    ...
]

Text:
{text}

Respond ONLY with valid JSON array.
"""
        
        try:
            response = ollama.chat(
                model=self.model,
                messages=[{"role": "user", "content": prompt}]
            )
            
            iocs_text = response["message"]["content"]
            
            # Extract JSON array
            start_idx = iocs_text.find("[")
            end_idx = iocs_text.rfind("]") + 1
            
            if start_idx != -1 and end_idx > start_idx:
                json_str = iocs_text[start_idx:end_idx]
                iocs = json.loads(json_str)
            else:
                iocs = json.loads(iocs_text)
            
            return iocs
            
        except Exception as e:
            print(f"IOC extraction error: {e}")
            return []
    
    async def classify_threat(self, title: str, description: str) -> Dict[str, Any]:
        """Classify a threat and determine severity"""
        prompt = f"""
Classify this cybersecurity threat and provide severity assessment.
Return JSON with format:
{{
    "category": "Malware|Ransomware|Phishing|DDoS|Zero-day|Data Breach|APT|Other",
    "severity": "critical|high|medium|low",
    "cvss_estimate": 0.0-10.0,
    "confidence": 0-100,
    "reasoning": "Brief explanation"
}}

Title: {title}
Description: {description}

Respond ONLY with valid JSON.
"""
        
        try:
            response = ollama.chat(
                model=self.model,
                messages=[{"role": "user", "content": prompt}]
            )
            
            classification_text = response["message"]["content"]
            
            # Extract JSON
            start_idx = classification_text.find("{")
            end_idx = classification_text.rfind("}") + 1
            
            if start_idx != -1 and end_idx > start_idx:
                json_str = classification_text[start_idx:end_idx]
                classification = json.loads(json_str)
            else:
                classification = json.loads(classification_text)
            
            return classification
            
        except Exception as e:
            print(f"Threat classification error: {e}")
            return {
                "category": "Other",
                "severity": "medium",
                "cvss_estimate": 5.0,
                "confidence": 50,
                "reasoning": "Classification failed"
            }
    
    async def generate_summary(self, data: Dict[str, Any]) -> str:
        """Generate an executive summary from vulnerability/threat data"""
        prompt = f"""
Generate a concise executive summary for this cybersecurity intelligence:

{json.dumps(data, indent=2)}

Summary should be 2-3 paragraphs, technical but accessible.
Focus on key risks, affected systems, and recommended actions.
"""
        
        try:
            response = ollama.chat(
                model=self.model,
                messages=[{"role": "user", "content": prompt}]
            )
            
            return response["message"]["content"]
            
        except Exception as e:
            print(f"Summary generation error: {e}")
            return "Summary generation failed."
    
    async def map_to_mitre(self, technique_description: str) -> Dict[str, List[str]]:
        """Map a threat or attack to MITRE ATT&CK framework"""
        prompt = f"""
Map this attack/technique description to MITRE ATT&CK framework.
Return JSON with format:
{{
    "tactics": ["TA00XX - Tactic Name", ...],
    "techniques": ["TXXXX - Technique Name", ...],
    "sub_techniques": ["TXXXX.XXX - Sub-technique Name", ...]
}}

Description:
{technique_description}

Respond ONLY with valid JSON.
"""
        
        try:
            response = ollama.chat(
                model=self.model,
                messages=[{"role": "user", "content": prompt}]
            )
            
            mitre_text = response["message"]["content"]
            
            # Extract JSON
            start_idx = mitre_text.find("{")
            end_idx = mitre_text.rfind("}") + 1
            
            if start_idx != -1 and end_idx > start_idx:
                json_str = mitre_text[start_idx:end_idx]
                mitre_mapping = json.loads(json_str)
            else:
                mitre_mapping = json.loads(mitre_text)
            
            return mitre_mapping
            
        except Exception as e:
            print(f"MITRE mapping error: {e}")
            return {"tactics": [], "techniques": [], "sub_techniques": []}


# Singleton instance
ollama_service = OllamaService()
