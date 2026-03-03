import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangleIcon, ShieldAlertIcon, InfoIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
interface ThreatEntry {
  id: string;
  timestamp: string;
  cveId: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
}
const threats: ThreatEntry[] = [
{
  id: '1',
  timestamp: '2024-01-15 14:32:18',
  cveId: 'CVE-2024-0001',
  title: 'Remote Code Execution in Apache Log4j',
  severity: 'critical',
  source: 'NVD'
},
{
  id: '2',
  timestamp: '2024-01-15 14:28:45',
  cveId: 'CVE-2024-0002',
  title: 'SQL Injection in WordPress Plugin',
  severity: 'high',
  source: 'MITRE'
},
{
  id: '3',
  timestamp: '2024-01-15 14:15:22',
  cveId: 'CVE-2024-0003',
  title: 'XSS Vulnerability in React Framework',
  severity: 'medium',
  source: 'GitHub'
},
{
  id: '4',
  timestamp: '2024-01-15 14:02:11',
  cveId: 'CVE-2024-0004',
  title: 'Buffer Overflow in OpenSSL',
  severity: 'critical',
  source: 'NVD'
},
{
  id: '5',
  timestamp: '2024-01-15 13:48:33',
  cveId: 'CVE-2024-0005',
  title: 'Authentication Bypass in Cisco IOS',
  severity: 'high',
  source: 'CISA'
},
{
  id: '6',
  timestamp: '2024-01-15 13:35:09',
  cveId: 'CVE-2024-0006',
  title: 'Information Disclosure in Microsoft Edge',
  severity: 'low',
  source: 'MSRC'
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
export function ThreatFeed() {
  const navigate = useNavigate();
  return (
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
        duration: 0.4,
        delay: 0.5
      }}
      className="relative bg-terminal-dark rounded-lg border border-terminal-green/30 p-5 neon-box-green">

      {/* ASCII corners */}
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

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-xs">[</span>
          <span className="text-gray-400 text-xs uppercase tracking-wider">
            Live Threat Feed
          </span>
          <span className="text-gray-500 text-xs">]</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-terminal-green rounded-full status-blink" />
          <span className="text-terminal-green text-xs">LIVE</span>
        </div>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {threats.map((threat, index) => {
          const config = severityConfig[threat.severity];
          const Icon = config.icon;
          return (
            <motion.div
              key={threat.id}
              initial={{
                opacity: 0,
                x: -20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              transition={{
                duration: 0.3,
                delay: index * 0.05
              }}
              className={`flex items-start gap-3 p-3 rounded border ${config.border} ${config.bg} hover:bg-opacity-20 transition-colors cursor-pointer`}>

              <Icon
                className={`w-4 h-4 mt-0.5 flex-shrink-0 ${config.color} ${config.glow}`} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-gray-500 text-xs font-mono">
                    {threat.timestamp}
                  </span>
                  <span className={`text-xs font-bold ${config.color}`}>
                    [{threat.severity.toUpperCase()}]
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-terminal-green text-sm font-mono">
                    {threat.cveId}
                  </span>
                  <span className="text-gray-500 text-xs">
                    via {threat.source}
                  </span>
                </div>
                <p className="text-gray-300 text-sm truncate">{threat.title}</p>
              </div>
            </motion.div>);

        })}
      </div>

      <div className="mt-4 pt-4 border-t border-terminal-green/20 text-center">
        <button
          onClick={() => navigate('/threat-intelligence')}
          className="text-terminal-green text-xs hover:underline">

          View all threats →
        </button>
      </div>
    </motion.div>);

}