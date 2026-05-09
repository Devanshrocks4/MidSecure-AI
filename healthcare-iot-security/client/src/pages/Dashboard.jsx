import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, AlertTriangle, RefreshCw, Activity, Wifi, Lock, Shield } from 'lucide-react';
import { StatCard, Panel, Button } from '../components/ui';
import { TrafficChart, ThreatDoughnutChart } from '../components/Charts';
import { StatCounter, LiveCounter } from '../components/AnimatedCounter';
import { useLiveEvents, useLiveEventSubscription, useLastThreat, useStats, useTrafficData, useIsSimulating, injectThreat, start, stop, startSimulation, stopSimulation } from '../utils/liveEvents';
import { useToast } from '../utils/toast';

// Hospital zones with live device counts
const initialZones = [
  { name: 'ICU', count: 42, status: 'ok' },
  { name: 'Operating Theatres', count: 28, status: 'ok' },
  { name: 'Emergency', count: 35, status: 'warn' },
  { name: 'General Wards', count: 98, status: 'ok' },
  { name: 'Cardiology', count: 22, status: 'ok' },
  { name: 'Imaging', count: 22, status: 'ok' },
];

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [zones, setZones] = useState(initialZones);
  const [lastPulse, setLastPulse] = useState(null);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const toast = useToast();
  
  // Get live events state - use SPECIFIC selectors to avoid full subscriptions
  const stats = useStats();
  const lastThreat = useLastThreat();
  const trafficData = useTrafficData();
  const isSimulating = useIsSimulating();
  
// Refs for callbacks to prevent re-renders
  const toastRef = useRef(toast);
  toastRef.current = toast;
  
  // Note: Live events are now started globally in App.jsx
  // No need to start/stop here - shared across all pages
  
  // Update time every second - stable timer
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);  // Empty deps - run once
  
// Subscribe to threat events - use stable reference
  useEffect(() => {
    // Get the subscribe function once, not on every render
    const store = useLiveEvents.getState();
    
    // Store the unsubscribe function returned by subscribe
    const unsubscribeThreat = store.subscribe('onThreat', (threat) => {
      // Use functional update to avoid depending on recentAlerts
      setRecentAlerts(prev => [{
        id: threat.id,
        type: threat.type,
        severity: threat.severity,
        device: threat.deviceId,
        ip: threat.srcIp,
        time: 'just now',
        zone: threat.zone,
      }, ...prev].slice(0, 10));
      
      // Pulse effect
      setLastPulse({ severity: threat.severity, timestamp: Date.now() });
      
      // Toast notification - avoid using stale toast ref
      if (threat.severity === 'critical') {
        toastRef.current?.error(`CRITICAL: ${threat.type}`, `${threat.threatType} detected`);
      } else if (threat.severity === 'high') {
        toastRef.current?.warning(`Threat: ${threat.type}`, threat.threatType);
      }
    });
    
    // Cleanup: call the unsubscribe function returned from subscribe
    return unsubscribeThreat;
  }, []);  // Empty deps - run once on mount, subscribe once
  
  // Subscribe to pulse events - separate effect with empty deps
  useEffect(() => {
    const store = useLiveEvents.getState();
    
    const unsubscribePulse = store.subscribe('onPulse', (pulse) => {
      setLastPulse(pulse);
    });
    
    return unsubscribePulse;
  }, []);
  
  // Handle simulate attack
  const handleSimulateAttack = useCallback(() => {
    injectThreat(true, []);
    toast.info('Threat Injected', 'New threat event generated');
  }, []);
  
  // Handle start/stop simulation
  const handleToggleSimulation = useCallback(() => {
    if (isSimulating) {
      stopSimulation();
      toast.info('Simulation Stopped', 'Automatic threat generation disabled');
    } else {
      startSimulation();
      toast.info('Simulation Started', 'Automatic threat generation enabled');
    }
  }, [isSimulating]);
  
  // Handle refresh
  const handleRefresh = useCallback(() => {
    start();
    toast.success('Data Refreshed', 'Live data streams restarted');
  }, []);
  
  const timeString = currentTime.toLocaleTimeString('en-GB', { hour12: false });
  
  // Calculate animated threat count
  const threatBreakdown = recentAlerts.reduce((acc, alert) => {
    if (alert.severity === 'critical') acc.critical = (acc.critical || 0) + 1;
    else if (alert.severity === 'high') acc.high = (acc.high || 0) + 1;
    else if (alert.severity === 'medium') acc.medium = (acc.medium || 0) + 1;
    else acc.low = (acc.low || 0) + 1;
    return acc;
  }, { critical: 2, high: 3, medium: 2 });
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
      className="relative"
    >
      {/* Pulse flash overlay for critical threats */}
      <AnimatePresence>
        {lastPulse && lastPulse.severity === 'critical' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 pointer-events-none z-50 bg-critical"
          />
        )}
      </AnimatePresence>
      
      {/* Header */}
      <header className="flex justify-between items-end mb-8 gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary font-mono mb-2 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-critical animate-pulse' : 'bg-success'}`} />
            Live overview · {timeString}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-text font-ui tracking-tight">
            Security <em className="text-primary not-italic">Command</em> Center
          </h1>
          <p className="text-text-dim mt-2 max-w-xl">
            Real-time monitoring of your healthcare IoT estate with AI-powered threat detection.
          </p>
        </div>
        <div className="flex gap-2.5 flex-wrap">
          <Button 
            variant={isSimulating ? 'danger' : 'ghost'}
            onClick={handleToggleSimulation}
          >
            <Zap className={`w-4 h-4 ${isSimulating ? 'animate-pulse' : ''}`} />
            {isSimulating ? 'Stop Simulation' : 'Auto Simulate'}
          </Button>
          <Button variant="ghost" onClick={handleSimulateAttack}>
            <AlertTriangle className="w-4 h-4" />
            Inject Attack
          </Button>
          <Button onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </header>
      
      {/* Live Stat Cards with pulse effects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div
          animate={lastPulse?.severity === 'critical' ? {
            boxShadow: ['0 0 0 rgba(244, 63, 94, 0)', '0 0 30px rgba(244, 63, 94, 0.5)', '0 0 0 rgba(244, 63, 94, 0)'],
          } : {}}
          transition={{ duration: 0.5 }}
        >
          <StatCard
            label="Active Devices"
            value={<LiveCounter value={stats.devices} />}
            trend="+12%"
            trendUp
          >
            <div className="flex items-center gap-2 mt-2">
              <Activity className="w-3 h-3 text-primary" />
              <span className="text-xs text-primary font-mono">{stats.activeConnections} active</span>
            </div>
          </StatCard>
        </motion.div>
        
        <StatCard
          label="Encrypted Flows / min"
          value={<LiveCounter value={stats.encryptedFlows} />}
          trend="+3.2%"
          trendUp
        >
          <div className="flex items-center gap-2 mt-2">
            <Lock className="w-3 h-3 text-success" />
            <Wifi className="w-3 h-3 text-primary" />
            <span className="text-xs text-text-muted font-mono">AES-256 · TLS 1.3</span>
          </div>
        </StatCard>
        
        <motion.div
          animate={lastPulse ? {
            borderColor: ['rgba(88, 166, 255, 0.15)', 'rgba(244, 63, 94, 0.5)', 'rgba(88, 166, 255, 0.15)'],
            scale: [1, 1.02, 1],
          } : {}}
          transition={{ duration: 0.4 }}
        >
          <StatCard
            label="Open Threats"
            value={<LiveCounter value={stats.openThreats} />}
            trend="−2"
            warning={stats.openThreats > 5}
            className={lastPulse?.severity === 'critical' ? 'border-critical/50' : ''}
          >
            <p className="text-xs text-text-muted font-mono mt-1 flex gap-2">
              <span className="text-critical">{threatBreakdown.critical} critical</span>
              <span className="text-warning">{threatBreakdown.medium} medium</span>
            </p>
          </StatCard>
        </motion.div>
        
        <StatCard
          label="Detection Accuracy"
          value={<><LiveCounter value={stats.accuracy} decimals={1} />%</>}
          trend="RF + LSTM"
          trendUp
        >
          <div className="flex items-center gap-2 mt-2">
            <Shield className="w-3 h-3 text-accent" />
            <span className="text-xs text-text-muted font-mono">FPR 2.1% · {stats.packetsPerSec} pkt/s</span>
          </div>
        </StatCard>
      </div>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Panel 
          title="Network Traffic Classification" 
          subtitle="Real-time flow analysis · live updates"
          className="lg:col-span-2"
        >
          <div className="flex gap-1.5 mb-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border border-success/30 text-success bg-success/5">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />Benign
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border border-warning/30 text-warning bg-warning/5">
              <span className="w-1.5 h-1.5 rounded-full bg-warning" />Reconnaissance
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border border-critical/30 text-critical bg-critical/5">
              <span className="w-1.5 h-1.5 rounded-full bg-critical" />DoS
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border border-accent/30 text-accent bg-accent/5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />Exfiltration
            </span>
          </div>
          <TrafficChart data={trafficData} live />
        </Panel>
        
        <Panel title="Threat Type Distribution" subtitle="Live threat categories">
          <ThreatDoughnutChart threats={recentAlerts} />
        </Panel>
      </div>
      
      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Hospital Device Health Map with live updates */}
        <Panel title="Hospital Device Health Map" subtitle="Real-time device status">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {zones.map((zone) => {
              // Check if any recent threat affects this zone
              const affected = recentAlerts.some(a => 
                a.zone === zone.name && 
                (a.severity === 'critical' || a.severity === 'high')
              );
              
              return (
                <motion.div 
                  key={zone.name}
                  initial={ affected ? { scale: 0.95 } : false }
                  animate={ affected ? { 
                    scale: [1, 1.05, 1],
                    borderColor: ['rgba(88, 166, 255, 0.15)', 'rgba(244, 63, 94, 0.5)', 'rgba(88, 166, 255, 0.15)'],
                  } : {}}
                  transition={{ duration: 0.5 }}
                  className={`p-3.5 bg-surface-2 border border-border-soft rounded-sm hover:border-border transition-colors ${
                    affected ? 'border-critical/50 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : ''
                  }`}
                >
                  <p className="text-sm font-semibold text-text">{zone.name}</p>
                  <p className="text-xs text-text-muted font-mono">{zone.count} devices</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      affected ? 'bg-critical animate-pulse' : zone.status === 'ok' ? 'bg-success' : 'bg-warning'
                    }`} />
                    <span className={`text-xs font-mono ${
                      affected ? 'text-critical' : zone.status === 'ok' ? 'text-success' : 'text-warning'
                    }`}>
                      {affected ? 'ALERT' : zone.status === 'ok' ? '●正常' : '●警告'}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Panel>
        
        {/* Recent Alerts with live updates */}
        <Panel title="Recent Alerts" subtitle="Live threat feed" action="/threats">
          <div className="space-y-2.5 max-h-[280px] overflow-y-auto">
            <AnimatePresence>
              {recentAlerts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 text-center text-text-dim"
                >
                  <Shield className="w-8 h-8 mx-auto mb-2 text-success/50" />
                  <p className="text-sm">No active threats</p>
                  <p className="text-xs text-text-muted">System secure</p>
                </motion.div>
              ) : (
                recentAlerts.map((alert, i) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: 20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.05 }}
                    className={`p-3 bg-surface-2 border-l-4 rounded-sm flex items-center gap-3 ${
                      alert.severity === 'critical' ? 'border-l-critical' :
                      alert.severity === 'high' ? 'border-l-warning' :
                      'border-l-info'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      alert.severity === 'critical' ? 'bg-critical/20 text-critical' :
                      alert.severity === 'high' ? 'bg-warning/20 text-warning' :
                      'bg-info/20 text-info'
                    }`}>
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text">{alert.type}</p>
                      <p className="text-xs text-text-muted font-mono truncate">
                        {alert.zone} · {alert.ip}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded ${
                        alert.severity === 'critical' ? 'bg-critical/20 text-critical' :
                        alert.severity === 'high' ? 'bg-warning/20 text-warning' :
                        'bg-info/20 text-info'
                      }`}>
                        {alert.severity}
                      </span>
                      <p className="text-xs text-text-muted font-mono mt-1">{alert.time}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </Panel>
      </div>
    </motion.div>
  );
}
