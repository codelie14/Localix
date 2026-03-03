import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileTextIcon,
  DownloadIcon,
  CalendarIcon,
  ClockIcon,
  FolderIcon,
  FileIcon } from
'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input } from '../ui/Input';
interface Report {
  id: string;
  name: string;
  type: 'vulnerability' | 'threat' | 'compliance' | 'incident';
  format: 'PDF' | 'CSV' | 'JSON';
  size: string;
  generated: string;
  status: 'ready' | 'generating' | 'scheduled';
}
const reports: Report[] = [
{
  id: '1',
  name: 'Monthly_Vulnerability_Report_Jan2024',
  type: 'vulnerability',
  format: 'PDF',
  size: '2.4 MB',
  generated: '2024-01-15 08:00',
  status: 'ready'
},
{
  id: '2',
  name: 'Threat_Intelligence_Summary_Q1',
  type: 'threat',
  format: 'PDF',
  size: '1.8 MB',
  generated: '2024-01-14 12:30',
  status: 'ready'
},
{
  id: '3',
  name: 'CVE_Export_Full_Database',
  type: 'vulnerability',
  format: 'CSV',
  size: '15.2 MB',
  generated: '2024-01-13 06:00',
  status: 'ready'
},
{
  id: '4',
  name: 'Compliance_Audit_SOC2_2024',
  type: 'compliance',
  format: 'PDF',
  size: '4.1 MB',
  generated: '2024-01-12 14:00',
  status: 'ready'
},
{
  id: '5',
  name: 'Incident_Response_IR2024-001',
  type: 'incident',
  format: 'PDF',
  size: '892 KB',
  generated: '2024-01-11 16:45',
  status: 'ready'
},
{
  id: '6',
  name: 'Weekly_Threat_Feed_Export',
  type: 'threat',
  format: 'JSON',
  size: '3.7 MB',
  generated: 'Generating...',
  status: 'generating'
},
{
  id: '7',
  name: 'Monthly_Executive_Summary_Feb2024',
  type: 'vulnerability',
  format: 'PDF',
  size: '--',
  generated: 'Scheduled: 2024-02-01',
  status: 'scheduled'
}];

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
  const [reportsList, setReportsList] = useState<Report[]>(reports);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [newReportName, setNewReportName] = useState('');
  const [newReportType, setNewReportType] = useState<
    'vulnerability' | 'threat' | 'compliance' | 'incident'>(
    'vulnerability');
  const [newReportFormat, setNewReportFormat] = useState<
    'PDF' | 'CSV' | 'JSON'>(
    'PDF');
  const handleGenerateReport = () => {
    if (!newReportName) return;
    const newReport: Report = {
      id: Date.now().toString(),
      name: newReportName.replace(/\s+/g, '_'),
      type: newReportType,
      format: newReportFormat,
      size: '--',
      generated: 'Generating...',
      status: 'generating'
    };
    setReportsList([newReport, ...reportsList]);
    setIsGenerateModalOpen(false);
    setNewReportName('');
    // Simulate generation completion
    setTimeout(() => {
      setReportsList((current) =>
      current.map((r) =>
      r.id === newReport.id ?
      {
        ...r,
        status: 'ready',
        size: '1.2 MB',
        generated: new Date().
        toISOString().
        slice(0, 16).
        replace('T', ' ')
      } :
      r
      )
      );
    }, 3000);
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

        <Button
          onClick={() => setIsGenerateModalOpen(true)}
          icon={<FileTextIcon className="w-4 h-4" />}>

          Generate New Report
        </Button>
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
            setNewReportType('vulnerability');
            setIsGenerateModalOpen(true);
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
            setNewReportType('threat');
            setIsGenerateModalOpen(true);
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
            setNewReportType('compliance');
            setIsGenerateModalOpen(true);
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
          onClick={() => setIsGenerateModalOpen(true)}
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
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Generate New Report">

        <div className="space-y-4">
          <Input
            label="Report Name"
            placeholder="e.g. Q1_Security_Audit"
            value={newReportName}
            onChange={(e) => setNewReportName(e.target.value)} />


          <div>
            <label className="block text-gray-400 text-xs mb-2">
              [REPORT_TYPE]
            </label>
            <select
              value={newReportType}
              onChange={(e) => setNewReportType(e.target.value as any)}
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
              value={newReportFormat}
              onChange={(e) => setNewReportFormat(e.target.value as any)}
              className="w-full px-4 py-2 rounded border border-terminal-green/30 bg-terminal-black text-gray-300 outline-none focus:border-terminal-green transition-colors">

              <option value="PDF">PDF Document</option>
              <option value="CSV">CSV Spreadsheet</option>
              <option value="JSON">JSON Data</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setIsGenerateModalOpen(false)}>

              Cancel
            </Button>
            <Button onClick={handleGenerateReport} disabled={!newReportName}>
              Execute Generation
            </Button>
          </div>
        </div>
      </Modal>
    </div>);

}