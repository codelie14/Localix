import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, ExternalLinkIcon } from 'lucide-react';
import { TerminalTable } from '../components/ui/TerminalTable';
import { Button } from '../components/ui/Button';
import { api, type Vulnerability } from '../services/api';

const severityColors = {
  critical: 'text-terminal-red bg-terminal-red/10 border-terminal-red/30',
  high: 'text-terminal-amber bg-terminal-amber/10 border-terminal-amber/30',
  medium: 'text-terminal-green bg-terminal-green/10 border-terminal-green/30',
  low: 'text-gray-400 bg-gray-500/10 border-gray-500/30'
};
const statusColors = {
  open: 'text-terminal-red',
  in_progress: 'text-terminal-amber',
  resolved: 'text-terminal-green'
};
export function VulnerabilitiesPage() {
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [selectedVuln, setSelectedVuln] = useState<Vulnerability | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch vulnerabilities from backend
    api.getVulnerabilities({ limit: 100 })
      .then((data) => {
        setVulnerabilities(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching vulnerabilities:', err);
        setLoading(false);
      });
  }, []);

  const filteredData =
  severityFilter === 'all' ?
  vulnerabilities :
  vulnerabilities.filter((v) => v.severity === severityFilter);
  const columns = [
  {
    key: 'cve_id',
    header: 'CVE ID',
    width: '140px',
    render: (item: Vulnerability) =>
    <span className="text-terminal-green font-mono">{item.cve_id}</span>

  },
  {
    key: 'title',
    header: 'Title',
    render: (item: Vulnerability) =>
    <span className="text-gray-300 truncate block max-w-xs">
          {item.title}
        </span>

  },
  {
    key: 'severity',
    header: 'Severity',
    width: '100px',
    render: (item: Vulnerability) =>
    <span
      className={`px-2 py-1 rounded text-xs font-medium border ${severityColors[item.severity]}`}>

          {item.severity.toUpperCase()}
        </span>

  },
  {
    key: 'cvss_score',
    header: 'CVSS',
    width: '80px',
    render: (item: Vulnerability) =>
    <span
      className={
      item.cvss_score && item.cvss_score >= 9 ?
      'text-terminal-red' :
      item.cvss_score && item.cvss_score >= 7 ?
      'text-terminal-amber' :
      'text-terminal-green'
      }>

          {item.cvss_score?.toFixed(1) || 'N/A'}
        </span>

  },
  {
    key: 'vendor',
    header: 'Vendor',
    width: '120px',
    render: (item: Vulnerability) =>
    <span className="text-gray-300">
          {item.vendor || 'Unknown'}
        </span>
  },
  {
    key: 'status',
    header: 'Status',
    width: '100px',
    render: (item: Vulnerability) =>
    <span className={`text-xs ${statusColors[item.status]}`}>
          {item.status.replace('_', ' ').toUpperCase()}
        </span>

  }];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-2">
        <span className="text-terminal-green">&gt;</span>
        <h1 className="text-xl font-semibold text-white">Vulnerabilities</h1>
        <span className="text-gray-500 text-sm"> // cve database</span>
      </div>

      {/* Table */}
      <TerminalTable
        data={filteredData}
        columns={columns}
        pageSize={8}
        searchPlaceholder="search --cve --vendor"
        onRowClick={setSelectedVuln}
        filters={
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-4 py-2 rounded border border-terminal-green/30 bg-terminal-dark text-gray-300 text-sm outline-none focus:border-terminal-green">

            <option value="all">[ALL SEVERITY]</option>
            <option value="critical">[CRITICAL]</option>
            <option value="high">[HIGH]</option>
            <option value="medium">[MEDIUM]</option>
            <option value="low">[LOW]</option>
          </select>
        } />


      {/* Detail Modal */}
      <AnimatePresence>
        {selectedVuln &&
        <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedVuln(null)}>

            <motion.div
            initial={{
              scale: 0.9,
              opacity: 0
            }}
            animate={{
              scale: 1,
              opacity: 1
            }}
            exit={{
              scale: 0.9,
              opacity: 0
            }}
            className="bg-terminal-dark border border-terminal-green/30 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto neon-box-green"
            onClick={(e) => e.stopPropagation()}>

              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-terminal-green/20">
                <div className="flex items-center gap-3">
                  <span className="text-terminal-green font-mono text-lg">
                    {selectedVuln.cve_id}
                  </span>
                  <span
                  className={`px-2 py-1 rounded text-xs font-medium border ${severityColors[selectedVuln.severity]}`}>

                    {selectedVuln.severity.toUpperCase()}
                  </span>
                </div>
                <button
                onClick={() => setSelectedVuln(null)}
                className="p-2 text-gray-400 hover:text-terminal-green transition-colors">

                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="text-white font-medium mb-2">
                    {selectedVuln.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>Vendor: {selectedVuln.vendor || 'Unknown'}</span>
                    <span>Product: {selectedVuln.product || 'Unknown'}</span>
                    <span>Published: {selectedVuln.published_date ? new Date(selectedVuln.published_date).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>

                {/* AI Summary */}
                <div className="bg-terminal-black rounded border border-terminal-green/20 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-terminal-green text-xs">
                      [AI_SUMMARY]
                    </span>
                  </div>
                  <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono">
                    {`This vulnerability allows remote attackers to execute arbitrary 
code on affected installations. Authentication is not required 
to exploit this vulnerability.

The specific flaw exists within the processing of serialized 
data. The issue results from the lack of proper validation of 
user-supplied data, which can result in deserialization of 
untrusted data.`}
                  </pre>
                </div>

                {/* MITRE Mapping */}
                <div className="bg-terminal-black rounded border border-terminal-green/20 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-terminal-amber text-xs">
                      [MITRE_ATT&CK]
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Tactic:</span>
                      <span className="text-terminal-green">
                        Execution (TA0002)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Technique:</span>
                      <span className="text-terminal-green">
                        Exploitation for Client Execution (T1203)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Platform:</span>
                      <span className="text-gray-300">
                        Windows, Linux, macOS
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <Button
                  onClick={() =>
                  window.open(
                    `https://nvd.nist.gov/vuln/detail/${selectedVuln.cve_id}`,
                    '_blank'
                  )
                  }
                  icon={<ExternalLinkIcon className="w-4 h-4" />}>

                    View on NVD
                  </Button>
                  <Button variant="secondary">Mark as In Progress</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>

      {loading && (
        <div className="text-center py-8 text-terminal-green">
          Loading vulnerabilities...
        </div>
      )}
    </div>);

}