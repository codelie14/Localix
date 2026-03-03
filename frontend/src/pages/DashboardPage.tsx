import React, { useState, useEffect } from 'react';
import {
  ShieldAlertIcon,
  BugIcon,
  AlertTriangleIcon,
  ActivityIcon,
  RefreshCwIcon,
  DownloadIcon,
  DatabaseIcon } from
'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { VulnerabilityTrendChart } from '../components/charts/VulnerabilityTrendChart';
import { TopVendorsChart } from '../components/charts/TopVendorsChart';
import { ThreatCategoriesChart } from '../components/charts/ThreatCategoriesChart';
import { ThreatFeed } from '../components/dashboard/ThreatFeed';
import { api, DashboardStats } from '../services/api';
import { Button } from '../components/ui/Button';

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    total_vulnerabilities: 0,
    critical_vulnerabilities: 0,
    active_threats: 0,
    active_alerts: 0
  });
  const [loading, setLoading] = useState(true);
  const [scraperRunning, setScraperRunning] = useState(false);

  useEffect(() => {
    // Fetch dashboard statistics from backend
    api.getDashboardStats()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching stats:', err);
        setLoading(false);
      });
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    api.getDashboardStats()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error refreshing stats:', err);
        setLoading(false);
      });
  };

  const handleRunScraper = () => {
    setScraperRunning(true);
    api.runScraper()
      .then((result) => {
        alert(`Scraper completed! Found ${result.items_found || 0} items.`);
        setScraperRunning(false);
        handleRefresh(); // Refresh dashboard stats
      })
      .catch((err) => {
        console.error('Scraper error:', err);
        alert('Scraper failed: ' + err.message);
        setScraperRunning(false);
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-terminal-green text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-terminal-green">&gt;</span>
          <h1 className="text-xl font-semibold text-white">Dashboard</h1>
          <span className="text-gray-500 text-sm"> // system overview</span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleRunScraper}
            icon={<DatabaseIcon className="w-4 h-4" />}
            disabled={scraperRunning}>
            {scraperRunning ? 'Scraping...' : 'Run Scraper'}
          </Button>
          
          <Button
            onClick={handleRefresh}
            icon={<RefreshCwIcon className="w-4 h-4" />}
            variant="secondary">
            Refresh
          </Button>
          
          <Button
            icon={<DownloadIcon className="w-4 h-4" />}
            variant="secondary">
            Export
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Vulnerabilities"
          value={stats.total_vulnerabilities}
          icon={BugIcon}
          trend={{
            value: 12,
            isPositive: false
          }}
          severity="normal"
          delay={0} />

        <StatCard
          title="Critical Issues"
          value={stats.critical_vulnerabilities}
          icon={AlertTriangleIcon}
          trend={{
            value: 8,
            isPositive: false
          }}
          severity="critical"
          delay={100} />

        <StatCard
          title="Active Threats"
          value={stats.active_threats}
          icon={ShieldAlertIcon}
          trend={{
            value: 5,
            isPositive: true
          }}
          severity="warning"
          delay={200} />

        <StatCard
          title="Systems Monitored"
          value={stats.active_alerts}
          icon={ActivityIcon}
          trend={{
            value: 3,
            isPositive: true
          }}
          severity="normal"
          delay={300} />

      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VulnerabilityTrendChart />
        <TopVendorsChart />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ThreatFeed />
        </div>
        <ThreatCategoriesChart />
      </div>
    </div>);

}