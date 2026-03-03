import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangleIcon,
  ShieldAlertIcon,
  InfoIcon,
  CheckCircleIcon,
  XIcon,
  FilterIcon } from
'lucide-react';
interface Alert {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  status: 'active' | 'acknowledged' | 'resolved';
}
const alerts: Alert[] = [
{
  id: '1',
  timestamp: '2024-01-15 14:32:18',
  title: 'Suspicious outbound connection detected',
  description:
  'Multiple connections to known C2 server IP addresses from internal host 192.168.1.105',
  severity: 'critical',
  source: 'Network Monitor',
  status: 'active'
},
{
  id: '2',
  timestamp: '2024-01-15 14:28:45',
  title: 'Failed login attempts threshold exceeded',
  description:
  'User admin@company.com has exceeded 10 failed login attempts in 5 minutes',
  severity: 'high',
  source: 'Auth Service',
  status: 'active'
},
{
  id: '3',
  timestamp: '2024-01-15 14:15:22',
  title: 'New vulnerability detected in production',
  description:
  'CVE-2024-0001 affects Apache Log4j version running on prod-server-01',
  severity: 'critical',
  source: 'Vulnerability Scanner',
  status: 'acknowledged'
},
{
  id: '4',
  timestamp: '2024-01-15 14:02:11',
  title: 'Unusual data transfer volume',
  description:
  'Database server db-01 transferred 5GB of data to external IP in last hour',
  severity: 'high',
  source: 'DLP System',
  status: 'active'
},
{
  id: '5',
  timestamp: '2024-01-15 13:48:33',
  title: 'SSL certificate expiring soon',
  description: 'Certificate for api.company.com expires in 7 days',
  severity: 'medium',
  source: 'Certificate Monitor',
  status: 'acknowledged'
},
{
  id: '6',
  timestamp: '2024-01-15 13:35:09',
  title: 'Firewall rule change detected',
  description:
  'New inbound rule added allowing traffic on port 8080 from any source',
  severity: 'medium',
  source: 'Config Monitor',
  status: 'resolved'
},
{
  id: '7',
  timestamp: '2024-01-15 13:20:44',
  title: 'Malware signature detected',
  description:
  'Trojan.GenericKD.46789 found in email attachment on user workstation',
  severity: 'critical',
  source: 'Endpoint Protection',
  status: 'resolved'
},
{
  id: '8',
  timestamp: '2024-01-15 13:05:17',
  title: 'API rate limit exceeded',
  description:
  'External API key exceeded rate limit of 1000 requests per minute',
  severity: 'low',
  source: 'API Gateway',
  status: 'resolved'
}];

const severityConfig = {
  critical: {
    color: 'text-terminal-red',
    bg: 'bg-terminal-red/10',
    border: 'border-terminal-red/30',
    icon: AlertTriangleIcon,
    glow: 'pulse-critical'
  },
  high: {
    color: 'text-terminal-amber',
    bg: 'bg-terminal-amber/10',
    border: 'border-terminal-amber/30',
    icon: ShieldAlertIcon,
    glow: 'pulse-warning'
  },
  medium: {
    color: 'text-terminal-green',
    bg: 'bg-terminal-green/10',
    border: 'border-terminal-green/30',
    icon: InfoIcon,
    glow: ''
  },
  low: {
    color: 'text-gray-400',
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/30',
    icon: InfoIcon,
    glow: ''
  }
};
const statusConfig = {
  active: {
    color: 'text-terminal-red',
    label: 'ACTIVE',
    blink: true
  },
  acknowledged: {
    color: 'text-terminal-amber',
    label: 'ACK',
    blink: false
  },
  resolved: {
    color: 'text-terminal-green',
    label: 'RESOLVED',
    blink: false
  }
};
export function AlertsPage() {
  const [alertsList, setAlertsList] = useState<Alert[]>(alerts);
  const [filter, setFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const handleStatusChange = (
  id: string,
  newStatus: 'acknowledged' | 'resolved') =>
  {
    setAlertsList((current) =>
    current.map((alert) =>
    alert.id === id ?
    {
      ...alert,
      status: newStatus
    } :
    alert
    )
    );
  };
  const filteredAlerts = alertsList.filter((alert) => {
    const severityMatch = filter === 'all' || alert.severity === filter;
    const statusMatch = statusFilter === 'all' || alert.status === statusFilter;
    return severityMatch && statusMatch;
  });
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-terminal-green">&gt;</span>
          <h1 className="text-xl font-semibold text-white">Alerts</h1>
          <span className="text-gray-500 text-sm"> // security events</span>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 rounded border border-terminal-green/30 bg-terminal-dark text-gray-300 text-sm outline-none focus:border-terminal-green">

            <option value="all">[ALL SEVERITY]</option>
            <option value="critical">[CRITICAL]</option>
            <option value="high">[HIGH]</option>
            <option value="medium">[MEDIUM]</option>
            <option value="low">[LOW]</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded border border-terminal-green/30 bg-terminal-dark text-gray-300 text-sm outline-none focus:border-terminal-green">

            <option value="all">[ALL STATUS]</option>
            <option value="active">[ACTIVE]</option>
            <option value="acknowledged">[ACKNOWLEDGED]</option>
            <option value="resolved">[RESOLVED]</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-terminal-dark rounded border border-terminal-red/30 p-3 text-center">
          <p className="text-terminal-red text-2xl font-bold">
            {alertsList.filter((a) => a.severity === 'critical').length}
          </p>
          <p className="text-gray-500 text-xs">[CRITICAL]</p>
        </div>
        <div className="bg-terminal-dark rounded border border-terminal-amber/30 p-3 text-center">
          <p className="text-terminal-amber text-2xl font-bold">
            {alertsList.filter((a) => a.severity === 'high').length}
          </p>
          <p className="text-gray-500 text-xs">[HIGH]</p>
        </div>
        <div className="bg-terminal-dark rounded border border-terminal-green/30 p-3 text-center">
          <p className="text-terminal-green text-2xl font-bold">
            {alertsList.filter((a) => a.status === 'active').length}
          </p>
          <p className="text-gray-500 text-xs">[ACTIVE]</p>
        </div>
        <div className="bg-terminal-dark rounded border border-gray-500/30 p-3 text-center">
          <p className="text-gray-300 text-2xl font-bold">
            {alertsList.filter((a) => a.status === 'resolved').length}
          </p>
          <p className="text-gray-500 text-xs">[RESOLVED]</p>
        </div>
      </div>

      {/* Alert Log */}
      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        className="relative bg-terminal-dark rounded-lg border border-terminal-green/30 neon-box-green overflow-hidden">

        <span className="absolute -top-px -left-px text-terminal-green/60 text-xs">
          ┌
        </span>
        <span className="absolute -top-px -right-px text-terminal-green/60 text-xs">
          ┐
        </span>
        <span className="absolute -bottom-px -left-px text-terminal-green/60 text-xs">
          └
        </span>
        <span className="absolute -bottom-px -right-px text-terminal-green/60 text-xs">
          ┘
        </span>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-terminal-green/20 bg-terminal-green/5">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-xs">[</span>
            <span className="text-gray-400 text-xs uppercase tracking-wider">
              Alert Log
            </span>
            <span className="text-gray-500 text-xs">]</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-terminal-green rounded-full status-blink" />
            <span className="text-terminal-green text-xs">MONITORING</span>
          </div>
        </div>

        {/* Alerts */}
        <div className="divide-y divide-terminal-green/10 max-h-[600px] overflow-y-auto">
          <AnimatePresence>
            {filteredAlerts.map((alert, index) => {
              const config = severityConfig[alert.severity];
              const status = statusConfig[alert.status];
              const Icon = config.icon;
              return (
                <motion.div
                  key={alert.id}
                  initial={{
                    opacity: 0,
                    x: -20
                  }}
                  animate={{
                    opacity: 1,
                    x: 0
                  }}
                  exit={{
                    opacity: 0,
                    x: 20
                  }}
                  transition={{
                    duration: 0.2,
                    delay: index * 0.03
                  }}
                  className="p-4 hover:bg-terminal-green/5 transition-colors cursor-pointer">

                  <div className="flex items-start gap-4">
                    <div className={`mt-1 ${config.color} ${config.glow}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <span className="text-gray-500 text-xs font-mono">
                          {alert.timestamp}
                        </span>
                        <span className={`text-xs font-bold ${config.color}`}>
                          [{alert.severity.toUpperCase()}]
                        </span>
                        <span
                          className={`text-xs ${status.color} ${status.blink ? 'status-blink' : ''}`}>

                          [{status.label}]
                        </span>
                        <span className="text-gray-500 text-xs">
                          src: {alert.source}
                        </span>
                      </div>
                      <h3 className="text-white font-medium mb-1">
                        {alert.title}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {alert.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {alert.status === 'active' &&
                      <button
                        onClick={() =>
                        handleStatusChange(alert.id, 'acknowledged')
                        }
                        className="p-2 text-terminal-amber hover:bg-terminal-amber/10 rounded transition-colors"
                        title="Acknowledge">

                          <CheckCircleIcon className="w-4 h-4" />
                        </button>
                      }
                      {alert.status !== 'resolved' &&
                      <button
                        onClick={() =>
                        handleStatusChange(alert.id, 'resolved')
                        }
                        className="p-2 text-gray-400 hover:text-terminal-red hover:bg-terminal-red/10 rounded transition-colors"
                        title="Resolve">

                          <XIcon className="w-4 h-4" />
                        </button>
                      }
                    </div>
                  </div>
                </motion.div>);

            })}
          </AnimatePresence>
        </div>

        {filteredAlerts.length === 0 &&
        <div className="p-8 text-center text-gray-500">
            <p>No alerts match the current filters</p>
          </div>
        }
      </motion.div>
    </div>);

}