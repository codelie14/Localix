import React from 'react';
import {
  ShieldAlertIcon,
  BugIcon,
  AlertTriangleIcon,
  ActivityIcon } from
'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { VulnerabilityTrendChart } from '../components/charts/VulnerabilityTrendChart';
import { TopVendorsChart } from '../components/charts/TopVendorsChart';
import { ThreatCategoriesChart } from '../components/charts/ThreatCategoriesChart';
import { ThreatFeed } from '../components/dashboard/ThreatFeed';
export function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-2">
        <span className="text-terminal-green">&gt;</span>
        <h1 className="text-xl font-semibold text-white">Dashboard</h1>
        <span className="text-gray-500 text-sm"> // system overview</span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Vulnerabilities"
          value={1247}
          icon={BugIcon}
          trend={{
            value: 12,
            isPositive: false
          }}
          severity="normal"
          delay={0} />

        <StatCard
          title="Critical Issues"
          value={23}
          icon={AlertTriangleIcon}
          trend={{
            value: 8,
            isPositive: false
          }}
          severity="critical"
          delay={100} />

        <StatCard
          title="Active Threats"
          value={156}
          icon={ShieldAlertIcon}
          trend={{
            value: 5,
            isPositive: true
          }}
          severity="warning"
          delay={200} />

        <StatCard
          title="Systems Monitored"
          value={89}
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