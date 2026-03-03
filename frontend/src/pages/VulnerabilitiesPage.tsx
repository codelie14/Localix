import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, ExternalLinkIcon } from 'lucide-react';
import { TerminalTable } from '../components/ui/TerminalTable';
import { Button } from '../components/ui/Button';
interface Vulnerability {
  id: string;
  cveId: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  cvss: number;
  vendor: string;
  product: string;
  published: string;
  status: 'open' | 'in_progress' | 'resolved';
}
const vulnerabilities: Vulnerability[] = [
{
  id: '1',
  cveId: 'CVE-2024-0001',
  title: 'Remote Code Execution in Apache Log4j',
  severity: 'critical',
  cvss: 9.8,
  vendor: 'Apache',
  product: 'Log4j',
  published: '2024-01-10',
  status: 'open'
},
{
  id: '2',
  cveId: 'CVE-2024-0002',
  title: 'SQL Injection in WordPress Plugin',
  severity: 'high',
  cvss: 8.1,
  vendor: 'WordPress',
  product: 'WooCommerce',
  published: '2024-01-09',
  status: 'in_progress'
},
{
  id: '3',
  cveId: 'CVE-2024-0003',
  title: 'XSS Vulnerability in React Framework',
  severity: 'medium',
  cvss: 6.5,
  vendor: 'Meta',
  product: 'React',
  published: '2024-01-08',
  status: 'resolved'
},
{
  id: '4',
  cveId: 'CVE-2024-0004',
  title: 'Buffer Overflow in OpenSSL',
  severity: 'critical',
  cvss: 9.1,
  vendor: 'OpenSSL',
  product: 'OpenSSL',
  published: '2024-01-07',
  status: 'open'
},
{
  id: '5',
  cveId: 'CVE-2024-0005',
  title: 'Authentication Bypass in Cisco IOS',
  severity: 'high',
  cvss: 7.8,
  vendor: 'Cisco',
  product: 'IOS',
  published: '2024-01-06',
  status: 'in_progress'
},
{
  id: '6',
  cveId: 'CVE-2024-0006',
  title: 'Information Disclosure in Microsoft Edge',
  severity: 'low',
  cvss: 4.3,
  vendor: 'Microsoft',
  product: 'Edge',
  published: '2024-01-05',
  status: 'resolved'
},
{
  id: '7',
  cveId: 'CVE-2024-0007',
  title: 'Privilege Escalation in Linux Kernel',
  severity: 'high',
  cvss: 7.5,
  vendor: 'Linux',
  product: 'Kernel',
  published: '2024-01-04',
  status: 'open'
},
{
  id: '8',
  cveId: 'CVE-2024-0008',
  title: 'Denial of Service in Nginx',
  severity: 'medium',
  cvss: 5.9,
  vendor: 'Nginx',
  product: 'Nginx',
  published: '2024-01-03',
  status: 'in_progress'
}];

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
  const [selectedVuln, setSelectedVuln] = useState<Vulnerability | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const filteredData =
  severityFilter === 'all' ?
  vulnerabilities :
  vulnerabilities.filter((v) => v.severity === severityFilter);
  const columns = [
  {
    key: 'cveId',
    header: 'CVE ID',
    width: '140px',
    render: (item: Vulnerability) =>
    <span className="text-terminal-green font-mono">{item.cveId}</span>

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
    key: 'cvss',
    header: 'CVSS',
    width: '80px',
    render: (item: Vulnerability) =>
    <span
      className={
      item.cvss >= 9 ?
      'text-terminal-red' :
      item.cvss >= 7 ?
      'text-terminal-amber' :
      'text-terminal-green'
      }>

          {item.cvss.toFixed(1)}
        </span>

  },
  {
    key: 'vendor',
    header: 'Vendor',
    width: '120px'
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
                    {selectedVuln.cveId}
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
                    <span>Vendor: {selectedVuln.vendor}</span>
                    <span>Product: {selectedVuln.product}</span>
                    <span>Published: {selectedVuln.published}</span>
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
                    `https://nvd.nist.gov/vuln/detail/${selectedVuln.cveId}`,
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
    </div>);

}