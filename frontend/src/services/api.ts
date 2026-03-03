const API_BASE_URL = 'http://localhost:8000/api';

export interface Vulnerability {
  id: string;
  cve_id: string;
  title: string;
  description?: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  cvss_score?: number;
  vendor?: string;
  product?: string;
  affected_versions?: string;
  published_date?: string;
  modified_date?: string;
  status?: 'open' | 'in_progress' | 'resolved';
  ai_summary?: string;
  mitre_tactics?: string;
  mitre_techniques?: string;
  exploits_available?: boolean;
  source_url?: string;
}

export interface Alert {
  id: string;
  title: string;
  description?: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  source?: string;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
}

export interface ThreatActor {
  id: string;
  name: string;
  origin_country?: string;
  activity_level: 'critical' | 'high' | 'medium' | 'low';
  targets?: string[];
  last_seen?: string;
}

export interface IndicatorOfCompromise {
  id: string;
  type: string;
  value: string;
  threat_type?: string;
  confidence_score?: number;
}

export interface DashboardStats {
  total_vulnerabilities: number;
  critical_vulnerabilities: number;
  active_threats: number;
  active_alerts: number;
}

// API Service Functions
export const api = {
  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    return response.json();
  },

  // Vulnerabilities
  async getVulnerabilities(params?: { 
    skip?: number; 
    limit?: number; 
    severity?: string 
  }): Promise<Vulnerability[]> {
    const queryParams = new URLSearchParams();
    if (params?.skip) queryParams.append('skip', params.skip.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.severity) queryParams.append('severity', params.severity);
    
    const response = await fetch(`${API_BASE_URL}/vulnerabilities?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch vulnerabilities');
    return response.json();
  },

  async getVulnerability(id: string): Promise<Vulnerability> {
    const response = await fetch(`${API_BASE_URL}/vulnerabilities/${id}`);
    if (!response.ok) throw new Error('Failed to fetch vulnerability');
    return response.json();
  },

  // Alerts
  async getAlerts(params?: { 
    skip?: number; 
    limit?: number; 
    severity?: string;
    status?: string;
  }): Promise<Alert[]> {
    const queryParams = new URLSearchParams();
    if (params?.skip) queryParams.append('skip', params.skip.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.severity) queryParams.append('severity', params.severity);
    if (params?.status) queryParams.append('status', params.status);
    
    const response = await fetch(`${API_BASE_URL}/alerts?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch alerts');
    return response.json();
  },

  async updateAlertStatus(alertId: string, status: 'active' | 'acknowledged' | 'resolved'): Promise<Alert> {
    const response = await fetch(`${API_BASE_URL}/alerts/${alertId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update alert status');
    return response.json();
  },

  // Threat Intelligence
  async getThreats(params?: { 
    skip?: number; 
    limit?: number; 
    activity_level?: string 
  }): Promise<ThreatActor[]> {
    const queryParams = new URLSearchParams();
    if (params?.skip) queryParams.append('skip', params.skip.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.activity_level) queryParams.append('activity_level', params.activity_level);
    
    const response = await fetch(`${API_BASE_URL}/threats?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch threats');
    return response.json();
  },

  async getIOCs(params?: { 
    skip?: number; 
    limit?: number; 
    ioc_type?: string 
  }): Promise<IndicatorOfCompromise[]> {
    const queryParams = new URLSearchParams();
    if (params?.skip) queryParams.append('skip', params.skip.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.ioc_type) queryParams.append('ioc_type', params.ioc_type);
    
    const response = await fetch(`${API_BASE_URL}/iocs?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch IOCs');
    return response.json();
  },

  // Reports
  async getReports(params?: { 
    skip?: number; 
    limit?: number; 
    report_type?: string 
  }): Promise<any[]> {
    const queryParams = new URLSearchParams();
    if (params?.skip) queryParams.append('skip', params.skip.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.report_type) queryParams.append('report_type', params.report_type);
    
    const response = await fetch(`${API_BASE_URL}/reports?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch reports');
    return response.json();
  },

  async generateReport(data: { 
    name: string; 
    report_type: string; 
    format: string 
  }): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/reports/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to generate report');
    return response.json();
  },

  // Scraper
  async runScraper(sourceUrl?: string): Promise<any> {
    const queryParams = sourceUrl ? `?source_url=${encodeURIComponent(sourceUrl)}` : '';
    const response = await fetch(`${API_BASE_URL}/scraper/run${queryParams}`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to run scraper');
    return response.json();
  },

  async getScraperSources(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/scraper/sources`);
    if (!response.ok) throw new Error('Failed to fetch scraper sources');
    return response.json();
  },

  // Knowledge Graph
  async getGraphNodes(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/graph/nodes`);
    if (!response.ok) throw new Error('Failed to fetch graph nodes');
    return response.json();
  },

  async getGraphEdges(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/graph/edges`);
    if (!response.ok) throw new Error('Failed to fetch graph edges');
    return response.json();
  },

  async getGraphData(): Promise<{ nodes: any[]; edges: any[] }> {
    const response = await fetch(`${API_BASE_URL}/graph/data`);
    if (!response.ok) throw new Error('Failed to fetch graph data');
    return response.json();
  },

  async searchGraph(query: string): Promise<{ nodes: any[]; edges: any[] }> {
    const response = await fetch(`${API_BASE_URL}/graph/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search graph');
    return response.json();
  },
};
