import { motion } from 'framer-motion';
import { Shield, Lock, BrainCircuit, FileCheck, Users, GraduationCap, Building } from 'lucide-react';
import { Panel } from '../components/ui';

const pillars = [
  { num: '01', title: 'Secure Communication', desc: 'AES-256 symmetric encryption + TLS 1.3 for every device-to-gateway flow.' },
  { num: '02', title: 'Intelligent Detection', desc: 'Random Forest & LSTM models classify flows in < 500ms with 97.3% accuracy.' },
  { num: '03', title: 'Compliance Reporting', desc: 'Tamper-evident audit logs aligned to HIPAA, GDPR, and DPDPA 2023.' },
];

const techStack = [
  { category: 'IoT Comms', tech: 'MQTT v2 · Mosquitto · TLS 1.3' },
  { category: 'Encryption', tech: 'AES-256-GCM · Web Crypto API' },
  { category: 'ML', tech: 'TensorFlow 2.15 · Scikit-learn 1.4' },
  { category: 'Backend', tech: 'Node.js 18 · Express · Socket.io' },
  { category: 'Database', tech: 'localStorage · IndexedDB' },
  { category: 'Frontend', tech: 'React 18 · Recharts · Framer Motion' },
  { category: 'Datasets', tech: 'UNSW-NB15 · TON_IoT' },
];

const team = [
  { name: 'Harsh Ashok Kumar Chaudhary', role: 'Reg. 12219109 · ML & Detection', initials: 'HC' },
  { name: 'Arpit Singla', role: 'Reg. 12214899 · Backend & Crypto', initials: 'AS' },
  { name: 'Dr. Gopal Ghosh', role: 'Project Mentor · Asst. Professor', initials: 'GG', mentor: true },
];

export default function About() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header className="mb-6">
        <p className="text-xs uppercase tracking-widest text-primary font-mono mb-2">Capstone Project · 2025–2026</p>
        <h1 className="text-4xl font-bold text-text font-ui">
          About <em className="text-primary not-italic">this Project</em>
        </h1>
        <p className="text-text-dim mt-2">Healthcare IoT with Data-Driven Threat Analysis · LPU CSE439.</p>
      </header>
      
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-10 md:p-12 mb-6 bg-surface-1 border border-border rounded-lg overflow-hidden"
      >
        <div className="absolute right-[-100px] top-[-100px] w-[300px] h-[300px] rounded-full bg-primary/[0.1] blur-[100px]" />
        <h2 className="text-3xl md:text-4xl font-display text-text mb-4 max-w-2xl">
          Securing the next 50 billion <em className="text-primary not-italic">healthcare devices</em>.
        </h2>
        <p className="text-text-soft max-w-xl mb-5">
          MedSecure AI is a unified security framework that combines AES-256 encrypted device communications 
          with machine-learning-based intrusion detection and tamper-evident compliance logging — purpose-built 
          for hospital networks where patient safety and data privacy are non-negotiable.
        </p>
        <div className="flex flex-wrap gap-2">
          {['AES-256-GCM', 'TLS 1.3', 'MQTT', 'Random Forest', 'LSTM', 'HIPAA', 'GDPR', 'DPDPA 2023'].map(tag => (
            <span key={tag} className="px-3 py-1.5 text-xs font-medium border border-border rounded-full text-text-soft">
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
      
      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Three Pillars */}
        <Panel title="The Three Pillars">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.num}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-4 py-3 border-b border-border-soft last:border-0"
            >
              <span className="text-2xl font-display text-primary flex-shrink-0">{pillar.num}</span>
              <div>
                <p className="text-sm font-semibold text-text">{pillar.title}</p>
                <p className="text-xs text-text-dim mt-0.5">{pillar.desc}</p>
              </div>
            </motion.div>
          ))}
        </Panel>
        
        {/* Tech Stack */}
        <Panel title="Tech Stack">
          {techStack.map((item, index) => (
            <motion.div
              key={item.category}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="flex justify-between py-2 border-b border-border-soft last:border-0 text-sm"
            >
              <span className="text-text">{item.category}</span>
              <span className="text-text-dim font-mono text-xs">{item.tech}</span>
            </motion.div>
          ))}
        </Panel>
        
        {/* Team */}
        <Panel title="Project Team">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-3 p-3 rounded-sm mb-2 ${
                member.mentor ? 'bg-accent/10 border border-accent/30' : 'bg-surface-2'
              }`}
            >
              <div className={`w-11 h-11 rounded-full flex items-center justify-center font-mono font-bold text-sm ${
                member.mentor 
                  ? 'bg-gradient-to-br from-accent to-secondary text-bg-base' 
                  : 'bg-gradient-to-br from-primary to-secondary text-bg-base'
              }`}>
                {member.initials}
              </div>
              <div>
                <p className="text-sm font-medium text-text">{member.name}</p>
                <p className="text-xs text-text-muted">{member.role}</p>
              </div>
            </motion.div>
          ))}
          <div className="text-center pt-3 mt-2 border-t border-border-soft">
            <p className="text-[10px] text-text-muted font-mono">
              Lovely Professional University · Phagwara
            </p>
            <p className="text-[10px] text-text-muted font-mono">
              School of Computer Science & Engineering
            </p>
          </div>
        </Panel>
      </div>
    </motion.div>
  );
}
