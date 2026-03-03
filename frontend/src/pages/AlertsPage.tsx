import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangleIcon,
  ShieldAlertIcon,
  InfoIcon,
  CheckCircleIcon,
  XIcon,
  FilterIcon,
  RefreshCwIcon,
  BellIcon,
  DownloadIcon } from
'lucide-react';
import { Button } from '../components/ui/Button';
import { api, type Alert as AlertType } from '../services/api';

interface Alert {
  id: string;
  timestamp: string;
  title: string;
  description?: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  source?: string;
  status: 'active' | 'acknowledged' | 'resolved';
}

const alerts: Alert[] = [];

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
  const [alertsList, setAlertsList] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch alerts from backend
    api.getAlerts({ limit: 100 })
      .then((data) => {
        setAlertsList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching alerts:', err);
        setLoading(false);
      });
  }, []);

  const refreshAlerts = () => {
    setLoading(true);
    api.getAlerts({ limit: 100 })
      .then((data) => {
        setAlertsList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error refreshing alerts:', err);
        setLoading(false);
      });
  };

  const handleStatusChange = (
    id: string,
    newStatus: 'acknowledged' | 'resolved'
  ) => {
    api.updateAlertStatus(id, newStatus)
      .then((updatedAlert) => {
        setAlertsList((current) =>
          current.map((alert) =>
            alert.id === id ? { ...alert, status: newStatus } : alert
          )
        );
      })
      .catch((err) => {
        console.error('Error updating alert status:', err);
        // Fallback to local update
        setAlertsList((current) =>
          current.map((alert) =>
            alert.id === id ? { ...alert, status: newStatus } : alert
          )
        );
      });
  };
  const filteredAlerts = alertsList.filter((alert) => {
    const severityMatch = filter === 'all' || alert.severity === filter;
    const statusMatch = statusFilter === 'all' || alert.status === statusFilter;
    return severityMatch && statusMatch;
  });

  const handleAcknowledgeAll = () => {
    alertsList
      .filter(a => a.status === 'active')
      .forEach(alert => {
        api.updateAlertStatus(alert.id, 'acknowledged')
          .catch(err => console.error('Error acknowledging alert:', err));
      });
    setAlertsList(current => 
      current.map(alert => 
        alert.status === 'active' ? { ...alert, status: 'acknowledged' } : alert
      )
    );
  };

  const handleExportAlerts = () => {
    const dataStr = JSON.stringify(filteredAlerts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `alerts-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };
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
          <Button
            onClick={handleAcknowledgeAll}
            icon={<CheckCircleIcon className="w-4 h-4" />}
            variant="secondary">
            Ack All
          </Button>
          
          <Button
            onClick={handleExportAlerts}
            icon={<DownloadIcon className="w-4 h-4" />}
            variant="secondary">
            Export
          </Button>
          
          <Button
            onClick={refreshAlerts}
            icon={<RefreshCwIcon className="w-4 h-4" />}
            variant="secondary"
            disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
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