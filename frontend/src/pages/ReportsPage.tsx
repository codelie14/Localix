import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileTextIcon,
  DownloadIcon,
  CalendarIcon,
  ClockIcon,
  FolderIcon,
  FileIcon,
  PlusIcon,
  RefreshCwIcon } from
'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input } from '../ui/Input';
import { api } from '../services/api';

interface Report {
  id: string;
  name: string;
  type: 'vulnerability' | 'threat' | 'compliance' | 'incident';
  format: 'PDF' | 'CSV' | 'JSON';
  size?: string;
  generated: string;
  status: 'ready' | 'generating' | 'scheduled';
}

const typeColors = {
  vulnerability: 'text-terminal-red',
  threat: 'text-terminal-amber',
  compliance: 'text-terminal-green',
  incident: 'text-purple-400'
};
const formatIcons = {
  PDF: '📄',
  CSV: '📊',
  JSON: '{ }'
};
export function ReportsPage() {
  const [reportsList, setReportsList] = useState<Report[]>([]);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newReport, setNewReport] = useState<{
    name: string;
    type: string;
    format: string;
  }>({
    name: '',
    type: 'vulnerability',
    format: 'PDF'
  });

  useEffect(() => {
    // Fetch reports from backend
    api.getReports({ limit: 50 })
      .then((data) => {
        setReportsList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching reports:', err);
        setLoading(false);
      });
  }, []);

  const refreshReports = () => {
    setLoading(true);
    api.getReports({ limit: 50 })
      .then((data) => {
        setReportsList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error refreshing reports:', err);
        setLoading(false);
      });
  };

  const handleExportAll = () => {
    const dataStr = JSON.stringify(reportsList, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reports-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleGenerate = () => {
    setShowGenerateModal(true);
  };

  const handleConfirmGenerate = () => {
    // Call backend API to generate report
    api.generateReport({
      name: newReport.name,
      report_type: newReport.type,
      format: newReport.format
    })
      .then((result) => {
        setReportsList((current) => [
          ...current,
          {
            name: newReport.name,
            type: newReport.type as 'vulnerability' | 'threat' | 'compliance' | 'incident',
            format: newReport.format as 'PDF' | 'CSV' | 'JSON',
            id: result.id || Date.now().toString(),
            generated: new Date().toISOString().slice(0, 16).replace('T', ' '),
            status: 'generating'
          }
        ]);
        setShowGenerateModal(false);
        setNewReport({ name: '', type: 'vulnerability', format: 'PDF' });
        
        // Simulate generation completion
        setTimeout(() => {
          setReportsList((current) =>
            current.map((r) =>
              r.status === 'generating' ?
              {
                ...r,
                status: 'ready',
                size: `${(Math.random() * 5 + 1).toFixed(1)} MB`
              } :
              r
            )
          );
        }, 3000);
      })
      .catch((err) => {
        console.error('Error generating report:', err);
        alert('Failed to generate report');
        setShowGenerateModal(false);
      });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-terminal-green">&gt;</span>
          <h1 className="text-xl font-semibold text-white">Reports</h1>
          <span className="text-gray-500 text-sm"> // generated documents</span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleExportAll}
            icon={<DownloadIcon className="w-4 h-4" />}
            variant="secondary">
            Export All
          </Button>
          
          <Button
            onClick={refreshReports}
            icon={<RefreshCwIcon className="w-4 h-4" />}
            variant="secondary"
            disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
          
          <Button
            onClick={handleGenerate}
            icon={<PlusIcon className="w-4 h-4" />}>
            Generate Report
          </Button>
        </div>
      </div>

      {/* Directory Header */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
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

        {/* Terminal Header */}
        <div className="px-4 py-3 border-b border-terminal-green/20 bg-terminal-green/5">
          <div className="flex items-center gap-2 text-sm font-mono">
            <span className="text-terminal-green">&gt;</span>
            <span className="text-gray-400">ls -la /reports/</span>
          </div>
        </div>

        {/* Column Headers */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-terminal-green/20 text-xs text-terminal-green uppercase tracking-wider">
          <div className="col-span-5">[NAME]</div>
          <div className="col-span-2">[TYPE]</div>
          <div className="col-span-1">[FMT]</div>
          <div className="col-span-1">[SIZE]</div>
          <div className="col-span-2">[DATE]</div>
          <div className="col-span-1">[ACT]</div>
        </div>

        {/* File Listing */}
        <div className="divide-y divide-terminal-green/10">
          {/* Parent Directory */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm text-gray-500 hover:bg-terminal-green/5 transition-colors cursor-pointer">
            <div className="col-span-5 flex items-center gap-2">
              <FolderIcon className="w-4 h-4 text-terminal-amber" />
              <span>..</span>
            </div>
            <div className="col-span-2">--</div>
            <div className="col-span-1">--</div>
            <div className="col-span-1">--</div>
            <div className="col-span-2">--</div>
            <div className="col-span-1">--</div>
          </div>

          {reportsList.map((report, index) =>
          <motion.div
            key={report.id}
            initial={{
              opacity: 0,
              x: -20
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            transition={{
              delay: index * 0.05
            }}
            className={`grid grid-cols-12 gap-4 px-4 py-3 text-sm hover:bg-terminal-green/5 transition-colors cursor-pointer ${report.status !== 'ready' ? 'opacity-60' : ''}`}>

              <div className="col-span-5 flex items-center gap-2 min-w-0">
                <FileIcon
                className={`w-4 h-4 flex-shrink-0 ${typeColors[report.type]}`} />

                <span className="text-gray-300 truncate">{report.name}</span>
              </div>
              <div className={`col-span-2 ${typeColors[report.type]}`}>
                {report.type}
              </div>
              <div className="col-span-1 text-gray-400 font-mono">
                {formatIcons[report.format]}
              </div>
              <div className="col-span-1 text-gray-400">{report.size}</div>
              <div className="col-span-2 text-gray-500 text-xs">
                {report.status === 'generating' ?
              <span className="text-terminal-amber status-blink">
                    {report.generated}
                  </span> :
              report.status === 'scheduled' ?
              <span className="text-terminal-green">
                    {report.generated}
                  </span> :

              report.generated
              }
              </div>
              <div className="col-span-1">
                {report.status === 'ready' &&
              <button className="p-1 text-gray-400 hover:text-terminal-green transition-colors">
                    <DownloadIcon className="w-4 h-4" />
                  </button>
              }
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-terminal-green/20 text-xs text-gray-500 font-mono">
          <span className="text-terminal-green">{reportsList.length}</span>{' '}
          files, <span className="text-terminal-green">27.9 MB</span> total
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.button
          onClick={() => {
            setNewReport({ ...newReport, type: 'vulnerability' });
            setShowGenerateModal(true);
          }}
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
          className="relative bg-terminal-dark rounded-lg border border-terminal-green/30 p-4 text-left hover:bg-terminal-green/5 transition-colors group">

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
          <FileTextIcon className="w-6 h-6 text-terminal-red mb-2 group-hover:neon-red-glow transition-all" />
          <p className="text-white font-medium">Vulnerability Report</p>
          <p className="text-gray-500 text-xs">Generate CVE summary</p>
        </motion.button>

        <motion.button
          onClick={() => {
            setNewReport({ ...newReport, type: 'threat' });
            setShowGenerateModal(true);
          }}
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
          className="relative bg-terminal-dark rounded-lg border border-terminal-green/30 p-4 text-left hover:bg-terminal-green/5 transition-colors group">

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
          <FileTextIcon className="w-6 h-6 text-terminal-amber mb-2 group-hover:neon-amber-glow transition-all" />
          <p className="text-white font-medium">Threat Report</p>
          <p className="text-gray-500 text-xs">Export threat intel</p>
        </motion.button>

        <motion.button
          onClick={() => {
            setNewReport({ ...newReport, type: 'compliance' });
            setShowGenerateModal(true);
          }}
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
          className="relative bg-terminal-dark rounded-lg border border-terminal-green/30 p-4 text-left hover:bg-terminal-green/5 transition-colors group">

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
          <FileTextIcon className="w-6 h-6 text-terminal-green mb-2 group-hover:neon-green-glow transition-all" />
          <p className="text-white font-medium">Compliance Report</p>
          <p className="text-gray-500 text-xs">Audit documentation</p>
        </motion.button>

        <motion.button
          onClick={() => setShowGenerateModal(true)}
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.6
          }}
          className="relative bg-terminal-dark rounded-lg border border-terminal-green/30 p-4 text-left hover:bg-terminal-green/5 transition-colors group">

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
          <CalendarIcon className="w-6 h-6 text-purple-400 mb-2" />
          <p className="text-white font-medium">Schedule Report</p>
          <p className="text-gray-500 text-xs">Automate generation</p>
        </motion.button>
      </div>

      {/* Generate Report Modal */}
      <Modal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        title="Generate New Report">

        <div className="space-y-4">
          <Input
            label="Report Name"
            placeholder="e.g. Q1_Security_Audit"
            value={newReport.name}
            onChange={(e) => setNewReport({ ...newReport, name: e.target.value })} />


          <div>
            <label className="block text-gray-400 text-xs mb-2">
              [REPORT_TYPE]
            </label>
            <select
              value={newReport.type}
              onChange={(e) => setNewReport({ ...newReport, type: e.target.value })}
              className="w-full px-4 py-2 rounded border border-terminal-green/30 bg-terminal-black text-gray-300 outline-none focus:border-terminal-green transition-colors">

              <option value="vulnerability">Vulnerability</option>
              <option value="threat">Threat Intelligence</option>
              <option value="compliance">Compliance</option>
              <option value="incident">Incident Response</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 text-xs mb-2">
              [EXPORT_FORMAT]
            </label>
            <select
              value={newReport.format}
              onChange={(e) => setNewReport({ ...newReport, format: e.target.value })}
              className="w-full px-4 py-2 rounded border border-terminal-green/30 bg-terminal-black text-gray-300 outline-none focus:border-terminal-green transition-colors">

              <option value="PDF">PDF Document</option>
              <option value="CSV">CSV Spreadsheet</option>
              <option value="JSON">JSON Data</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setShowGenerateModal(false)}>

              Cancel
            </Button>
            <Button onClick={handleConfirmGenerate} disabled={!newReport.name}>
              Execute Generation
            </Button>
          </div>
        </div>
      </Modal>
    </div>);

}