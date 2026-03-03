import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { VulnerabilitiesPage } from './pages/VulnerabilitiesPage';
import { ThreatIntelligencePage } from './pages/ThreatIntelligencePage';
import { KnowledgeGraphPage } from './pages/KnowledgeGraphPage';
import { AlertsPage } from './pages/AlertsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/vulnerabilities" element={<VulnerabilitiesPage />} />
          <Route
            path="/threat-intelligence"
            element={<ThreatIntelligencePage />} />

          <Route path="/knowledge-graph" element={<KnowledgeGraphPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>);

}