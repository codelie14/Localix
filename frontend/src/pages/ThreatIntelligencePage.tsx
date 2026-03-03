import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GlobeIcon,
  ShieldAlertIcon,
  TrendingUpIcon,
  AlertTriangleIcon,
  MapPinIcon,
  ClockIcon,
  SearchIcon,
  FilterIcon,
  RefreshCwIcon,
  PlusIcon,
  DownloadIcon } from
'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../ui/Input';
import { api, type ThreatActor, type IndicatorOfCompromise } from '../services/api';

const activityColors = {
  critical: 'text-terminal-red pulse-critical',
  high: 'text-terminal-amber',
  medium: 'text-terminal-green',
  low: 'text-gray-400'
};

export function ThreatIntelligencePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [threats, setThreats] = useState<ThreatActor[]>([]);
  const [iocs, setIOCs] = useState<IndicatorOfCompromise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch threat intelligence data from backend
    Promise.all([
      api.getThreats({ limit: 50 }),
      api.getIOCs({ limit: 100 })
    ])
      .then(([threatsData, iocsData]) => {
        setThreats(threatsData);
        setIOCs(iocsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching threat intelligence:', err);
        setLoading(false);
      });
  }, []);

  const filteredActors = threats.filter((actor) => {
    const matchesSearch =
      actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      actor.origin_country?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === 'all' || actor.activity_level === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredIOCs = iocs.filter((ioc) => {
    const matchesSearch = 
      ioc.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ioc.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const refreshData = () => {
    setLoading(true);
    Promise.all([
      api.getThreats({ limit: 50 }),
      api.getIOCs({ limit: 100 })
    ])
      .then(([threatsData, iocsData]) => {
        setThreats(threatsData);
        setIOCs(iocsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error refreshing data:', err);
        setLoading(false);
      });
  };

  const handleAddThreat = () => {
    alert('Open modal to add new threat actor (to be implemented)');
    // TODO: Implement create threat modal
  };

  const handleExportIOCs = () => {
    // Export IOCs as CSV or JSON
    const dataStr = JSON.stringify(iocs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `iocs-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-terminal-green">&gt;</span>
          <h1 className="text-xl font-semibold text-white">
            Threat Intelligence
          </h1>
          <span className="text-gray-500 text-sm">
            {' '}
            // global threat landscape
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={handleAddThreat}
            icon={<PlusIcon className="w-4 h-4" />}>
            Add Threat
          </Button>
          
          <Button
            onClick={handleExportIOCs}
            icon={<DownloadIcon className="w-4 h-4" />}
            variant="secondary">
            Export IOCs
          </Button>
          
          <Button
            onClick={refreshData}
            icon={<RefreshCwIcon className="w-4 h-4" />}
            variant="secondary"
            disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="relative bg-terminal-dark rounded-lg border border-terminal-green/30 p-4 neon-box-green">

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
          <div className="flex items-center gap-3">
            <GlobeIcon className="w-8 h-8 text-terminal-green" />
            <div>
              <p className="text-gray-400 text-xs">[ACTIVE_CAMPAIGNS]</p>
              <p className="text-2xl font-bold text-terminal-green">47</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.1
          }}
          className="relative bg-terminal-dark rounded-lg border border-terminal-amber/30 p-4 neon-box-amber">

          <span className="absolute -top-px -left-px text-terminal-amber/60 text-xs">
            ┌
          </span>
          <span className="absolute -top-px -right-px text-terminal-amber/60 text-xs">
            ┐
          </span>
          <span className="absolute -bottom-px -left-px text-terminal-amber/60 text-xs">
            └
          </span>
          <span className="absolute -bottom-px -right-px text-terminal-amber/60 text-xs">
            ┘
          </span>
          <div className="flex items-center gap-3">
            <ShieldAlertIcon className="w-8 h-8 text-terminal-amber" />
            <div>
              <p className="text-gray-400 text-xs">[THREAT_ACTORS]</p>
              <p className="text-2xl font-bold text-terminal-amber">23</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.2
          }}
          className="relative bg-terminal-dark rounded-lg border border-terminal-red/30 p-4 neon-box-red">

          <span className="absolute -top-px -left-px text-terminal-red/60 text-xs">
            ┌
          </span>
          <span className="absolute -top-px -right-px text-terminal-red/60 text-xs">
            ┐
          </span>
          <span className="absolute -bottom-px -left-px text-terminal-red/60 text-xs">
            └
          </span>
          <span className="absolute -bottom-px -right-px text-terminal-red/60 text-xs">
            ┘
          </span>
          <div className="flex items-center gap-3">
            <AlertTriangleIcon className="w-8 h-8 text-terminal-red" />
            <div>
              <p className="text-gray-400 text-xs">[IOCs_TODAY]</p>
              <p className="text-2xl font-bold text-terminal-red">1,247</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.3
          }}
          className="relative bg-terminal-dark rounded-lg border border-terminal-green/30 p-4 neon-box-green">

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
          <div className="flex items-center gap-3">
            <TrendingUpIcon className="w-8 h-8 text-terminal-green" />
            <div>
              <p className="text-gray-400 text-xs">[INTEL_FEEDS]</p>
              <p className="text-2xl font-bold text-terminal-green">12</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threat Actors */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.4
          }}
          className="relative bg-terminal-dark rounded-lg border border-terminal-green/30 p-5 neon-box-green flex flex-col">

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

          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-xs">[</span>
              <span className="text-gray-400 text-xs uppercase tracking-wider">
                Active Threat Actors
              </span>
              <span className="text-gray-500 text-xs">]</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <SearchIcon className="w-3 h-3 text-gray-500 absolute left-2 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search actors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-terminal-black border border-terminal-green/30 rounded pl-7 pr-2 py-1 text-xs text-gray-300 outline-none focus:border-terminal-green w-32 focus:w-48 transition-all" />

              </div>
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="bg-terminal-black border border-terminal-green/30 rounded px-2 py-1 text-xs text-gray-300 outline-none focus:border-terminal-green">

                <option value="all">All Activity</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto pr-2">
            <AnimatePresence>
              {filteredActors.map((actor, index) =>
              <motion.div
                key={actor.name}
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
                  delay: index * 0.05
                }}
                className="flex items-center justify-between p-3 rounded border border-terminal-green/20 hover:bg-terminal-green/5 transition-colors cursor-pointer">

                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${actor.activity_level === 'critical' ? 'bg-terminal-red status-blink' : actor.activity_level === 'high' ? 'bg-terminal-amber' : actor.activity_level === 'medium' ? 'bg-terminal-green' : 'bg-gray-500'}`} />

                    <div>
                      <p className="text-white font-medium">{actor.name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <MapPinIcon className="w-3 h-3" />
                        <span>{actor.origin_country || 'Unknown'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-xs font-medium ${activityColors[actor.activity_level as keyof typeof activityColors]}`}>
                      {actor.activity_level.toUpperCase()}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <ClockIcon className="w-3 h-3" />
                      <span>{actor.last_seen || 'N/A'}</span>
                    </div>
                  </div>
                </motion.div>
              )}
              {filteredActors.length === 0 &&
              <motion.div
                initial={{
                  opacity: 0
                }}
                animate={{
                  opacity: 1
                }}
                className="text-center py-8 text-gray-500 text-sm">

                  No threat actors match your search criteria.
                </motion.div>
              }
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Recent IOCs */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.5
          }}
          className="relative bg-terminal-dark rounded-lg border border-terminal-green/30 p-5 neon-box-green">

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

          <div className="flex items-center gap-2 mb-4">
            <span className="text-gray-500 text-xs">[</span>
            <span className="text-gray-400 text-xs uppercase tracking-wider">
              Recent Indicators of Compromise
            </span>
            <span className="text-gray-500 text-xs">]</span>
          </div>

          <div className="space-y-2">
            {filteredIOCs.map((ioc, index) => (
              <motion.div
                key={ioc.id || index}
                initial={{
                  opacity: 0,
                  x: -20
                }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                transition={{
                  delay: 0.6 + index * 0.05
                }}
                className="flex items-center justify-between p-3 rounded border border-terminal-green/20 hover:bg-terminal-green/5 transition-colors cursor-pointer font-mono text-sm">

                  <div className="flex items-center gap-3">
                    <span className="text-terminal-amber text-xs w-16">
                      [{ioc.type}]
                    </span>
                    <span className="text-gray-300 truncate max-w-[200px]">
                      {ioc.value}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-terminal-red text-xs">
                      {ioc.threat_type || 'Unknown'}
                    </span>
                    <span
                      className={`text-xs ${ioc.confidence_score && ioc.confidence_score >= 90 ? 'text-terminal-green' : ioc.confidence_score && ioc.confidence_score >= 70 ? 'text-terminal-amber' : 'text-gray-400'}`}>
                      {ioc.confidence_score ? `${ioc.confidence_score}%` : 'N/A'}
                    </span>
                  </div>
                </motion.div>
              ))}
            {filteredIOCs.length === 0 && (
              <motion.div
                initial={{
                  opacity: 0
                }}
                animate={{
                  opacity: 1
                }}
                className="text-center py-8 text-gray-500 text-sm">
                No IOCs match your search criteria.
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>);

}