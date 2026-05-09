import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Zap, CheckCircle, AlertTriangle, Filter, Activity, Eye, Wifi, Signal } from 'lucide-react';
import { Panel, Button, Card } from '../components/ui';
import { useToast } from '../utils/toast';
import { Store, randomId, randomIp } from '../utils/store';
import { useLiveEvents, useThreatEvents, useStats, injectThreat, start, stop } from '../utils/liveEvents';
import { LiveCounter } from '../components/AnimatedCounter';

// Cinematic Radar Component
function CinematicRadar({ threats = [] }) {
  const [blips, setBlips] = useState([
    { id: 1, top: '30%', left: '65%', critical: false, age: 0 },
    { id: 2, top: '70%', left: '35%', critical: false, age: 1 },
    { id: 3, top: '55%', left: '80%', critical: false, age: 2 },
    { id: 4, top: '25%', left: '30%', critical: true, age: 3 },
  ]);
  const [ripples, setRipples] = useState([]);
  const [lastThreatTime, setLastThreatTime] = useState(Date.now());
  
  // Add new blip when threat is detected
  useEffect(() => {
    if (threats.length > 0 && threats[0]) {
      const latestThreat = threats[0];
      const timeSinceLastThreat = Date.now() - lastThreatTime;
      
      // Only add new blip if it's a new threat (within last 2 seconds)
      if (timeSinceLastThreat < 2000) {
        const newBlip = {
          id: Date.now(),
          top: `${20 + Math.random() * 60}%`,
          left: `${20 + Math.random() * 60}%`,
          critical: latestThreat.severity === 'critical',
          age: 0,
        };
        
        setBlips(prev => [newBlip, ...prev.slice(0, 6)]);
        
        // Add ripple effect
        const newRipple = {
          id: Date.now(),
          top: newBlip.top,
          left: newBlip.left,
        };
        setRipples(prev => [...prev, newRipple]);
        
        // Remove ripple after animation
        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== newRipple.id));
        }, 1500);
      }
      
      setLastThreatTime(Date.now());
    }
  }, [threats]);
  
  return (
    <div className="relative aspect-square max-w-[280px] mx-auto">
      {/* Background glow */}
      <div className="absolute inset-0 rounded-full bg-primary/[0.06] animate-pulse" />
      
      {/* Radar rings */}
      {[25, 50, 75, 100].map((size, i) => (
        <motion.div 
          key={i}
          className="absolute rounded-full border border-border-soft"
          style={{
            width: `${size}%`,
            height: `${size}%`,
            top: `${50 - size/2}%`,
            left: `${50 - size/2}%`,
          }}
          animate={{
            borderColor: ['rgba(88, 166, 255, 0.08)', 'rgba(34, 211, 238, 0.15)', 'rgba(88, 166, 255, 0.08)'],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      ))}
      
      {/* Crosshairs */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-border-soft" />
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border-soft" />
      
      {/* Main sweep with glow */}
      <motion.div
        className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left"
        style={{
          background: 'conic-gradient(from 0deg, transparent 0deg, rgba(34, 211, 238, 0.4) 25deg, rgba(34, 211, 238, 0.15) 45deg, transparent 60deg)',
          filter: 'blur(2px)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Secondary sweep */}
      <motion.div
        className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left"
        style={{
          background: 'conic-gradient(from 0deg, transparent 0deg, rgba(192, 132, 252, 0.2) 20deg, transparent 40deg)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Ripple effects for new threats */}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute w-4 h-4 rounded-full border border-primary"
            style={{
              top: ripple.top,
              left: ripple.left,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </AnimatePresence>
      
      {/* Threat blips */}
      {blips.map((blip) => (
        <motion.div
          key={blip.id}
          className={`absolute w-2.5 h-2.5 rounded-full ${
            blip.critical ? 'bg-critical shadow-[0_0_10px_rgba(244,63,94,0.8)]' : 'bg-primary shadow-[0_0_8px_rgba(34,211,238,0.6)]'
          }`}
          style={{ 
            top: blip.top, 
            left: blip.left,
            transform: 'translate(-50%, -50%)',
          }}
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{ 
            duration: blip.critical ? 0.8 : 2, 
            repeat: Infinity,
          }}
        />
      ))}
      
      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-primary transform -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
    </div>
  );
}

export default function Threats() {
  const [filter, setFilter] = useState('all');
  const [incidents, setIncidents] = useState([]);
  const [scanned, setScanned] = useState(14392);
  const [blocked, setBlocked] = useState(23);
  const toast = useToast();
  
// Get live events stats - using specific selectors to avoid infinite re-renders
  const stats = useStats();
  const threats = useThreatEvents();
  
  // Initialize on mount
  useEffect(() => {
    start();
    setIncidents(Store.incidents);
    
    return () => stop();
  }, []);
  
  // Subscribe to threat events - use getState to avoid trigger re-renders
  useEffect(() => {
    const store = useLiveEvents.getState();
    const unsubscribe = store.subscribe('onThreat', (threat) => {
      // Update scanned/blocked counts
      setBlocked(b => b + 1);
      toast.error(`${threat.type} detected`, `${threat.threatType}`);
    });
    
    return unsubscribe;
  }, []);
  
  const filtered = incidents.filter(i => filter === 'all' || i.severity === filter);
  
  const injectAttack = useCallback(() => {
    const newThreat = injectThreat(true, Store.devices);
    toast.error(`${newThreat.type} detected`, `${newThreat.threatType} from ${newThreat.srcIp}`);
  }, []);
  
  const handleAck = (id) => {
    Store.updateIncident(id, { status: 'acknowledged' });
    setIncidents([...Store.incidents]);
    toast.info('Acknowledged', `Incident ${id} acknowledged`);
  };
  
  const handleResolve = (id) => {
    Store.updateIncident(id, { status: 'resolved' });
    setIncidents([...Store.incidents]);
    toast.success('Resolved', `Incident ${id} closed`);
  };
  
  const handleDismiss = (id) => {
    Store.incidents = Store.incidents.filter(i => i.id !== id);
    Store.saveIncidents();
    setIncidents([...Store.incidents]);
    toast.info('Dismissed', 'Incident removed from queue');
  };
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header className="flex justify-between items-end mb-6 gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary font-mono mb-2 flex items-center gap-2">
            <Signal className="w-3 h-3 animate-pulse" />
            Active Surveillance
          </p>
          <h1 className="text-4xl font-bold text-text font-ui">
            Threat <em className="text-primary not-italic">Center</em>
          </h1>
          <p className="text-text-dim mt-2">Live incident feed and ML-classified anomalies.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={injectAttack}>
            <Zap className="w-4 h-4" />
            Inject Attack
          </Button>
          <Button variant="ghost" onClick={() => { start(); }}>
            <Activity className="w-4 h-4" />
            Start Live
          </Button>
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Cinematic Radar */}
        <Panel title="Threat Surveillance Radar" subtitle="Live scanning">
          <CinematicRadar threats={threats} />
          <div className="flex justify-around pt-4 mt-4 border-t border-border-soft">
            <div className="text-center">
              <LiveCounter value={stats.flowsScanned} />
              <p className="text-[10px] uppercase text-text-muted font-mono">flows scanned</p>
            </div>
            <div className="text-center">
              <LiveCounter value={stats.threatsBlocked} />
              <p className="text-[10px] uppercase text-text-muted font-mono">threats blocked</p>
            </div>
          </div>
        </Panel>
        
        {/* Incident List */}
        <Panel title="Incident Queue" className="lg:col-span-2">
          <div className="flex gap-1.5 mb-4 flex-wrap">
            {['all', 'critical', 'high', 'medium', 'low'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                  filter === f 
                    ? 'bg-primary text-bg-base border-primary' 
                    : 'border-border text-text-dim hover:text-text'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="space-y-2.5 max-h-[400px] overflow-y-auto">
            <AnimatePresence>
              {filtered.map((inc, index) => (
                <motion.div
                  key={inc.id}
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-3.5 bg-surface-2 border-l-4 rounded-sm ${
                    inc.severity === 'critical' ? 'border-l-critical' :
                    inc.severity === 'high' ? 'border-l-warning' :
                    inc.severity === 'medium' ? 'border-l-warning' :
                    'border-l-info'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-text">{inc.type}</span>
                        <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded ${
                          inc.severity === 'critical' ? 'bg-critical/20 text-critical' :
                          inc.severity === 'high' ? 'bg-warning/20 text-warning' :
                          inc.severity === 'medium' ? 'bg-warning/20 text-warning' :
                          'bg-info/20 text-info'
                        }`}>
                          {inc.severity}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-text-muted font-mono">
                        <span>📍 {(Store.devices.find(d => d.id === inc.deviceId) || {}).name || inc.deviceId}</span>
                        <span>🌐 {inc.srcIp}</span>
                        <span>⏱ {inc.detectionTime ? new Date(Date.now() - new Date(inc.detectionTime).getTime()).toLocaleString('en-GB', { minute: 'numeric' }) + ' min ago' : ''}</span>
                        <span>🎯 {Math.round(inc.confidence * 100)}%</span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        {inc.status === 'open' && (
                          <button onClick={() => handleAck(inc.id)} className="px-2.5 py-1 text-xs border border-border rounded-sm text-text-dim hover:text-primary hover:border-primary transition-colors">
                            Acknowledge
                          </button>
                        )}
                        {inc.status !== 'resolved' && (
                          <button onClick={() => handleResolve(inc.id)} className="px-2.5 py-1 text-xs border border-border rounded-sm text-text-dim hover:text-success hover:border-success transition-colors">
                            Resolve
                          </button>
                        )}
                        <button onClick={() => handleDismiss(inc.id)} className="px-2.5 py-1 text-xs border border-border rounded-sm text-text-dim hover:text-critical hover:border-critical transition-colors">
                          Dismiss
                        </button>
                      </div>
                    </div>
                    <span className={`text-xs uppercase px-2 py-1 rounded ${
                      inc.status === 'open' ? 'bg-critical/20 text-critical' :
                      inc.status === 'acknowledged' ? 'bg-warning/20 text-warning' :
                      'bg-success/20 text-success'
                    }`}>
                      {inc.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Panel>
      </div>
    </motion.div>
  );
}
