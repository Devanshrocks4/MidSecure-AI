import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileCheck, Download, Shield, Globe, Building, AlertCircle } from 'lucide-react';
import { Panel, Button, Select } from '../components/ui';
import { Store, formatTime } from '../utils/store';
import { useToast } from '../utils/toast';

const complianceData = [
  { id: 'hipaa', name: 'HIPAA Security Rule', desc: '§164.312 Technical Safeguards · access control · audit · integrity · transmission security.', score: 96, color: 'from-primary to-secondary' },
  { id: 'gdpr', name: 'GDPR Article 32', desc: 'Security of processing · pseudonymisation, encryption, confidentiality & resilience.', score: 92, color: 'from-secondary to-accent' },
  { id: 'dpdpa', name: 'DPDPA 2023 (India)', desc: 'Digital Personal Data Protection Act · processing of patient data · breach notification.', score: 89, color: 'from-accent to-primary' },
];

export default function Compliance() {
  const [standard, setStandard] = useState('HIPAA');
  const [period, setPeriod] = useState('30');
  const [format, setFormat] = useState('html');
  const [auditLog, setAuditLog] = useState([]);
  const toast = useToast();
  
  useEffect(() => {
    setAuditLog(Store.audit);
  }, []);
  
  const generateReport = () => {
    toast.success('Report Generated', `${standard} compliance report for last ${period} days`);
    // In real app, would generate and download report
  };
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header className="mb-6">
        <p className="text-xs uppercase tracking-widest text-primary font-mono mb-2">Audit & Reporting</p>
        <h1 className="text-4xl font-bold text-text font-ui">
          Regulatory <em className="text-primary not-italic">Compliance</em>
        </h1>
        <p className="text-text-dim mt-2">HIPAA Security Rule · GDPR Art. 32 · DPDPA 2023 · tamper-evident audit logs.</p>
      </header>
      
      {/* Compliance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {complianceData.map((comp, index) => (
          <motion.div
            key={comp.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-5 bg-surface-1 border border-border-soft rounded-lg relative overflow-hidden"
          >
            <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${comp.color}`} />
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-mono font-bold tracking-wider text-text">{comp.id.toUpperCase()}</span>
              <span className="text-xs font-medium text-success">✓ Compliant</span>
            </div>
            <h3 className="text-xl font-display text-text mb-2">{comp.name}</h3>
            <p className="text-xs text-text-dim mb-3 line-clamp-2">{comp.desc}</p>
            <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${comp.score}%` }}
                transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                className={`h-full bg-gradient-to-r ${comp.color} rounded-full`}
              />
            </div>
            <span className="text-sm font-mono text-primary">{comp.score}%</span>
          </motion.div>
        ))}
      </div>
      
      {/* Report Generator */}
      <Panel title="Generate Compliance Report" subtitle="Tamper-evident summary of audit logs, threat detection metrics & encryption verification."
        className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Select label="Report Standard" value={standard} onChange={(e) => setStandard(e.target.value)}>
            <option value="HIPAA">HIPAA Security Rule</option>
            <option value="GDPR">GDPR Article 32</option>
            <option value="DPDPA">DPDPA 2023</option>
            <option value="ALL">All Standards</option>
          </Select>
          <Select label="Reporting Period" value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </Select>
          <Select label="Format" value={format} onChange={(e) => setFormat(e.target.value)}>
            <option value="html">HTML / Print to PDF</option>
            <option value="json">JSON</option>
          </Select>
        </div>
        <Button onClick={generateReport}>
          <Download className="w-4 h-4" />
          Generate & Download
        </Button>
      </Panel>
      
      {/* Audit Log */}
      <Panel title="Recent Audit Events" subtitle="append-only">
        <div className="space-y-px max-h-[300px] overflow-y-auto">
          {auditLog.map((entry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-4 p-3 bg-surface-2 text-xs"
            >
              <span className="text-text-muted font-mono whitespace-nowrap min-w-[80px]">
                {new Date(entry.time).toLocaleTimeString('en-GB', { hour12: false })}
              </span>
              <span className="font-mono text-primary min-w-[140px]">{entry.action}</span>
              <span className="flex-1 text-text-dim truncate">{entry.detail}</span>
              <span className="text-text-muted font-mono text-right">{entry.actor}</span>
            </motion.div>
          ))}
        </div>
      </Panel>
    </motion.div>
  );
}
